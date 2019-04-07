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
})
