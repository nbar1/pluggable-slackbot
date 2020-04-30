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
	matchRegex: /roll with (\d+)% probability/g,

	/**
	 * run
	 *
	 * @param {object} message
	 * @returns {(object|bool)}
	 */
	run: function (message) {
		if ((message.text.match(this.matchRegex) || []).length > 0) {
			var probability = parseInt(this.matchRegex.exec(message.text)[1]);
			var roll = Math.floor(Math.random() * 100) + 1;

			var color = probability <= roll ? '#991a1a' : '#10a028';
			var conclusion = probability <= roll ? 'lose' : 'win';

			return {
				message: '',
				options: {
					attachments: [
						{
							title: 'I rolled a ' + roll,
							text: 'Looks like you ' + conclusion + '!',
							color: color,
						},
					],
				},
			};
		}

		return false;
	},
};
