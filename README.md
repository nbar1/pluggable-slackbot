Pluggable Slackbot
=========
A library to create an easily pluggable slackbot for your Slack instance.

## Installation
`npm install pluggable-slackbot`


## Usage
```js
var pluggableSlackbot = require('./pluggable-slackbot');

var bot = new pluggableSlackbot({
	token: 'your-slack-api-token',
	name: 'SlackBot',
	iconUrl: 'url-to-bot-icon',
	pluginPath: __dirname + '/plugins',
});
```


## Creating Plugins
You can create plugins and store them in the specified `pluginPath`.

There are example plugins in the `example-plugins` folder.


## Tests
Test are coming soon!
