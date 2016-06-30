'use strict';
Ajmd
.factory('routeRedirect', function (
	$state,
	$rootScope,
	bridge
) {
	return {
		/**
		 * @params:
		 * url: app跳转地址
		 */
		toJump: function (params) {
			if ($rootScope.isHybrid) {
				bridge.toJump(params.url);
			} else {
				$state.go(params.route, params.options);
			}
		},

		/**
		 * 页面返回
		 * @params:
		 * url:
		 */
		toBack: function (params) {
			if ($rootScope.isHybrid) {
				bridge.toBack();
            } else {
				if (params && params.url) {
					window.location = params.url;
				} else {
					window.history.back();
				}
            }
		}
	};
});
