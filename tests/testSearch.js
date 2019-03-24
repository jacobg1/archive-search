const mocha = require('mocha')
const { expect } = require('chai')

const { describe } = mocha
const { it } = mocha

const Hello =  require('../src/lib/Search')
const helloClass = new Hello

describe('sayHello()', () => {
	it('return a string', () => {
		expect(helloClass.sayHello()).to.be.a('string')
	})
})	