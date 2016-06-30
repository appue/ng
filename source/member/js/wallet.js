'use strict';
Ajmd
// 主持人钱包
.controller('cWallet', function (
    $scope,
    $state,
    $filter,
    $timeout,
    $rootScope,
    $stateParams,
    routeRedirect,
    bridge,
    widget,
    ajax
){
    $scope.tPage = {
        //--是否显示view
        view: false
    };
    
    $scope.tData = {
        //--内容
        content: {}
    };

    $scope.showHeader = function() {
        bridge.setHeader({
            title: '我的钱包',
            left: [
                {
                    content: $rootScope.imgUrl +'icon_arrow.jpg',
                    show_type: 'icon',
                    event: function () {
                        bridge.toBack();
                    }
                }
            ],
            right: [
                {
                    content: '明细',
                    show_type: 'text',
                    event: function () {
                        routeRedirect.toJump({
                            url: 'member/wallet/list.htm'
                        });
                    }
                }
            ]
        });
    };

    // 登录
    widget.toLogin(function () {
        $scope.loadData();
    });

    // 返回该页面后回调
    // AjmidePlayer.setReloadCallback(function(){
    //     $scope.loadData();
    // });
    widget.backCallback(function () {
        $scope.loadData();
    });

    // 停止播放器
    bridge.stopPlayer();

    // 获取数据
    $scope.loadData = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_user_ewallet.php',
            success: function (res) {
                $scope.tData.content = res.data;
                if (!$scope.tData.content.totalAmount) $scope.tData.content.totalAmount = 0;
                
                $scope.showHeader();
                $scope.tPage.view = true;
            },
            error: function (err) {
                $scope.showHeader();
                $rootScope.showError = true;
            }
        });
    };
    // $scope.loadData();

    // 提现
    $scope.toBank = function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        if ($scope.tData.content.isTrueName == '1' && $scope.tData.content.isBindAccount == '1') {
            // 去提现
            routeRedirect.toJump({
                url: 'member/wallet/withdraw.htm'
            });
            return;
        }
        
        ajax.request({
            scope: $scope,
            url: 'get_user_ewallet.php',
            success: function (res) {
                $scope.tData.content = res.data;
                if ($scope.tData.content.isTrueName == '1') {
                    if ($scope.tData.content.isBindAccount == '1') {
                        // 去提现
                        routeRedirect.toJump({
                            url: 'member/wallet/withdraw.htm'
                        });
                    } else {
                        // 去绑定账号
                        routeRedirect.toJump({
                            url: 'member/wallet/binding.htm'
                        });
                    }
                } else {
                    // 实名认证
                    routeRedirect.toJump({
                        url: 'member/identity.htm'
                    });
                }
            }
        });
    };
    
    // 常见问题
    $scope.toQuestion = function (e) {
        e.preventDefault();
        e.stopPropagation();

        routeRedirect.toJump({
            url: 'help/wallet.htm'
        });
    };

    // 查看绑定账户
    $scope.toBinding = function (e) {
        e.preventDefault();
        e.stopPropagation();
    
        if ($scope.tData.content.isTrueName == '1') {
            // 查看绑定账号
            routeRedirect.toJump({
                url: 'member/wallet/binding.htm'
            });
            return;
        }
        
        ajax.request({
            scope: $scope,
            url: 'get_user_ewallet.php',
            success: function (res) {
                $scope.tData.content = res.data;
                if ($scope.tData.content.isTrueName == '1') {
                    // 绑定账号
                    routeRedirect.toJump({
                        url: 'member/wallet/binding.htm'
                    });
                } else {
                    // 实名认证
                    routeRedirect.toJump({
                        url: 'member/identity.htm'
                    });
                }
            }
        });
    };
});
