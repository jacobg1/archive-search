## archive-search

Small, zero dependency library to search through archive.org's api

## Installing

with npm:
```bash 
$ npm install archive-search 
```

through cdn: 
```html
<script src="https://unpkg.com/archive-search/dist/search.browser.js"></script>
 ```

## Including

node:
```js 
const { archiveSearch } = require('archive-search')
```

react:
```js
import { archiveSearch }  from 'archive-search' 
```

browser:
```js     
var mySearchClass = new archiveSearch.Search() 
```

## usage

General search - this returns a list of collections each with an identifier that can be used to pull the collection's data

```js
archiveSearch.search('Your search term').then((result) => {
  console.log(result)
})
.catch((e) => console.log(e))
```

Meta search - pass in an identifier from the main search to access an individual collection


```js
const identifier = 'gd1967-xx-xx.sbd.studio.81259.flac16'
archiveSearch.metaSearch(identifier).then((result) => {
  console.log(result)
})
.catch((e) => console.log(e))
```
