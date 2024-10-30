const https = require("https");

const checkType = require("./helpers/checkType");
const defaultOptions = require("./helpers/defaultOptions");

class Search {
  /**
   * Class with methods to search archive.org's api (Node version)
   * @constructor - initializes defaults
   */
  constructor() {
    this.searchBaseUrl = "https://archive.org/advancedsearch.php";
    // url from helpers/defaultOptions.js
    this.searchDefaults = defaultOptions;
    this.searchBy = "creator";
    this.metaBaseUrl = "https://archive.org/metadata/";
  }

  /**
   * check options object syntax,
   * override default search options and build new search url.
   * @param {array} options - Which fields to return from api.
   */
  setOptions(options) {
    if (!checkType.isObject(options)) {
      throw new TypeError("setOptions() expected an Object");
    }

    const possibleOptions = ["fields", "max", "sortBy", "searchBy"];

    Object.keys(options).forEach((option) => {
      if (possibleOptions.indexOf(option) === -1) {
        throw new Error(`Invalid syntax for options check field: ${option}`);
      }
    });

    if (!checkType.isArray(options.fields)) {
      throw new Error("Invalid syntax for options");
    }

    // add identifier field as this is needed for second api call
    this.searchDefaults = encodeURI("&fl[]=identifier");

    const { fields, sortBy, max, searchBy } = options;

    fields.forEach((field) => {
      this.searchDefaults += encodeURI(`&fl[]=${field}`);
    });

    if (sortBy) {
      this.searchDefaults += this.constructor.setSortBy(sortBy);
    }

    if (max) {
      this.searchDefaults += `&rows=${max}&page=1`;
    }

    if (searchBy) {
      this.searchBy = searchBy;
    }

    // needed to get results back from api in JSON format
    this.searchDefaults += "&output=json";
  }

  /**
   * set fields to sort results by.
   * @static
   * @param {object} sortBy - The fields to sort by and whether to sort asc or desc.
   * @return {string} encoded url string
   */
  static setSortBy(sortBy) {
    let sortUrl = "";
    Object.keys(sortBy).forEach((sort) => {
      sortUrl += `&sort[]=${sort}+${sortBy[sort]}`;
    });
    return encodeURI(sortUrl);
  }

  /**
   * build the search url from function paramaters.
   * @param {string} searchBy - The type of search to make.
   * @param {string} searchTerm - The search term.
   * @return {string} url string
   */
  constructSearchUrl(searchBy, searchTerm) {
    return `${this.searchBaseUrl}?q=${searchBy}%3A${searchTerm}${this.searchDefaults}`;
  }

  /**
   * make http GET request based on passed in url.
   * returns a promise
   * @async @static
   * @param {string} constructUrlFromParams - The search url to make GET request with.
   * @return {Promise} returns api call as a Promise
   */
  static makeSearch(constructUrlFromParams) {
    return new Promise((resolve, reject) => {
      https
        .get(constructUrlFromParams, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`statusCode=${res.statusCode}`));
          }
          const body = [];
          res.on("data", (d) => body.push(d));
          res.on("end", () => {
            const parsed = JSON.parse(body.join(""));
            const { response, numFound } = parsed;

            if (numFound === 0) throw new Error("no results, please update query params");

            resolve(response);
          });
        })
        .on("error", (e) => reject(e));
    });
  }

  /**
   * search archive.org by artist.
   * adds search term to url and calls makeSearch function
   * @param {string} searchTerm - The search term.
   * @return {function} returns makeSearch function which returns a Promise
   */
  search(searchTerm, options = []) {
    if (!checkType.isString(searchTerm)) {
      throw new TypeError("search() expected a string");
    }

    // if user passes in options object, add options to search url
    if (options.length !== 0) this.setOptions(options);

    // format search input
    const formatSearchTerm = searchTerm.replace(/\s+/g, "+").toLowerCase();

    const constructUrlFromParams = this.constructSearchUrl(this.searchBy, formatSearchTerm);

    // return Promise from makeSearch()
    return this.constructor.makeSearch(constructUrlFromParams);
  }

  /**
   * pulls data from a specific collection based on identifier.
   * @param {string} identifier - The collection to pull data from.
   * @return {Promise} returns a Promise
   */
  metaSearch(identifier) {
    const url = `${this.metaBaseUrl}${identifier}`;
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`statusCode=${res.statusCode}`));
          }
          const body = [];
          res.on("data", (d) => body.push(d));
          res.on("end", () => {
            const parsed = JSON.parse(body.join(""));

            const { files, server, dir, metadata, reviews } = parsed;

            const responseObject = {
              metadata,
              reviews,
              files: [],
            };

            Object.keys(files).forEach((key) => {
              const { format, name } = files[key];
              if (format !== "Metadata" && format !== "JSON") {
                responseObject.files.push({
                  ...files[key],
                  name,
                  format,
                  link: `https://${server}${dir}/${name.replace(/ /g, "%20")}`,
                });
              }
            });

            resolve(responseObject);
          });
        })
        .on("error", (e) => reject(e));
    });
  }
}

const archiveSearch = new Search();

module.exports = {
  archiveSearch,
  Search,
};
