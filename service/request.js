const axios = require("axios");
const cheerio = require("cheerio");

const domainName = (url) =>
  url.replace(/https?:\/\/(?:www\.)?/, "").split(".")[0];

const userAgents = {
  amazon:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
  default: "",
};

const fetchData = async (url) => {
  try {
    const domain = domainName(url);
    const result = await axios.get(url, {
      headers: {
        "User-Agent": userAgents[domain] || userAgents.default,
      },
    });
    return cheerio.load(result.data);
  } catch (e) {
    console.log("error", e);
    throw new Error(
      `${e.message} \n ${e.response && e.response.data ? e.response.data : ""}`
    );
  }
};

module.exports = {
  fetchData,
  domainName,
};
