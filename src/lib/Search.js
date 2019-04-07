/* eslint-disable no-console */
const superagent = require('superagent')
// const jsonp = require('superagent-jsonp')
// const jsonp = require('jsonp')
const jsonp = require('superagent-jsonp')

const checkType = require('../helpers/checkType')

class Search {
  /**
   * Class with methods to search archive.org's api
   * @constructor
   */
  constructor() {
    // base url
    this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'

    // default search params
    this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=120&page=&output=json'
  }

  /**
   * override default search options and build new search url.
   * @param {array} options - Which fields to return from api.
   */
  setOptions(options) {
    // check if passes in options is an object
    if (!checkType.isObject(options)) {
      throw new TypeError('setOptions() expected an Object')
    }

    // error message to display if options syntax is invalid
    const invalidOptionsError = 'Invalid syntax for options. Ex: {fields: [...fields], max: 100(optional)}'

    // loop through options and check keys, throw error if invalid syntax
    Object.keys(options).forEach((option) => {
      if (option !== 'fields' && option !== 'max' && option !== 'sortBy') {
        throw new Error(invalidOptionsError)
      }
    })

    // throw error is options.fields is not an array
    if (!checkType.isArray(options.fields)) {
      throw new Error(invalidOptionsError)
    }

    // add identifier field as this is needed for second api call
    this.metaSearchDefaults = encodeURI('&fl[]=identifier')

    // add each encoded option to search url
    options.fields.forEach((field) => {
      this.metaSearchDefaults += encodeURI(`&fl[]=${field}`)
    })

    // if user specifes sortBy fields add them into url
    if (options.sortBy) {
      this.metaSearchDefaults += this.constructor.setSortBy(options.sortBy)
    }

    // if user specifies max results to return add corresponding value to url
    if (options.max) this.metaSearchDefaults += `&rows=${options.max}&page=`

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
   * build the first part of the meta search url with paramaters.
   * @param {string} searchType - The type of search to make.
   * @param {string} searchTerm - The search term.
   */
  constructMetaSearchUrl(searchType, searchTerm) {
    const searchUrl = `${this.metaSearchBaseUrl}?q=${searchType}%3A${searchTerm}${this.metaSearchDefaults}`
    return searchUrl
  }

  /**
   * make http GET request based on passed in url.
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
            // destructure response
            const { body } = response
            const { numFound } = body.response
            const { docs } = body.response

            // if number foind is zero throw error
            if (numFound === 0) throw new Error('no results, please update query params')

            // resolve response
            resolve(docs)
          }
        })
    })
  }

  /**
   * search archive.org by artist.
  * @param {string} searchTerm - The search term.
  */
  searchByArtist(searchTerm, options = []) {
    // throw error if string is not passed into function
    if (!checkType.isString(searchTerm)) {
      throw new TypeError('searchByArtist() expected a string')
    }

    // if user passes in options object, add options to search url
    if (options.length !== 0) this.setOptions(options)

    // finsish constructing url
    const searchType = 'creator'
    const constructUrlFromParams = this.constructMetaSearchUrl(searchType, searchTerm)

    return this.constructor.makeSearch(constructUrlFromParams)
  }
}
module.exports = Search
