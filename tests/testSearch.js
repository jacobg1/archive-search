const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha

const Search =  require('../src/lib/Search')
const searchClass = new Search

describe('searchByArtist()', () => {
	it('return a string', () => {
		expect(searchClass.searchByArtist('test')).to.be.a('string')
	})
})	