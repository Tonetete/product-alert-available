const axios = require("axios");
const cheerio = require("cheerio");
const sites = require("./config/sites.json");
const telegramBotConfig = require("./config/telegram_bot.json");
const products_url = require("./config/products_url.json");
const TelegramBot = require("node-telegram-bot-api");

const fetchData = async (url) => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

const siteParse = ($, keyProduct, url) => {
  const domainName = url.replace(/https?:\/\/(?:www\.)?/, "").split(".")[0];
  if (sites[domainName]) {
    const matchers = sites[domainName].matchers.reduce(
      (prev, curr, index) => (prev !== "" ? `${prev}, ${curr}` : `${curr}`),
      ""
    );

    return $(matchers).length > 0
      ? `The ${keyProduct} is available to buy it in the following link ${url}`
      : null;
  }
  return null;
};

const main = async () => {
  try {
    const productsPromises = {};
    Object.keys(products_url).forEach(async (key) => {
      productsPromises[key] = Promise.all(
        products_url[key].map(async (urlProduct) => {
          const $ = await fetchData(urlProduct);
          return siteParse($, key, urlProduct);
        })
      );
    });

    let result = await Promise.all(
      Object.keys(productsPromises).map(async (key) => {
        let productResults = await productsPromises[key];
        productResults = productResults.filter(
          (productResult) => productResult
        );
        return productResults.length > 0
          ? productResults.reduce(
              (prev, curr) =>
                `${prev} \ 
                 ${curr}`,
              ""
            )
          : "";
      })
    );

    result = result.join("");
    if (result) {
      const bot = new TelegramBot(telegramBotConfig.botToken, {
        polling: false,
      });
      bot.sendMessage(
        telegramBotConfig.chatId,
        `WE FOUND PRODUCTS AVAILABLES FOR YOUR CONFIG: \n${result}`
      );
    }
  } catch (e) {
    console.error(e);
  }
};

main();
