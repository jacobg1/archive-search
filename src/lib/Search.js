class Search {
	constructor () {
		this.metaSearchBaseUrl = 'https://archive.org/advancedsearch.php'
		this.metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json'
	}
	_constructMetaSearchUrl (searchType, searchTerm) {
		const searchUrl = this.metaSearchBaseUrl + '?q=' + searchType + '%3A' + searchTerm + this.metaSearchDefaults
		return searchUrl
	}
	searchByArtist(searchTerm) {
		const searchType = 'creator'
		const constructUrlFromParams = this._constructMetaSearchUrl(searchType, searchTerm)
		return constructUrlFromParams
	}
}
module.exports = Search