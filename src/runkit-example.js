const { archiveSearch } = require('archive-search')

const options = {
  searchBy: 'title',
  fields: [
    'creator',
    'date',
    'description',
    'downloads',
    'mediatype',
    'title',
    'type',
    'year',
  ],
  max: 500,
  sortBy: {
    date: 'asc',
  },
}

archiveSearch.search('test', options)
  .then(result => console.log(result))
  .catch(e => console.log(e))

const identifier = 'gd1967-xx-xx.sbd.studio.81259.flac16'
archiveSearch.metaSearch(identifier)
  .then(result => console.log(result))
  .catch(e => console.log(e))
