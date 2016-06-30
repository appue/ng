'use strict';
Ajmd
.factory('appready', function (
	$q,
	$rootScope
) {
	return {
		den: function () {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				var dependencies = [];

				if ($rootScope.isApple) {
					dependencies = [
						'cordova.js',
						'cordova_plugins.js',
						'plugins/cordova-plugin-ajmide-player/www/AjmidePlayer.js',
						'plugins/cordova-plugin-ajmide-header/www/AjmideHeader.js'
					];
				} else {
					dependencies = [
						'cordova_android.js',
						'cordova_plugins.js',
						'plugins/cordova-plugin-ajmide-player/www/AjmidePlayer.js',
						'plugins/cordova-plugin-ajmide-header/www/AjmideHeader.js'
					];
				}

				$script(dependencies, function () {
					document.addEventListener('deviceready', function () {
						q.resolve();
					}, false);
				});
			} else {
				q.resolve();
			}

			return q.promise;
		}
	};
});