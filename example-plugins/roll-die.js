'use strict';

module.exports = {
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
	matchRegex: /roll a (\d+) sided (?:die|dice)/g,

	/**
	 * run
	 *
	 * @param {object} [message]
	 * @returns {(object|bool)}
	 */
	run: function (message) {
		var numberOfSides = this.matchRegex.exec(message.text)[1];

		return {
			message: Math.floor(Math.random() * numberOfSides) + 1,
			options: {},
		};
	},
};
