const Search = require('./lib/Search')

const myClass = new Search()

const test = myClass.searchByArtist('test')
test.then(result => console.log(result))

// Search.makeSearch('https://archive.org/advancedsearch.php?q=creator%3Atest&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json')
