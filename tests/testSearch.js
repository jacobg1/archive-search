const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha

const Search =  require('../src/lib/Search')
const searchClass = new Search

describe('Search', () => {
	describe('constructMetaSearchUrl', () => {
		it('return a string', () => {
			const searchString = searchClass.constructMetaSearchUrl('creator', 'test')
			expect(searchString).to.be.a('string')
		})
		it('string includes base url and function params', () => {
			const searchString = searchClass.constructMetaSearchUrl('creator', 'test')
			expect(searchString).to.satisfy(string =>
				['test', 'creator', 'https://archive.org/advancedsearch.php'].every(bit => string.includes(bit))
			)
		})
	})
	describe('searchByArtist', () => {
		it('return a string', () => {
			expect(searchClass.searchByArtist('test')).to.be.a('string')
		})
	})
})	