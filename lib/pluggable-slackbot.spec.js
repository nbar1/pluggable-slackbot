const expect = require('chai').expect;
const fs = require('fs');
const pluggableSlackbot = require('./pluggable-slackbot');

describe('Initialization', function() {
	it('throws an error when no token is provided', function() {
		expect(() => new pluggableSlackbot({
			name: 'testbot',
			iconUrl: 'testimage',
			pluginPath: 'testdir',
		})).to.throw('You must provide a Slack API key.');
	});

	it('throws an error when no bot name is provided', function() {
		expect(() => new pluggableSlackbot({
			token: 'testkey',
			iconUrl: 'testimage',
			pluginPath: 'testdir',
		})).to.throw('You must provide a bot name.');
	});

	it('throws an error when no plugin path is provided', function() {
		expect(() => new pluggableSlackbot({
			token: 'testkey',
			name: 'testbot',
			iconUrl: 'testimage',
		})).to.throw('You must provide the path to your plugins folder.');
	});
});

describe('Plugins', function() {
	it('imports plugins', function() {
		const readdirSyncStub = this.sandbox.stub(fs, 'readdirSync').callsFake(() => ['flip-a-coin.js']);

		let bot = new pluggableSlackbot({
			token: 'testkey',
			name: 'testbot',
			iconUrl: 'testimage',
			pluginPath: __dirname + '/../example-plugins',
		});

		bot.importPlugins();

		expect(readdirSyncStub).to.be.calledWith(__dirname + '/../example-plugins');
		expect(bot.plugins['flip-a-coin']).to.not.be.undefined;
	});
});
