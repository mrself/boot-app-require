/**
 * @module ModuleResolver/Namespace
 */
module.exports = Namespace;

/**
 * Represents a namespace
 * @constructor
 */
function Namespace () {
	this.names = [];
}
Namespace.prototype = {
	constructor: Namespace,

	/**
	 * Add a name
	 * @param {string} name
	 */
	add: function(name) {
		this.names.push(name);
	},

	/**
	 * Converts the namespace to string
	 * @return {string}
	 */
	toString: function() {
		return this.names.join('/');
	},

	/**
	 * Set namelist
	 * @param {array=} names
	 */
	setNames: function(names) {
		names = names || [];
		this.names = names;
	},
};

/**
 * Make an instance
 * @param  {array=} names
 * @return {Namespace}
 */
Namespace.make = function(names) {
	var inst = new this;
	inst.setNames(names);
	return inst;
};
Namespace.clone = function(namespace) {
	return this.make(namespace.names.slice(0));
};