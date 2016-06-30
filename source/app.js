'use strict';

var Ajmd = angular.module('ajmd', [
	'ui.router',
	'ng-iscroll',
	'ngTouch',
	'ngAnimate',
	'pasvaz.bindonce',
	'DelegateEvents'
]);

Ajmd
.run(function (
	$location,
	$rootScope
) {
	FastClick.attach(document.body);
	
	var ua = navigator.userAgent.toLowerCase();
	$rootScope.isHybrid  = (window.isHybridCreate || /ajmide/.test(ua)) ? true : false;
	$rootScope.isDebug   = window.isDebugCreate;
	$rootScope.isWechat  = (/micromessenger/.test(ua)) ? true : false;
	$rootScope.isApple   = (/iphone|ipad|ipod/.test(ua)) ? true : false;
	$rootScope.isAndroid = (/android/.test(ua)) ? true : false;
	$rootScope.userFace  = 'themes/img/default.jpg';
	$rootScope.imgUrl	 = 'http://m.ajmide.com/wireless/themes/img/';

	// $rootScope.showLoading 显示loading动画
	// $rootScope.showError 显示错误页面

	// 接口调用网址toDo
	if ($rootScope.isDebug) {
		$rootScope.apiSocket = 'http://a.ajmide.com/';
		$rootScope.baseUrl   = 'http://172.28.58.155/';
		// $rootScope.apiSocket = 'http://115.159.97.216/proxy_test.php?goto=http://a.ajmide.com/';
	} else {
		$rootScope.apiSocket = 'http://a.ajmide.com/';
		$rootScope.baseUrl   = 'http://m.ajmide.com/wireless/';
	}

	$rootScope.screenWidth  = document.documentElement.clientWidth;
	$rootScope.screenHeight = document.documentElement.clientHeight;
});
