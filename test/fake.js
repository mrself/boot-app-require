var fs = require('fs');
var Path = require('path');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');
var fse = require('fs-extra');

var options = {
	baseDir: './test/fake'
};

module.exports = {
	create: function(paths) {
		var promises = paths.map(function(path) {
			path = Path.join(options.baseDir, path);
			return new Promise(function(resolve, reject) {
				try {
					fse.ensureFile(path, function(err) {
						if (err) reject();
						else resolve();
					});
				} catch (err) {
					reject(err);
				}
			});
		});
		return Promise.all(promises);
		
	},

	clear: function(cb) {
		var path = Path.join(process.cwd(), options.baseDir);
		fse.emptyDir(path, function(err) {
			cb();
		});
	},
};