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
  constructor(options) {
    console.log(options)
    this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
    this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=120&page=&output=json'
    console.log(decodeURI(this.metaSearchDefaults))
    this.results = []
  }

  /**
   * override default search options and build new search url.
   * @param {array} options - Which fields to return from api.
   */
  setOptions(options) {
    if (!checkType.isObject(options)) {
      throw new TypeError('setOptions() expected an Array')
    }
    const invalidOptionsError = 'Invalid syntax for options. Ex: {fields: [...fields], max: 100(optional)}'
    Object.keys(options).forEach((option) => {
      if (option !== 'fields' && option !== 'max') {
        throw new Error(invalidOptionsError)
      }
    })
    if (!checkType.isArray(options.fields)) {
      throw new Error(invalidOptionsError)
    }
    this.metaSearchDefaults = encodeURI('&fl[]=identifier')

    options.fields.forEach((field) => {
      this.metaSearchDefaults += encodeURI(`&fl[]=${field}`)
    })
    if (options.max) this.metaSearchDefaults += `&rows=${options.max}&page=`
    this.metaSearchDefaults += '&output=json'
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
          // response => {}
          if (err) reject(err)
          if (!response) {
            throw new Error('Null Response', null)
          } else {
            const { body } = response
            const { numFound } = body.response
            if (numFound === 0) throw new Error('no results, please update query params')
            const { docs } = body.response
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
    if (options.length !== 0) this.setOptions(options)
    // finsish constructing url
    const searchType = 'creator'
    const constructUrlFromParams = this.constructMetaSearchUrl(searchType, searchTerm)
    // const search = this.constructor.makeSearch(constructUrlFromParams)
    return this.constructor.makeSearch(constructUrlFromParams)
    // return constructUrlFromParams
  }
}
module.exports = Search
