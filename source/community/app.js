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

	/**************************直播钱包**************************/
	// 发起直播
	.state('ajmd.member-live-create', {
		url: 'member/live/create.htm?agree',
		views: {
			'': {
				templateUrl: 'member/tp/live_create.html',
				controller: 'cLiveCreate'
			}
		}
	})
	// 发起直播-用户协议
	.state('ajmd.member-live-pact', {
		url: 'member/live/pact.htm',
		views: {
			'': {
				templateUrl: 'member/tp/live_pact.html',
				controller: 'cLivePact'
			}
		}
	})
	// 发起直播-注意事项
	.state('ajmd.member-live-note', {
		url: 'member/live/note.htm',
		views: {
			'': {
				templateUrl: 'member/tp/live_note.html',
				controller: 'cLiveNote'
			}
		}
	})
	// 我的钱包-主持人
	.state('ajmd.member-wallet', {
		url: 'member/wallet/index.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet.html',
				controller: 'cWallet'
			}
		}
	})
	// 我的钱包-普通用户
	.state('ajmd.member-wallet-user', {
		url: 'member/wallet/user.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_user.html',
				controller: 'cWalletUser'
			}
		}
	})
	// 账号绑定
	.state('ajmd.member-wallet-binding', {
		url: 'member/wallet/binding.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_binding.html',
				controller: 'cWalletBinding'
			}
		}
	})
	// 我的钱包-明细
	.state('ajmd.member-wallet-list', {
		url: 'member/wallet/list.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_list.html',
				controller: 'cWalletList'
			}
		}
	})
	// 我的钱包-提现
	.state('ajmd.member-wallet-withdraw', {
		url: 'member/wallet/withdraw.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_withdraw.html',
				controller: 'cWalletWithdraw'
			}
		}
	})
	// 我的钱包-提现-明细
	.state('ajmd.member-wallet-withdraw-list', {
		url: 'member/wallet/withdraw/list.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_withdraw_list.html',
				controller: 'cWalletWithdrawList'
			}
		}
	})
	// 我的钱包-提现-明细详情
	.state('ajmd.member-wallet-withdraw-details', {
		url: 'member/wallet/withdraw/details-{id}.htm',
		views: {
			'': {
				templateUrl: 'member/tp/wallet_withdraw_details.html',
				controller: 'cWalletWithdrawDetails'
			}
		}
	})
	// 实名认证 1:未认证,2:已认证, 3:认证结果页，mobile:手机号
	.state('ajmd.member-identity', {
		url: 'member/identity.htm?type&mobile&origin',
		views: {
			'': {
				templateUrl: 'member/tp/identity.html',
				controller: 'cIdentity'
			}
		}
	})
	

	// 直播间帖子详情
	.state('ajmd.forum-live-text', {
		url: 'forum/live/text-{phid}.htm',
		views: {
			'': {
				templateUrl: 'forum/tp/live_text.html',
				controller: 'cForumLiveText'
			}
		}
	})

	.state('ajmd.help-wallet', {
		url: 'help/wallet.htm',
		views: {
			'': {
				templateUrl: 'help/tp/wallet.html',
				controller: 'cHelpWallet'
			}
		}
	})
	// 打赏服务协议
	.state('ajmd.help-reward', {
		url: 'help/reward.htm',
		views: {
			'': {
				templateUrl: 'help/tp/reward.html',
				controller: 'cHelpReward'
			}
		}
	})

	.state('ajmd.help-jump', {
		url: 'help/jump.htm',
		views: {
			'': {
				templateUrl: 'help/tp/jump.html',
				controller: 'cHelpJump'
			}
		}
	})

	// $urlRouterProvider.otherwise('/member/live/create.htm');
	if (!window.isHybridCreate) $locationProvider.html5Mode(true);
});
