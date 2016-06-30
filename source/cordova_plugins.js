cordova.define('cordova/plugin_list', function(require, exports, module) {
	module.exports = [
		{
			"file": "plugins/cordova-plugin-ajmide-player/www/AjmidePlayer.js",
			"id": "cordova-plugin-ajmide-player.AjmidePlayer",
			"clobbers": [
				"window.AjmidePlayer"
			]
		},
		{
			"file": "plugins/cordova-plugin-ajmide-header/www/AjmideHeader.js",
			"id": "cordova-plugin-ajmide-header.AjmideHeader",
			"clobbers": [
				"window.AjmideHeader"
			]
		}
	];

	module.exports.metadata = {
		"cordova-plugin-whitelist": "1.0.0",
		"cordova-plugin-ajmide-player":"1.0.0",
		"cordova-plugin-ajmide-header":"1.0.0"
	};
});