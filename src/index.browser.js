const { archiveSearch } = require('./lib/Search')

console.log(archiveSearch)
const options = {
  searchBy: 'creator',
  fields: [
    'year',
    'title',
    'mediatype',
    'language',
    'date',
    'downloads',
    'creator',
  ],
  max: 100,
  sortBy: {
    year: 'desc',
    downloads: 'asc',
  },
}

// const myClass = new Search()
// myClass.setOptions(options)
// const test = archiveSearch.search('test', options)

archiveSearch.search('grateful+dead', options).then((result) => {
  const myData = result
  console.log(myData)
})
const testId = 'gd1967-xx-xx.sbd.studio.81259.flac16'
archiveSearch.metaSearch(testId).then((result) => {
  console.log(result)
})

// Search.makeSearch('https://archive.org/advancedsearch.php?q=creator%3Atest&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=title&&fl%5B%5D=description&fl%5B%5D=year&sort%5B%5D=year+asc&sort%5B%5D=&sort%5B%5D=&rows=20000&page=&output=json')
