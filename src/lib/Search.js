// const superagent = require('superagent')
// const jsonp = require('superagent-jsonp')
const jsonp = require('jsonp')

const isString = require('../helpers/checkType')

class Search {
  /**
   * Class with methods to search archive.org's api
   * @constructor
   */
  constructor() {
    this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
    this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json'
    this.results = []
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
    // function onresponse(err, response) {
    //   if (!response) {
    //     return new Error('Empty response')
    //   }
    //   if (err) {
    //     throw new Error(err)
    //   }
    //   const { body } = response
    //   const { numFound } = body.response
    //   const { docs } = body.response
    //   if (numFound === 0) {
    //     throw new Error('no results, please update query params')
    //   }
    //   // eslint-disable-next-line no-console
    //   // console.log(docs)
    //   return docs
    // }
    // superagent.get(constructUrlFromParams).use(jsonp({
    //   timeout: 15000,
    // })).then((err, response) => {
    //   console.log(response)
    //   return response
    // })
    return new Promise((resolve, reject) => {
      jsonp(constructUrlFromParams, null, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * search archive.org by artist.
  * @param {string} searchTerm - The search term.
  */
  searchByArtist(searchTerm) {
    // throw error if string is not passed into function
    if (!isString(searchTerm)) {
      throw new TypeError('searchByArtist() expected a string')
    }
    // finsish constructing url
    const searchType = 'creator'
    const constructUrlFromParams = this.constructMetaSearchUrl(searchType, searchTerm)
    console.log(constructUrlFromParams)
    const test = this.constructor.makeSearch(constructUrlFromParams)
    return test.then(result => result)
    // return constructUrlFromParams
  }
}
module.exports = Search
