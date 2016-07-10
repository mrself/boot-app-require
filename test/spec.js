var fake = require('./fake');

var ModuleResolver = require('../src/index');
var Namespace = ModuleResolver.Namespace;

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
	
	it ('resolve module with one parent', function() {
		var self = this;
		return fake.create(['services/db.js']).then(function() {
			self.resolver.resolveModule(Namespace.make(['services']), 'db');
			assert(self.resolver.result['services/db']);
		});
		
	});

	it('resolve module with several parents', function() {
		var self = this;
		return fake.create(['services/custom/mod1.js']).then(function() {
			self.resolver.resolveModule(Namespace.make(['services', 'custom']), 'mod1');
			assert(self.resolver.result['services/custom/mod1']);
		});
		
	});
});

describe('#resolveList', function() {
	it('resolve list of modules', function() {
		var self = this;
		return fake.create(['db.js', 'routes.js']).then(function() {
			self.resolver.resolveList(Namespace.make(), ['db', 'routes']);
			assert(self.resolver.result['db']);
			assert(self.resolver.result['routes']);
		});
	});
	it('resolve list with a namespace', function() {
		var self = this;
		return fake.create(['services/custom/mod1.js']).then(function() {
			self.resolver.resolveList(Namespace.make(['services', 'custom']), ['mod1']);
			assert(self.resolver.result['services/custom/mod1']);
		});
	});
});

describe('#resolve', function() {
	it ('resolve an object', function() {
		var self = this;
		return fake.create([
			'utils/array/concat.js',
			'utils/object/create.js',
			'core/factory.js',
			'core/bootstrap.js',
			'elements/header/logo/img.js'
		]).then(function() {
			self.resolver.resolve({
				utils: {
					array: ['concat'],
					object: ['create']
				},
				core: ['factory', 'bootstrap'],
				elements: {
					header: {
						logo: ['img']
					}
				}
			});
			assert(self.resolver.result['utils/array/concat']);
			assert(self.resolver.result['utils/object/create']);
			assert(self.resolver.result['core/factory']);
			assert(self.resolver.result['core/bootstrap']);
			assert(self.resolver.result['elements/header/logo/img']);
		});
	});
});

describe('Namespace', function() {
	describe('#clone', function() {
		it ('clone', function() {
			var ns1 = Namespace.make(['ns1']);
			var ns2 = Namespace.clone(ns1);
			ns2.add('ns2');
			assert.notInclude(ns1.names, 'ns2');
		});
	});
});


global.l = function(x) {
	console.log(x);
};