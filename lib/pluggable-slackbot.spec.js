const expect = require('chai').expect;
const fs = require('fs');
const pluggableSlackbot = require('./pluggable-slackbot');

describe('Initialization', function () {
	it('throws an error when no token is provided', function () {
		expect(
			() =>
				new pluggableSlackbot({
					name: 'testbot',
					iconUrl: 'testimage',
					pluginPath: 'testdir',
				})
		).to.throw('You must provide a Slack API key.');
	});

	it('throws an error when no bot name is provided', function () {
		expect(
			() =>
				new pluggableSlackbot({
					token: 'testkey',
					iconUrl: 'testimage',
					pluginPath: 'testdir',
				})
		).to.throw('You must provide a bot name.');
	});

	it('throws an error when no plugin path is provided', function () {
		expect(
			() =>
				new pluggableSlackbot({
					token: 'testkey',
					name: 'testbot',
					iconUrl: 'testimage',
				})
		).to.throw('You must provide the path to your plugins folder.');
	});
});

describe('Properties', function () {
	it('stores the bot user id', function () {
		let bot = new pluggableSlackbot({
			token: 'testkey',
			name: 'testbot',
			iconUrl: 'testimage',
			pluginPath: __dirname + '/../example-plugins',
		});

		bot.bot.users = [{ name: 'testbot' }, { name: 'not-testbot' }];

		bot.botStart();

		expect(bot.botUser).to.have.ownProperty('name');
		expect(bot.botUser.name).to.not.eq('not-testbot');
		expect(bot.botUser.name).to.eq('testbot');
	});

	it('gets a user by id', function () {
		let bot = new pluggableSlackbot({
			token: 'testkey',
			name: 'testbot',
			iconUrl: 'testimage',
			pluginPath: __dirname + '/../example-plugins',
		});

		bot.bot.users = [
			{ id: 'abc', name: 'testbot' },
			{ id: 'xyz', name: 'not-testbot' },
		];

		expect(bot.getUserById('abc')).to.have.ownProperty('id');
		expect(bot.getUserById('abc')).to.have.ownProperty('name');
		expect(bot.getUserById('abc').name).to.not.eq('not-testbot');
		expect(bot.getUserById('abc').name).to.eq('testbot');
	});

	it('returns undefined on invalid user id', function () {
		let bot = new pluggableSlackbot({
			token: 'testkey',
			name: 'testbot',
			iconUrl: 'testimage',
			pluginPath: __dirname + '/../example-plugins',
		});

		bot.bot.users = [
			{ id: 'abc', name: 'testbot' },
			{ id: 'xyz', name: 'not-testbot' },
		];

		expect(bot.getUserById('def')).to.be.undefined;
	});
});

describe('Plugins', function () {
	it('imports plugins', function () {
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
