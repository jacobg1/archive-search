const isString = require('../helpers/checkType')
const https = require('https');
// const request = require('request');
const superagent = require('superagent');
const jsonp = require('superagent-jsonp');
class Search {

	/**
	 * Class with methods to search archive.org's api
	 * @constructor
	 */
	constructor () {
		this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
		this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json'
		console.log(https)
	}

	/**
	 * build the first part of the meta search url with paramaters.
	 * @param {string} searchType - The type of search to make.
	 * @param {string} searchTerm - The search term.
	*/
	constructMetaSearchUrl (searchType, searchTerm) {
		const searchUrl = this.metaSearchBaseUrl + '?q=' + searchType + '%3A' + searchTerm + this.metaSearchDefaults
		return searchUrl
	}
	/**
 	 * make http GET request based on passed in url.
	 * @async
   * @param {string} url - The search url to make GET request with.
  */
	makeSearch(constructUrlFromParams) {
		superagent
			.get(constructUrlFromParams).use(jsonp({
				timeout: 3000,
			})).end((err, response) => {
				// response => {}
				console.log(response)
				// err => new Error('404 NotFound')
			});
	}
	/**
 	 * search archive.org by artist.
 	 * @param {string} searchTerm - The search term.
	*/
	searchByArtist(searchTerm) {
		// throw error if string is not passed into function
	  if(!isString(searchTerm)) {
			throw new TypeError('searchByArtist() expected a string') 
		}
		// finsish constructing url
		const searchType = 'creator'
		const constructUrlFromParams = this.constructMetaSearchUrl(searchType, searchTerm)
		this.makeSearch(constructUrlFromParams)
		return constructUrlFromParams
	}
}
module.exports = Search