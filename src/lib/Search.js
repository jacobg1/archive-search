/* eslint-disable no-undef */
const superagent = require('superagent')
// const jsonp = require('superagent-jsonp')

const checkType = require('../helpers/checkType')
const defaultOptions = require('../helpers/defaultOptions')

class Search {
  /**
   * Class with methods to search archive.org's api
   * @constructor - initializes defaults
   */
  constructor() {
    this.searchBaseUrl = 'https://archive.org/advancedsearch.php'
    // url from helpers/defaultOptions.js
    this.searchDefaults = defaultOptions
    this.searchBy = 'creator'
    this.metaBaseUrl = 'https://archive.org/metadata/'
  }

  /**
   * check options object syntax,
   * override default search options and build new search url.
   * @param {array} options - Which fields to return from api.
   */
  setOptions(options) {
    if (!checkType.isObject(options)) {
      throw new TypeError('setOptions() expected an Object')
    }

    const invalidOptionsError = 'Invalid syntax for options. Ex: {fields: [...fields], max: 100(optional)}'
    const possibleOptions = ['fields', 'max', 'sortBy', 'searchBy']

    Object.keys(options).forEach((option) => {
      if (possibleOptions.indexOf(option) === -1) {
        throw new Error(`${invalidOptionsError} check field: ${option}`)
      }
    })

    if (!checkType.isArray(options.fields)) {
      throw new Error(invalidOptionsError)
    }

    // add identifier field as this is needed for second api call
    this.searchDefaults = encodeURI('&fl[]=identifier')

    const {
      fields,
      sortBy,
      max,
      searchBy,
    } = options

    fields.forEach((field) => {
      this.searchDefaults += encodeURI(`&fl[]=${field}`)
    })

    if (sortBy) {
      this.searchDefaults += this.constructor.setSortBy(sortBy)
    }

    if (max) {
      this.searchDefaults += `&rows=${max}&page=`
    }

    if (searchBy) {
      this.searchBy = searchBy
    }

    // needed to get results back from api in JSON format
    this.searchDefaults += '&output=json'
  }

  /**
   * set fields to sort results by.
   * @static
   * @param {object} sortBy - The fields to sort by and whether to sort asc or desc.
   * @return {string} encoded url string
  */
  static setSortBy(sortBy) {
    let sortUrl = ''
    Object.keys(sortBy).forEach((sort) => {
      sortUrl += `&sort[]=${sort}+${sortBy[sort]}`
    })
    return encodeURI(sortUrl)
  }

  /**
   * build the search url from function paramaters.
   * @param {string} searchBy - The type of search to make.
   * @param {string} searchTerm - The search term.
   * @return {string} url string
  */
  constructSearchUrl(searchBy, searchTerm) {
    return `${this.searchBaseUrl}?q=${searchBy}%3A${searchTerm}${this.searchDefaults}`
  }

  /**
   * add jsonp to api calls, appends script built from
   * request url to the document head
   * @param {string} url - The constcted search url.
   * @param {Function} callback - Callback to be executed when data is return from api.
  */
  static jsonp(url, callback) {
    // create a unique callback name for each request
    const callbackName = `jsonp_callback_${Math.round(150000 * Math.random())}`
    // add callback function to window object
    window[callbackName] = (data) => {
      callback(data)
      // cleanup after callback fires
      delete window[callbackName]
      // eslint-disable-next-line no-use-before-define
      document.body.removeChild(script)
    }
    // create script and append it to document
    const script = document.createElement('script')
    script.src = `${url + (url.indexOf('?') >= 0 ? '&' : '?')}callback=${callbackName}`
    document.body.appendChild(script)
  }

  /**
   * make http GET request based on passed in url.
   * returns a promise
   * @async @static
   * @param {string} constructUrlFromParams - The search url to make GET request with.
   * @return {Promise} returns api call as a Promise
  */
  static makeSearch(constructUrlFromParams) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.jsonp(constructUrlFromParams, (data) => {
        // if (err) reject(err)

        const { numFound, docs } = data.response

        // if number found is zero throw error
        if (numFound === 0) throw new Error('no results, please update query params')

        resolve(docs)
      })
    })
  }

  /**
   * search archive.org by artist.
   * adds search term to url and calls makeSearch function
   * @param {string} searchTerm - The search term.
   * @return {function} returns makeSearch function which returns a Promise
  */
  search(searchTerm, options = []) {
    if (!checkType.isString(searchTerm)) {
      throw new TypeError('search() expected a string')
    }

    // if user passes in options object, add options to search url
    if (options.length !== 0) this.setOptions(options)

    const constructUrlFromParams = this.constructSearchUrl(this.searchBy, searchTerm)

    // return Promise from makeSearch()
    return this.constructor.makeSearch(constructUrlFromParams)
  }

  /**
   * pulls data from a specific collection based on identifier.
   * @param {string} identifier - The collection to pull data from.
   * @return {Promise} returns a Promise
  */
  metaSearch(identifier) {
    const url = `${this.metaBaseUrl}${identifier}`
    return new Promise((resolve, reject) => {
      superagent
        .get(url).use(jsonp({
          timeout: 3000,
        })).end((err, response) => {
          // handle errors
          if (err) reject(err)

          const {
            files,
            server,
            dir,
            metadata,
            reviews,
          } = response.body

          const responseObject = {
            metadata,
            reviews,
            files: [],
          }

          Object.keys(files).forEach((key) => {
            const { format, name } = files[key]
            if (format !== 'Metadata' && format !== 'JSON') {
              responseObject.files.push({
                format,
                link: `https://${server}${dir}/${name}`,
              })
            }
          })
          resolve(responseObject)
        })
    })
  }
}

const archiveSearch = new Search()

module.exports = {
  archiveSearch,
  Search,
}
