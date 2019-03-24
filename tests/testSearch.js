const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha

const hello =  require('../src/lib/Search')

describe('hello()', () => {
	it('return a string', () => {
		expect(hello()).to.be.a('string')
	})
})	