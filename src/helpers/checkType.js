function isString(stringToCheck) {
	return Object.prototype.toString.call(stringToCheck) === "[object String]"
}

module.exports = isString