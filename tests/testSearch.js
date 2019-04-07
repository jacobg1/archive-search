/* eslint no-unused-expressions: 0 */
const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha
const sinon = require('sinon')

const Search = require('../src/lib/Search')

const searchClass = new Search()

describe('Search', () => {
  describe('constructMetaSearchUrl', () => {
    it('should be called once', () => {
      sinon.spy(searchClass, 'constructMetaSearchUrl')
      searchClass.constructMetaSearchUrl('creator', 'test')
      expect(searchClass.constructMetaSearchUrl.calledOnce).to.be.true
    })
    it('return a string', () => {
      const searchString = searchClass.constructMetaSearchUrl('creator', 'test')
      expect(searchString).to.be.a('string')
    })
    it('string includes base url and function params', () => {
      const searchString = searchClass.constructMetaSearchUrl('creator', 'test')
      expect(searchString).to.satisfy(string => ['test', 'creator', 'https://archive.org/advancedsearch.php'].every(bit => string.includes(bit)))
    })
  })
  describe('searchByArtist', () => {
    it('should be called once', () => {
      sinon.spy(searchClass, 'searchByArtist')
      searchClass.searchByArtist('test')
      expect(searchClass.searchByArtist.calledOnce).to.be.true
    })
    it('return an array of objects', () => {
      const search = searchClass.searchByArtist('test')
      search.then((result) => {
        expect(result).to.be.an('array')
        result.every(i => expect(i).to.be.an('object'))
      })
    })
  })
  describe('setOptions', () => {
    sinon.spy(searchClass, 'setOptions')
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
      searchClass.setOptions(options)
    })
    it('should be called once', () => {
      expect(searchClass.setOptions.calledOnce).to.be.true
    })
    it('should take in an argument representing api search options', () => {
      expect(searchClass.setOptions.getCall(0).args[0]).to.not.be.false
    })
    it('options argument should be an object', () => {
      expect(searchClass.setOptions.getCall(0).args[0]).to.be.an('object')
    })
    it('options.fields should be an array', () => {
      expect(searchClass.setOptions.getCall(0).args[0].fields).to.be.an('array')
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
})
