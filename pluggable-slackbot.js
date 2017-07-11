'use strict';

var fs = require('fs');
var slackbots = require('slackbots');

/**
 * pluggableSlackbot
 *
 * @param {object} config
 * @param {string} config.token
 * @param {string} config.name
 * @param {string} config.pluginPath
 * @param {string} [config.iconUrl]
 * @returns {function}
 */
function pluggableSlackbot(config) {
	this.config = config;

	if (!config.token) throw new Error('You must provide a Slack API key.');
	if (!config.name) throw new Error('You must provide a bot name.');
	if (!config.pluginPath) throw new Error('You must provide the path to your plugins folder.');

	/**
	 * bot
	 *
	 * @type {object}
	 */
	this.bot = new slackbots({
		token: config.token,
		name: config.name,
	});

	/**
	 * messageDefaults
	 *
	 * @type {object}
	 */
	this.messageDefaults = {
		icon_url: (config.iconUrl) ? config.iconUrl : '',
	};

	/**
	 * plugins
	 *
	 * @type {object}
	 */
	this.plugins = {};

	/**
	 * botStart
	 *
	 * @returns {null}
	 */
	this.botStart = function() {
		this.storeBotId();
		this.importPlugins();

		return;
	};

	/**
	 * storeBotId
	 *
	 * @returns {null}
	 */
	this.storeBotId = function() {
		var _this = this;

		this.botUser = this.bot.users.filter(function(user) {
			return user.name === _this.bot.name;
		})[0];

		return;
	};

	/**
	 * getUserById
	 *
	 * @param {string} userId
	 * @returns {string}
	 */
	this.getUserById = function(userId) {
		return this.bot.users.filter(function(item) {
			return item.id === userId;
		})[0];
	};

	/**
	 * handleMessage
	 *
	 * @param {object} message
	 * @returns {null}
	 */
	this.handleMessage = function(message) {
		// loop through plugins
		for (var plugin in this.plugins) {

			var pluginResponse = this.runPlugin(plugin, message);

			if (pluginResponse === false) continue;

			this.bot.postMessage(message.channel, pluginResponse.message, Object.assign({}, this.messageDefaults, pluginResponse.options));
		}

		return;
	};

	/**
	 * onMessage
	 *
	 * @param {object} message
	 * @returns {null}
	 */
	this.onMessage = function(message) {
		if (message.type === 'message' && message.user && message.user !== this.botUser.id && (message.text.substr(0, 7) === this.bot.name || (message.channel[0] === 'D' && message.text))) {
			this.handleMessage(message);
		}

		return;
	};

	/**
	 * runPlugin
	 *
	 * @param {string} pluginId
	 * @param {object} message
	 * @returns {(bool|object)}
	 */
	this.runPlugin = function(pluginId, message) {
		// Ensure plugin exists
		if (this.plugins[pluginId] === undefined) return null;

		// run plugin
		var pluginResponse = this.plugins[pluginId].run.call(this.plugins[pluginId], message);

		if (pluginResponse === false) return false;

		return pluginResponse;
	};

	/**
	 * importPlugins
	 *
	 * @returns {bool}
	 */
	this.importPlugins = function() {
		var _this = this;

		fs.readdirSync(this.config.pluginPath).forEach(function(file) {
			var pluginId = file.substr(0, file.indexOf('.'));

			_this.plugins[pluginId] = require(_this.config.pluginPath + '/' + pluginId);
		});

		return true;
	};

	// Register event handlers
	this.bot.on('start', this.botStart.bind(this));
	this.bot.on('message', this.onMessage.bind(this));

	return this;
}

module.exports = pluggableSlackbot;
