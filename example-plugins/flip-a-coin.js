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
	matchRegex: /flip a coin/g,

	/**
	 * run
	 *
	 * @param {object} [message]
	 * @returns {(object|bool)}
	 */
	run: function () {
		return {
			message: Math.floor(Math.random() * 2) === 0 ? 'Heads!' : 'Tails!',
			options: {},
		};
	},
};
