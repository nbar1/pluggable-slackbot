# Pluggable Slackbot

A library to create an easily pluggable slackbot for your Slack instance.

## Installation

`npm install pluggable-slackbot` or `yarn add pluggable-slackbot`

## Usage

```js
var pluggableSlackbot = require('pluggable-slackbot');

var bot = new pluggableSlackbot({
	token: 'your-slack-api-token',
	name: 'SlackBot',
	iconUrl: 'url-to-bot-icon',
	pluginPath: __dirname + '/plugins',
});
```

To invoke a reponse from your bot on Slack, you can either message the bot directly or reference it in a channel by starting your message with the bots name like `SlackBot, flip a coin`

## Creating Plugins

You can create plugins and store them in the specified `pluginPath`.

There are example plugins in the `example-plugins` folder.

## Tests

Tests are implemented but there is not full coverage yet

`yarn test`
