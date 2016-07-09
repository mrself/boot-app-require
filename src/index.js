var Path = require('path');
var Namespace = require('./namespace');

function ModuleResolver () {
	this.result = {};
	this.root = process.cwd();
	this.directory = '';
}

ModuleResolver.prototype = {
	constructor: ModuleResolver,

	resolve: function(modules, namespace) {
		namespace = namespace || [];
		for (var moduleName in modules) {
			namespace.push(moduleName);
			var module = modules[moduleName];
			if (Array.isArray(module)) {
				this.resolveList(namespace, module);
			} else {
				this.resolve(namespace, module);
			}
		}
	},

	resolveList: function(namespace, list) {
		list.forEach(function(item) {
			this.resolveModule(namespace, item);
		}, this);
	},

	makePath: function(parentNamespace, item) {
		return Path.join(this.root, this.directory, parentNamespace.join('/'), item + '.js');
	},

	resolveModule: function(parentNamespace, name) {
		var path = this.makePath(parentNamespace, name);
		var fullNamespace = parentNamespace.slice(0);
		fullNamespace.push(name);
		this.addModule(fullNamespace, path);
	},

	addModule: function(namespace, path) {
		this.result[namespace.join('/')] = require(path);
	},

	setDirectory: function(directory) {
		this.directory = directory;
	},
};
ModuleResolver.make = function(path, config) {
	var inst = new this;
	return inst.resolve(path, config.modules);
};
module.exports = ModuleResolver;