module.exports = {
  isString(stringToCheck) {
    return Object.prototype.toString.call(stringToCheck) === '[object String]'
  },
  isArray(arrayToCheck) {
    return Object.prototype.toString.call(arrayToCheck) === '[object Array]'
  },
  isObject(objectToCheck) {
    return Object.prototype.toString.call(objectToCheck) === '[object Object]'
  },
}
