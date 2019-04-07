const Search = require('./lib/Search')

const options = {
  fields: [
    'year',
    'title',
    'mediatype',
    'language',
    'date',
    'downloads',
  ],
  max: 50,
  sortBy: {
    year: 'asc',
    downloads: 'asc',
  },
}
const myClass = new Search()
// myClass.setOptions(options)
const test = myClass.searchByArtist('test', options)
test.then((result) => {
  const myData = result
  console.log(myData)
})

// Search.makeSearch('https://archive.org/advancedsearch.php?q=creator%3Atest&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json')
