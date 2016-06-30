var fs = require('fs');

module.exports = function () {
	var file = './.path',
		obj = {
			web: './build/',
			app: '../native/www/'
		},
		exists = fs.existsSync(file);

	if (exists) {
		dir = fs.readFileSync(file).toString('utf8').split('|');

		obj.web = dir[0];

		if (dir.length > 1) {
			obj.app = dir[1];
		} else {
			obj.app = dir[0];
		}
	}
	
	return obj;
};
