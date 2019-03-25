const isString = require('../helpers/checkType')

class Search {
	
	/**
	 * Class with methods to search archive.org's api
	 * @constructor
	 */
	constructor () {
		this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
		this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json'
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
		return constructUrlFromParams
	}
}
module.exports = Search