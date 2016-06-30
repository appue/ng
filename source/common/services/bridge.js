'use strict';
Ajmd
.factory('bridge', function (
	$q,
	$rootScope
) {
	var ua = navigator.userAgent.toLowerCase();

	return {
		/**
		 * 顶部设置
		 * @params:
		 *     title: 顶部中间显示的标题文字
		 *     left: [
		 *         {
		 *             content: 左边菜单显示的内容
		 *             show_type: text|icon
		 *             event: function () { }
		 *         }
		 *     ] 左边按钮设置
		 *     right: [
		 *         {
		 *			   content: 右边菜单显示的内容
		 *             show_type: text|icon
		 *             event: function () {}
		 *         },
		 *         {
		 *			   content: 右边菜单显示的内容
		 *             show_type: text|icon
		 *			   menu: true 可以不填，填了后就要写list菜单列表
		 *             list: [
		 *                 {
		 *                     text: 显示的文本
		 *                     event: function () {}
		 *                 }
		 *             ]
		 *         }
		 *     ]
		 */
		setHeader: function (params) {
			var self = this;
			if (!$rootScope.isHybrid) return;

			window.AjmideHeader.setSetting(params);
			self.showHeader();
		},

		// 显示页面头
		showHeader: function (params)  {
			if (!$rootScope.isHybrid) return;

			window.AjmideHeader.showHeader();
		},

		// 隐藏页面头
		hideHeader: function () {
			if (!$rootScope.isHybrid) return;

			window.AjmideHeader.hideHeader();
		},

		// hybrid 包相对路径跳转
		toPage: function (url) {
			if (!$rootScope.isHybrid) return;

			cordova.exec(
				function (res) {},
				function (err) {},
				"AjmideExtends",
				"page",
				[url]
			);
		},

		/**
		 * APP内H5带动画滚动跳转
		 * @url: 页面地址,绝对路径
		 */
		toJump: function (url) {
			if (!$rootScope.isHybrid) return;

			url = $rootScope.baseUrl + url;

			cordova.exec(
				function (res) {},
				function (err) {},
				"AjmideExtends",
				"push",
				[url]
			);
		},
		toTest: function (url) {
			if (!$rootScope.isHybrid) return;
			
			cordova.exec(
				function (res) {},
				function (err) {},
				"AjmideExtends",
				"push",
				[url]
			);
		},

		/**
		 * 去社区
		 * @params:
		 * type: program|thread
		 */
		toSchema: function (params) {
			var url = 'ajmide://wireless/';

			switch (params.type) {
				// 社区
				case 'program':
					url += 'toProgram?programId='+ params.data.pid;
				break;

				// 帖子
				case 'thread':
					url += 'toThread?programId='+ params.data.pid +'&topicId='+ params.data.tid;
				break;

				// 搜索
				case 'search':
					url += 'toSearch?keyword='+ encodeURIComponent(params.data.keyword) +'&type='+ params.data.type;
				break;

				// 投票评论页面
				case 'voteComment':
					url += 'toVoteComment?programId='+ params.data.pid +'&topicId='+ params.data.tid;
				break;

				// 大事件
				case 'event':
					url += "toEvent?id="+ params.data.id;
				break;

				// 用户页面
				case 'member':
					if (params.data.type && params.data.type == 'owner') {
						url += 'toOwner?userId='+ params.data.id;
					} else {
						url += 'toMember';
					}
				break;

				// 专题
				case 'subject':
					url += 'toZhuanti?id='+ params.data.id;
				break;

				// 直播间
				case 'live':
					url += 'toLive?phid='+ params.data.phid;
				break;

				// 首页
				default:
					url += "toIndex";
			}

			window.location = url;
		},

		/**
		 * 页面返回
		 */
		toBack: function () {
			if (!$rootScope.isHybrid) return;

            cordova.exec(
                function (res) {},
                function (err) {},
                "AjmideExtends",
                "pop",
                []
            );
		},

		/**
		 * 判断用户是否登录
		 * @params:
		 * success: function () {}
		 * error: function () {} 出错
		 */
		checkLogin: function () {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function (res) {
						// if (res.code == '200') {
							q.resolve(res);
						// } else {
						// }
					},
					function (err) {
						q.reject(err);
					},
					"AjmideExtends",
					"getUserToken",
					[]
				);
			}

			return q.promise;
		},

		/**
		 * 跳转到APP登录界面
		 * @params:
		 * success: function(){} 成功回调
		 * error: function(){} 失败回调
		 */
		toLogin: function (params) {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function (res) {
						if (typeof res == 'string') {
							res = JSON.parse(res);
						}
						q.resolve(res);
					},
					function (err) {
						if (typeof err == 'string') {
							err = JSON.parse(err);
						}
						q.reject(err);
					},
					"AjmideExtends",
					"login",
					[]
				);
			}

			return q.promise;
		},

		/**
		 * token过期后后台自动登录
		 * @params:
		 * success: function(){} 成功回调
		 * error: function(){} 失败回调
		 */
		toBackLogin: function (params) {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function (res) {
						if (typeof res == 'string') {
							res = JSON.parse(res);
						}
						q.resolve(res);
					},
					function (err) {
						q.reject(err);
					},
					"AjmideExtends",
					"loginBackground",
					[]
				);
			}

			return q.promise;
		},

		// 获取APP版本号
		getVersion: function () {
			if (!$rootScope.isHybrid) return;

			var version = ua,
				reg;

			if ($rootScope.isApple) {
				reg = /ajmide_ios_.*_version/g;
			} else {
				reg = /ajmide_android_.*_version/g;
			}

			if (reg.test(version)) {
				version = version.match(reg).toString().split('_')[2];
			} else {
				version = null;
			}

			return version;
		},

		/**
		 * APP分享
		 * @params:
		 * link: 分享的链接
		 * title: 标题
		 * desc: 描述
		 * img: 图片
		 */
		toShare: function (params) {
			if (!$rootScope.isHybrid) return;

			cordova.exec(
				function(res) {},
				function(err) {},
				"AjmideExtends",
				"share",
				[params.link, params.title, params.desc, params.img]
			);
		},

		/**
		 * 录音
		 * @params:
		 * time: 限制时间/秒
		 */
		startRecord: function (params) {
			if (!$rootScope.isHybrid) return;

			var itime = params && params.time ? parseInt(params.time, 0) : 10;

			cordova.exec(
				function(res) {},
				function(err) {},
				"AjmideExtends",
				"showAudioRecord",
				[itime]
			);
		},

		// 上传图片
		uploadImages: function () {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function(res) {
						q.resolve(res);
					},
					function(err) {
						q.reject(err);
					},
					"AjmideExtends",
					"showPicUploadView",
					[]
				);
			}

			return q.promise;
		},

		/**
		 * 创建直播间
		 * @json
		 */
		createLive: function (json) {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function(res) {
						q.resolve(res);
					},
					function(err) {
						q.reject(err);
					},
					"AjmideExtends",
					"createLiveSuccess",
					[json]
				);
			}

			return q.promise;
		},

		// 绑定支付账号 2:支付宝、1:微信支付
		toBindBank: function (type) {
			var q = $q.defer();

			if ($rootScope.isHybrid) {
				cordova.exec(
					function(res) {
						q.resolve(res);
					}, 
					function(err) {
						q.reject(err);
					},
					"AjmideExtends",
					"bindAccount",
					[type]
				);
			}

			return q.promise;
		},

		// 停止播放
		stopPlayer: function () {
			var self = this;

			self.togglePlayState({
				state: false
			});
		},

		/**
		 * 播放|暂停 APP播放器
		 * @params:
		 * state: true/false
		 */
		togglePlayState: function (params) {
			var self  = this,
				q     = $q.defer(),
				state = (params && params.state) ? parmas.state : false;

			if ($rootScope.isHybrid) {
				cordova.exec(
					function (res) {
						if (typeof res == 'string') {
							res = JSON.parse(res);
						}
						q.resolve(res);
					},
					function (err) {
						if (typeof err == 'string') {
							err = JSON.parse(err);
						}
						q.reject(err);
					},
					"AjmideExtends",
					"togglePlayer",
					[state]
				);
			}

			return q.promise;
		}
	};
});