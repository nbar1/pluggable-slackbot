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
		icon_url: config.iconUrl ? config.iconUrl : '',
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
	this.botStart = () => {
		this.storeBotId();
		this.importPlugins();

		return;
	};

	/**
	 * storeBotId
	 *
	 * @returns {null}
	 */
	this.storeBotId = () => {
		this.botUser = this.bot.users.filter((user) => {
			return user.name === this.bot.name;
		})[0];

		return;
	};

	/**
	 * getUserById
	 *
	 * @param {string} userId
	 * @returns {string}
	 */
	this.getUserById = (userId) => {
		return this.bot.users.filter((item) => {
			return item.id === userId;
		})[0];
	};

	/**
	 * handleMessage
	 *
	 * @param {object} message
	 * @returns {null}
	 */
	this.handleMessage = (message) => {
		// loop through plugins
		for (var plugin in this.plugins) {
			var pluginResponse = this.runPlugin(plugin, message);

			if (pluginResponse === false) continue;

			this.sendMessage(message.channel, pluginResponse.message, pluginResponse.options);
		}

		return;
	};

	/**
	 * onMessage
	 *
	 * @param {object} message
	 * @returns {null}
	 */
	this.onMessage = (message) => {
		if (
			message.type === 'message' &&
			message.user &&
			message.user !== this.botUser.id &&
			(message.text.substr(0, this.bot.name.length) === this.bot.name ||
				(message.channel[0] === 'D' && message.text))
		) {
			this.handleMessage(message);
		}

		return;
	};

	/**
	 * sendMessage
	 *
	 * @param {string} channel
	 * @param {string} message
	 * @param {object} options
	 * @returns {null}
	 */
	this.sendMessage = (channel, message, options) => {
		this.bot.postMessage(channel, message, Object.assign({}, this.messageDefaults, options));

		return;
	};

	/**
	 * runPlugin
	 *
	 * @param {string} pluginId
	 * @param {object} message
	 * @returns {(bool|object)}
	 */
	this.runPlugin = (pluginId, message) => {
		// Ensure plugin exists
		if (this.plugins[pluginId] === undefined) return false;

		// Check if plugin is disabled
		if (this.plugins[pluginId].config.enabled === false) return false;

		// Run plugin
		var pluginResponse = this.plugins[pluginId].run.call(this.plugins[pluginId], message, this);

		if (pluginResponse === false) return false;

		return pluginResponse;
	};

	/**
	 * importPlugins
	 *
	 * @returns {bool}
	 */
	this.importPlugins = () => {
		fs.readdirSync(this.config.pluginPath).forEach((file) => {
			var pluginId = file.substr(0, file.indexOf('.'));

			this.plugins[pluginId] = require(this.config.pluginPath + '/' + pluginId);

			if (this.plugins[pluginId].config.enabled === true && this.plugins[pluginId]['initialize'] !== undefined) {
				this.plugins[pluginId]['initialize'].call(_this.plugins[pluginId]);
			}
		});

		return true;
	};

	// Register event handlers
	this.bot.on('start', this.botStart.bind(this));
	this.bot.on('message', this.onMessage.bind(this));

	return this;
}

module.exports = pluggableSlackbot;
