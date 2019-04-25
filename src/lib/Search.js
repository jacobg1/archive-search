const superagent = require('superagent')
const jsonp = require('superagent-jsonp')

const checkType = require('../helpers/checkType')
const defaultOptions = require('../helpers/defaultOptions')

class Search {
  /**
   * Class with methods to search archive.org's api
   * @constructor
   */
  constructor() {
    this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
    // url from helpers/defaultOptions.js TODO: something better?
    this.metaSearchDefaults = defaultOptions
    this.searchType = 'creator'
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

    Object.keys(options).forEach((option) => {
      if (option !== 'fields' && option !== 'max' && option !== 'sortBy' && option !== 'searchBy') {
        throw new Error(invalidOptionsError)
      }
    })

    if (!checkType.isArray(options.fields)) {
      throw new Error(invalidOptionsError)
    }

    // add identifier field as this is needed for second api call
    this.metaSearchDefaults = encodeURI('&fl[]=identifier')

    options.fields.forEach((field) => {
      this.metaSearchDefaults += encodeURI(`&fl[]=${field}`)
    })

    if (options.sortBy) {
      this.metaSearchDefaults += this.constructor.setSortBy(options.sortBy)
    }

    if (options.max) {
      this.metaSearchDefaults += `&rows=${options.max}&page=`
    }

    // needed to get results back from api in JSON format
    this.metaSearchDefaults += '&output=json'
  }

  /**
   * set fields to sort results by.
   * @static
   * @param {object} sortBy - The fields to sort by and whether to sort asc or desc.
  */
  static setSortBy(sortBy) {
    let sortUrl = ''
    Object.keys(sortBy).forEach((sort) => {
      sortUrl += `&sort[]=${sort}+${sortBy[sort]}`
    })
    return encodeURI(sortUrl)
  }

  /**
   * build the meta search url from function paramaters.
   * @param {string} searchType - The type of search to make.
   * @param {string} searchTerm - The search term.
  */
  constructMetaSearchUrl(searchType, searchTerm) {
    return `${this.metaSearchBaseUrl}?q=${searchType}%3A${searchTerm}${this.metaSearchDefaults}`
  }

  /**
   * make http GET request based on passed in url.
   * returns a promise
   * @async @static
   * @param {string} url - The search url to make GET request with.
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
            const { body } = response
            const { numFound } = body.response
            const { docs } = body.response

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
  */
  searchByArtist(searchTerm, options = []) {
    if (!checkType.isString(searchTerm)) {
      throw new TypeError('searchByArtist() expected a string')
    }

    // if user passes in options object, add options to search url
    if (options.length !== 0) {
      this.setOptions(options)
    } else {
      // otherwise reset url to defaults
      this.metaSearchDefaults = defaultOptions
    }

    const constructUrlFromParams = this.constructMetaSearchUrl(this.searchType, searchTerm)

    // return Promise from makeSearch()
    return this.constructor.makeSearch(constructUrlFromParams)
  }
}

const archiveSearch = new Search()

module.exports = {
  archiveSearch,
  Search,
}
