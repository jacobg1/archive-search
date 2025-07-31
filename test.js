const { archiveSearch } = require("./src/index");
const options = {
  searchBy: "creator",
  fields: ["date", "description", "format", "mediatype", "source", "title"],
  max: 50,
  sortBy: {
    downloads: "desc",
  },
};
(async () => {
  const testing = await archiveSearch.search("Grateful+Dead+AND+year%3A1994", options);
  console.log(JSON.stringify(testing, null, 4));
  const metaTestSearch = await archiveSearch.metaSearch(
    "gd1977-12-31.151332.sbd.bear.gems.V3.flac1648"
  );
  console.log(JSON.stringify(metaTestSearch, null, 4));
})();
