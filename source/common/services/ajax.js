'use strict';
Ajmd
.factory('ajax', function (
	$q,
	$http,
	// $state,
	// $window,
	// $compile,
	$timeout,
	$rootScope,
	widget,
	cookie
) {
	var restApi = {
		get: function (params) {
			var self = this,
				result = [];

			angular.forEach(params.ajax, function (v, k) {
				result.push(self.ajaxPromise(v, k));
			});
			
			return result;
		},
		
		ajaxPromise: function (v, k) {
			var self = this,
				q = $q.defer();
				
			$http({
				method: v.type || 'POST',
				url: $rootScope.apiSocket + v.url,
				data: v.data,
				timeout: 15000
			}).success(function (res) {
				q.resolve(res);
			}).error(function (err) {
				q.reject(err);
			});	
			
			return q.promise;
		}
	};

	return {
		/**
		 * ajax 请求封装
		 * @params:
		 * scope: scope作用域(必填)
		 * success: function () {}
		 * error: function () {} (可选)
		 * failure: function () {} (可选)
		 */
		request: function (params) {
			var self = this;

			if (!params || !params.url) return;

			var $scope = params.scope || '',
				opts = {
					//--是否分页
					isPage: false,
					//--显示loading动画
					showLoading: true,
					//--接口请求是否需要登录
					isLogin: false,
					//--成功回调
					success: function () {},
					//--ajax请求遇到错误中断回调(可选)
					// error: function () {},
					//--数据不符合要求的失败回调(可选)
					// failure: function () {},
					//--1005错误码登录回调
					// login: function (res) {}
				};

			for (var i in params) opts[i] = params[i];

			if (opts.isPage && $scope.tPage.isLoading) return;

			if (params.isPage) {
				$scope.tPage.isLoading = false;
				opts.showLoading = false;
			}

			var ajaxConfig = {
				// headers: {
				// 	'Content-Type': 'application/json;charset=UTF-8'
				// },
				withCredentials: true,
				method: params.method || 'GET',
				url: $rootScope.apiSocket + params.url,
				// params: params.params || {},
				// data: params.data || {},
				timeout: 30000
			};

			if (opts.params) ajaxConfig['params'] = opts.params;
			if (opts.data) ajaxConfig['data'] = opts.data || {};

			if (opts.showLoading) $rootScope.showLoading = true;

			$http(ajaxConfig).success(function (res) {
				$rootScope.isContentLoaded = true;
				
				if (!parseInt(res.code, 0)) {
					opts.success(res);
				}
				
				if (opts.showLoading)  $rootScope.showLoading = false;

				if (parseInt(res.code, 0)) {
					if (parseInt(res.code, 0) == 1005) { // 未登录
						if (opts.login && typeof opts.login == 'function') {
				            bridge.toBackLogin().then(function (res) {
				                opts.login(true);
				            }, function () {
		                        bridge.toLogin().then(function (res) {
		                            opts.login(true);
		                        }, function () {
		                        	bridge.toBack();
		                        });
				            });
						}
						return;
					}
					if (opts.failure && typeof opts.failure == 'function') {
						opts.failure(res);
					} else {
						widget.msgToast(res.message || '数据错误');	
					}
				}

			}).error(function (res) {
				$rootScope.isContentLoaded = true;

				if (opts.showLoading) $rootScope.showLoading = false;

				if (opts.error && typeof opts.error == 'function') {
					opts.error(res);
				} else {
					widget.msgToast('网络不稳定，请稍后再试！');
				}
			});
		},

		/**
		 * 多个ajax请求
		 * ajax: array 数组类型,每个数组是对象类型object
		 *     url: api
		 * 	   data: object提交的对象数据
		 * success: function () {}
		 * error: function () {} (可选)
		 */
		fetch: function (params) {
			if (!params.ajax || params.ajax.length === 0) return;
			
			var	self = this,
				$scope = params.scope || '',
				promises = restApi.get(params);
			
			// $ionicLoading.show({templateUrl: 'common/directives/loading.html'});
			// console.log('showloading');

			$q.all(promises).then(function (res) {
				params.success(res);
				// $ionicLoading.hide();
				// console.log('hideloading');
			}, function (err) {
				// $ionicLoading.hide();
				// console.log('hideloading');
				if (params.error && typeof params.error == 'function') {
					params.error();
				}
			});
		}
	};
});
