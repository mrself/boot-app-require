var Path = require('path');
var Namespace = ModuleResolver.Namespace = require('./namespace');

function ModuleResolver () {
	this.result = {};
	this.root = process.cwd();
	this.directory = '';
}

ModuleResolver.prototype = {
	constructor: ModuleResolver,

	resolve: function(modules, namespaceList) {
		namespace = Namespace.make(namespaceList);
		for (var name in modules) {
			namespace.add(name);
			var module = modules[name];
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
		return Path.join(this.root, this.directory, parentNamespace.toString(), item + '.js');
	},

	resolveModule: function(parentNamespace, name) {
		var path = this.makePath(parentNamespace, name);
		var fullNamespace = Namespace.clone(parentNamespace);
		fullNamespace.add(name);
		this.addModule(fullNamespace, path);
	},

	/**
	 * Add a module
	 * @param {Namespace} namespace
	 * @param {string} path
	 */
	addModule: function(namespace, path) {
		this.result[namespace.toString()] = require(path);
	},

	/**
	 * Set directory
	 * @param {string} directory
	 */
	setDirectory: function(directory) {
		this.directory = directory;
	},
};
ModuleResolver.make = function(path, config) {
	var inst = new this;
	return inst.resolve(path, config.modules);
};
module.exports = ModuleResolver;