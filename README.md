## archive-search

[![npm version](https://badge.fury.io/js/archive-search.svg)](https://badge.fury.io/js/archive-search)

Small, zero dependency, Promise based, library to search through archive.org's api, for the browser and node.

## Installing

with npm:

`$ npm install archive-search`

with yarn:

`$ yarn add archive-search`

through cdn: 

```html
<script src="https://unpkg.com/archive-search/dist/search-browser.min.js"></script>
```

## Including

node:

```js
const { archiveSearch } = require('archive-search')
```

ES6:

```js
import { archiveSearch } from 'archive-search' 
```

browser:

```js
var mySearchClass = new archiveSearch.Search() 
```

## Usage

search() - returns a list of search results. Each result has a unique identifier that can be passed into the metaSearch function to obtain an individual collection's data.

```js
archiveSearch.search('Sonny Rollins')
  .then(result => console.log(result))
  .catch((e) => console.log(e))
```

### Options

Fine tune search by passing in options object into the search function.  Full list of possible fields is shown below and can also be found here: <https://archive.org/advancedsearch.php>. Note: must specify fields to return, other options are optional.

```js
const options = {
  searchBy: 'title', // which field to seach by (optional, defaults to creator)
  fields: [ // which fields to return from search (required)
    'avg_rating',
    'backup_location',
    'btih',
    'call_number',
    'collection',
    'contributor',
    'coverage',
    'creator',
    'date',
    'description',
    'downloads',
    'external-identifier',
    'foldoutcount',
    'format',
    'genre',
    'headerImage',
    'imagecount',
    'indexflag',
    'item_size',
    'language',
    'licenseurl',
    'mediatype',
    'members',
    'month',
    'name',
    'noindex',
    'num_reviews',
    'oai_updatedate',
    'publicdate',
    'publisher',
    'related-external-id',
    'reviewdate',
    'rights',
    'scanningcentre',
    'source',
    'stripped_tags',
    'subject',
    'title',
    'type',
    'volume',
    'week',
    'year'
  ],
  max: 500,  // the max results to return from search (optional, defaults to 50)
  sortBy: { // which fields to sort by and whether to sort ascending or descending (optional, can specify up to three)
    year: 'asc',
    date: 'asc',
    downloads: 'desc'
  },  
}

archiveSearch.search('Your search term', options)
  .then(result => console.log(result))
  .catch(e => console.log(e))
```

metaSearch() - pass in an identifier from the main search to access an individual collection.

```js
const identifier = 'gd1967-xx-xx.sbd.studio.81259.flac16'
archiveSearch.metaSearch(identifier)
  .then(result => console.log(result))
  .catch(e => console.log(e))
```
