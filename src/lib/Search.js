class Search {
	constructor () {
		this.metaSearchUrl = 'https://archive.org/advancedsearch.php'
	}
	searchByArtist(searchTerm) {
		const metaSearchDefaults = '&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json'
		const searchByArtistMetaUrl = this.metaSearchUrl + '?q=creator%3A' + searchTerm + metaSearchDefaults
		return searchByArtistMetaUrl
	}
}
module.exports = Search