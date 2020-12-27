const sites = require("./sites.json");
const { domainName, fetchData } = require("./service/request");
const telegramBotConfig = require("./config/telegram_bot.json");
const products_url = require("./config/products_url.json");
const TelegramBot = require("node-telegram-bot-api");
const { createLog } = require("./createLog");

const initTelegramBot = () =>
  new TelegramBot(telegramBotConfig.botToken, {
    polling: false,
  });

const siteParse = ($, keyProduct, url) => {
  if (sites[domainName(url)]) {
    const matchers = sites[domainName(url)].matchers.reduce(
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
      const bot = initTelegramBot();
      bot.sendMessage(
        telegramBotConfig.chatId,
        `WE FOUND PRODUCTS AVAILABLES FOR YOUR CONFIG: \n${result}`
      );
    }
  } catch (e) {
    createLog(e.message, "error");
    const bot = initTelegramBot();
    bot.sendMessage(
      telegramBotConfig.chatId,
      `THERE WAS AN ERROR EXECUTING THE SCRIPT. PLEASE REFER TO LOGS: \
      ${e.message}`
    );
  }
};

main();
