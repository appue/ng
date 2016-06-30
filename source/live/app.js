'use strict';
Ajmd
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
	.state('ajmd', {
		abstract: true,
		url: '/',
        views: {
        	'body': {
        		templateUrl: 'main/tp/main.html'
        	}
        },
		resolve: {
			den: function (appready) {
				return appready.den();
			}
		}
	})
	/**************************插件模块**************************/
	// 图文直播
	.state('ajmd.expand-live', {
		url: 'expand/live.htm?pp_id',
		views: {
			'': {
				templateUrl: 'expand/tp/live.html',
				controller: 'cExpandLive'
			}
		}
	});

	// $urlRouterProvider.otherwise('/member/live/create.htm');
	if (!window.isHybridCreate) $locationProvider.html5Mode(true);
});
