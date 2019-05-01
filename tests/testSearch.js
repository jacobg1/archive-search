/* eslint no-unused-expressions: 0 */
const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha
const sinon = require('sinon')

const { archiveSearch } = require('../src/lib/Search')
const { Search } = require('../src/lib/Search')

describe('Search', () => {
  describe('constructSearchUrl', () => {
    it('should be called once', () => {
      sinon.spy(archiveSearch, 'constructSearchUrl')
      archiveSearch.constructSearchUrl('creator', 'test')
      expect(archiveSearch.constructSearchUrl.calledOnce).to.be.true
    })
    it('return a string', () => {
      const searchString = archiveSearch.constructSearchUrl('creator', 'test')
      expect(searchString).to.be.a('string')
    })
    it('string includes base url and function params', () => {
      const searchString = archiveSearch.constructSearchUrl('creator', 'test')
      expect(searchString).to.satisfy(string => ['test', 'creator', 'https://archive.org/advancedsearch.php'].every(bit => string.includes(bit)))
    })
  })
  describe('search', () => {
    it('should be called once', () => {
      sinon.spy(archiveSearch, 'search')
      archiveSearch.search('test')
      expect(archiveSearch.search.calledOnce).to.be.true
    })
    it('return an array of objects', () => {
      const search = archiveSearch.search('test')
      search.then((result) => {
        expect(result).to.be.an('array')
        result.every(i => expect(i).to.be.an('object'))
      })
    })
  })
  describe('setOptions', () => {
    sinon.spy(archiveSearch, 'setOptions')
    beforeEach(() => {
      const options = {
        fields: [
          'year',
          'title',
          'mediatype',
          'language',
        ],
        max: 50,
      }
      archiveSearch.setOptions(options)
    })
    it('should be called once', () => {
      expect(archiveSearch.setOptions.calledOnce).to.be.true
    })
    it('should take in an argument representing api search options', () => {
      expect(archiveSearch.setOptions.getCall(0).args[0]).to.not.be.false
    })
    it('options argument should be an object', () => {
      expect(archiveSearch.setOptions.getCall(0).args[0]).to.be.an('object')
    })
    it('options.fields should be an array', () => {
      expect(archiveSearch.setOptions.getCall(0).args[0].fields).to.be.an('array')
    })
  })
  describe('setSortBy', () => {
    sinon.spy(Search, 'setSortBy')
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
    Search.setSortBy(options.sortBy)
    it('should be called once', () => {
      expect(Search.setSortBy.calledOnce).to.be.true
    })
  })
  describe('metaSearch', () => {
    const testId = 'gd1967-xx-xx.sbd.studio.81259.flac16'

    it('should be called once', () => {
      sinon.spy(archiveSearch, 'metaSearch')
      archiveSearch.metaSearch(testId)
      expect(archiveSearch.metaSearch.calledOnce).to.be.true
    })
    it('return an object', () => {
      archiveSearch.metaSearch(testId).then((result) => {
        expect(result).to.be.an('object')
      })
    })
    it('object should have keys: metadata, reviews, files', async () => {
      const objectProperties = ['metadata', 'reviews', 'files']
      await archiveSearch.metaSearch(testId).then((result) => {
        Object.keys(result).forEach((item) => {
          expect(objectProperties).to.include(item)
        })
      })
    })
  })
})
