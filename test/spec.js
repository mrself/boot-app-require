var fakeDir = './fake';
var fake = require('./fake');

var ModuleResolver = require('../src/index');

var chai = require('chai');
var assert = chai.assert;

beforeEach(function() {
	this.resolver = new ModuleResolver;
	this.resolver.setDirectory('./test/fake');
});
afterEach(function(done) {
	fake.clear(function() {
		done();
	});
});


describe('#resolveModule', function() {
	
	it ('resolve module with one parent', function(done) {
		var self = this;
		fake.create(['services/db.js']).then(function() {
			self.resolver.resolveModule(['services'], 'db');
			assert(self.resolver.result['services/db']);
			done();
		});
		
	});

	it('resolve module with several parents', function(done) {
		var self = this;
		fake.create(['services/custom/mod1.js']).then(function() {
			self.resolver.resolveModule(['services', 'custom'], 'mod1');
			assert(self.resolver.result['services/custom/mod1']);
			done();
		});
		
	});
});

describe('#resolveList', function() {
	it('resolve list of modules', function(done) {
		var self = this;
		fake.create(['db.js', 'routes.js']).then(function() {
			self.resolver.resolveList([], ['db', 'routes']);
			assert(self.resolver.result['db']);
			assert(self.resolver.result['routes']);
			done();
		});
	});
	it('resolve list with a namespace', function(done) {
		var self = this;
		fake.create(['services/custom/mod1.js']).then(function() {
			self.resolver.resolveList(['services', 'custom'], ['mod1']);
			assert(self.resolver.result['services/custom/mod1']);
			done();
		});
	});
});


global.l = function(x) {
	console.log(x);
};