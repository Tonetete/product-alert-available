# Product Alert Availability

A simple script based on NodeJS to track down on products out of stock to check when they're available and sending over through Telegram notifications.

This program was born as a result of boresome because of the confinment on this pandemic hard times... and also for not even being able to buy a simple PS5 (yeah, first world problems)

### Description

The program makes use of [Axios](https://github.com/axios/axios) to fetch the content from a web and [Cheerio](https://github.com/cheeriojs/cheerio) to parse it and make queries against the content for a set of given **matchers**.

These matchers are configured inside the **config folder** for every site you may define inside. You can set a property matcher which is an array of selectors you want to look for inside the content for a given domain name. On the other hand we have **products_url.json** which define an array of urls products within a key value that represent the product you're tracking on to check for its availability.

Let's explain this with an example:

Imagine you want to check for toiler paper on Amazon but they're out of stock. In this case the **Checkout** button will not appear. The checkout button is defined with a css identity like `#add-to-cart-button`, you can even set more matchers to increase specificity and avoid undesire duplicities occurences. This selector is defined on **sites.json** under a property key value `matchers` inside `amazon` property. If you define a key for `toiler paper` inside **product_url.json** with an array of value (www.amazon.com/amazing_toilet_paper/dp/), whenever the script is executed will check the domain name of the url product and look for the matcher for that domain name and parse the content in look for this matcher. If the corresponding matcher for the checkout element button is not available, that means the product is still out of stock, otherwise, will send you a notification.

### Node Telegram Bot Api

This program also uses [Node Telegram Bot Api](https://github.com/yagop/node-telegram-bot-api) so you need to create a **telegram bot** and pass down your **chat id** so when you subscribe to your own bot, whenever there are occurences, it will send you over a notification to your chat. For more information about the creation of the bot you can redirect to the documentation: https://core.telegram.org/bots and to retrieve your chat id you can use the `@chatid_echo_bot` telegram bot. When you got both the token api and the chat id, you can save them under `config/telegram_bot.json`.


### Usage
- Set node version 12.x or greater
- `npm install`
- Save chat id and token api values under `config/telegram_bot.json`
- `node loader.js`

### Automatization

The main idea is to keep running this script within a certain interval of time. You can set it up making use of `crontab` to set an interval of minutes, hours or whatever the time you want to stablish. You can learn more here: https://www.tutorialspoint.com/unix_commands/crontab.htm
