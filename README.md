# Pluggable Slackbot

A library to create an easily pluggable slackbot for your Slack instance.

## Installation

`npm install pluggable-slackbot` or `yarn add pluggable-slackbot`

## Usage

```js
var pluggableSlackbot = require('pluggable-slackbot');

var bot = new pluggableSlackbot({
	token: 'your-slack-api-token', // requires legacy API token
	name: 'MyBot',
	iconUrl: 'url-to-bot-icon',
	pluginPath: __dirname + '/plugins',
});
```

## Invoking in Slack

To invoke a reponse from your bot on Slack, you can either message the bot directly or reference it in a channel by starting your message with the bots name like `SlackBot, flip a coin`

## Creating Plugins

You can create plugins and store them in the specified `pluginPath`.

There are example plugins in the `example-plugins` folder.

#### Required plugin methods

```js
{
	/**
	 * config
	 *
	 * @type {object}
	 * @prop {bool} enabled
	 */
	config: {
		enabled: true,
	},

	/**
	 * matchRegex
	 *
	 * @type {regex}
	 */
	matchRegex: /string to match/g,

	/**
	 * run
	 *
	 * @param {object} [message]
	 * @returns {(object|bool)}
	 */
	run: function (message) {
		return {
			message: '',
			options: {},
		};

		return false;
	},
}
```

#### Optional plugin methods

```js
{
	/**
	 * initialize
	 *
	 * @returns {void}
	 */
	initialize: function () {
		/**
		 * Anything that needs to be initialized when the plugin is
		 * first loaded goes here. This will only run when the bot
		 * is (re)started.
		 */
	},
}
```
