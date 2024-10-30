const { archiveSearch } = require("./src/index");

(async () => {
  const testing = await archiveSearch.search("Grateful+Dead+AND+year%3A1994", {
    searchBy: "creator",
    fields: ["description", "format", "mediatype", "source", "title"],
    max: 500,
    sortBy: { date: "desc", downloads: "desc" },
  });
  console.log("testing", testing);
})();
