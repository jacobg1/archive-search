const superagent = require('superagent')
const jsonp = require('superagent-jsonp')

const checkType = require('../helpers/checkType')
const defaultOptions = require('../helpers/defaultOptions')

class Search {
  /**
   * Class with methods to search archive.org's api
   * @constructor - initializes defaults
   */
  constructor() {
    this.searchBaseUrl = 'https://archive.org/advancedsearch.php'
    // url from helpers/defaultOptions.js TODO: something better?
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

    options.fields.forEach((field) => {
      this.searchDefaults += encodeURI(`&fl[]=${field}`)
    })

    if (options.sortBy) {
      this.searchDefaults += this.constructor.setSortBy(options.sortBy)
    }

    if (options.max) {
      this.searchDefaults += `&rows=${options.max}&page=`
    }

    if (options.searchBy) {
      this.searchBy = options.searchBy
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
   * make http GET request based on passed in url.
   * returns a promise
   * @async @static
   * @param {string} constructUrlFromParams - The search url to make GET request with.
   * @return {Promise} returns api call as a Promise
  */
  static makeSearch(constructUrlFromParams) {
    return new Promise((resolve, reject) => {
      superagent
        .get(constructUrlFromParams).use(jsonp({
          timeout: 3000,
        })).end((err, response) => {
          // handle errors
          if (err) reject(err)

          // throw error is response is empty
          if (!response) {
            throw new Error('Null Response', null)
          } else {
            const { numFound, docs } = response.body.response

            // if number found is zero throw error
            if (numFound === 0) throw new Error('no results, please update query params')

            resolve(docs)
          }
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
    if (options.length !== 0) {
      this.setOptions(options)
    } else {
      // otherwise reset url to defaults
      this.searchDefaults = defaultOptions
    }

    const constructUrlFromParams = this.constructSearchUrl(this.searchBy, searchTerm)
    // eslint-disable-next-line no-console
    console.log(constructUrlFromParams)
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

          // throw error is response is empty
          if (!response) {
            throw new Error('Null Response', null)
          } else {
            // const { body } = response
            const {
              files,
              server,
              dir,
              metadata,
            } = response.body

            const responseObject = {
              metadata,
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
          }
        })
    })
  }
}

const archiveSearch = new Search()

module.exports = {
  archiveSearch,
  Search,
}
