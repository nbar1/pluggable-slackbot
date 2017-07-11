'use strict';

module.exports = {
	/**
	 * enabled
	 *
	 * @type {bool}
	 */
	enabled: true,

	/**
	 * matchRegex
	 *
	 * @type {regex}
	 */
	matchRegex: /flip a coin/g,

	/**
	 * run
	 *
	 * @param {object} message
	 * @returns {(object|bool)}
	 */
	run: function(message) {
		if ((message.text.match(this.matchRegex) || []).length > 0) {
			return {
				message: (Math.floor(Math.random() * 2) === 0) ? 'Heads!' : 'Tails!',
				options: {},
			};
		}

		return false;
	},
};