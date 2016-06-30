'use strict';
Ajmd
.factory('widget', function (
	$q,
	$http,
	$state,
	$window,
	$compile,
	$timeout,
	$location,
	$rootScope,
	cookie,
	bridge
) {
	var toastTimer = null;

	return {
		/**
		 * 提示信息
		 * @params:
		 * msg: 需要弹出的提示信息
		 * time: (可选)弹框多长实际关闭，毫秒 
		 */
		msgToast: function (msg, time) {
			var toastDom = angular.element(document.querySelector('.toast'));

			if (!toastDom.length) {
				var toastTpl = $compile('<div class="toast" ng-click="notification=null" ng-show="notification"><span>{{notification}}</span></div>');
				angular.element(document.getElementsByTagName('body')[0]).append(toastTpl($rootScope));
			}

			$timeout(function() {
				$rootScope.notification = msg;
			}, 0);

			$timeout.cancel(toastTimer);

			angular.element(document.querySelector('.toast')).on('touchstart touchmove touchend', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});

			toastTimer = $timeout(function() {
				$rootScope.notification = '';
			}, time || 1000);
		},
		
		/**
		 * 获取URL中的参数
		 */
		getParam: function(name) { 
			return $location.$$search[name];
		},

		// 去登录
		// toLogin: function (callback) {
		//     bridge.checkLogin().then(function (res) {
		//         if (res.code != '200') {
		//             bridge.toLogin().then(function (res) {
		//                 if (callback && typeof callback == 'function') callback();
		//             }, function () {
		//                 bridge.toBack();
		//             });
		//         } else {
		//             bridge.toBackLogin().then(function (res) {
		//                 if (callback && typeof callback == 'function') callback();
		//             }, function () {
		//                 bridge.toBack();
		//             });
		//         }
		//     }, function (err) {
		//         bridge.toBack();
		//     });
		// },

		// APP 登录
		toLogin: function (callback) {
            bridge.toBackLogin().then(function (res) {
                if (callback && typeof callback == 'function') callback();
            }, function () {
	            bridge.toLogin().then(function (res) {
	                if (callback && typeof callback == 'function') callback();
	            }, function () {
	                bridge.toBack();
	            });
            });
		},

		// 回退回来回调
		backCallback: function (callback) {
		    AjmidePlayer.setReloadCallback(function () {
		        callback();
		    });
		},

		/**
		* 分享
		* @params:
		* link: 
		* title:
		* desc:
		* img:
		*/
		toShare: function (params) {
			if ($rootScope.isHybrid) {
				bridge.toShare({
					link: params.link || '',
					title: params.title || '',
					desc: params.desc || '',
					img: params.img || ''
				});
			} else if ($rootScope.isWechat) {

			}
		},


		/**
		 * @param {DOMElement} element
		 * @param {string} className
		 * @returns {DOMElement} The closest parent or self matching the
		 * className, or null.
		 */
		getParentOrSelfWithClass: function(e, className, depth) {
			depth = depth || 10;
			while (e && depth--) {
				if (e.classList && e.classList.contains(className)) {
					return e;
				}
				e = e.parentNode;
			}
			return null;
		}

	};
});
