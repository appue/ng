'use strict';
Ajmd
// 提现账号绑定
.controller('cWalletBinding', function (
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
        //--是否未绑定
        binding: false,
        //--是否已经绑定
        acount: false,
        content: {},
        list: []
    };

    $scope.showHeader = function() {
        bridge.setHeader({
            title: '账号绑定',
            left: [
                {
                    content: $rootScope.imgUrl +'icon_arrow.jpg',
                    show_type: 'icon',
                    event: function () {
                        bridge.toBack();
                    }
                }
            ]
        });
    };
    
    // 登录
    widget.toLogin(function () {
        $scope.loadData();
    });

    // $scope.tData.list = [
    //     {
    //         title: '支付宝',
    //         class: 'icon_alipay'
    //     },
    //     {
    //         title: '微信支付',
    //         class: 'icon_wechat'
    //     }
    // ];
    // $scope.tData.list.push({
    //     title: '微信支付',
    //     class: 'icon_wechat',
    //     acount: 'asdf@ad.com'
    // });
    // $scope.tData.acount = true;
    // $scope.showHeader();
    // $scope.tPage.view = true;

    // 获取数据
    $scope.loadData = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_user_ewallet.php',
            success: function (res) {
                if (res.data) {
                    if (res.data.alipayAccount) {
                        $scope.tData.list.push({
                            title: '支付宝',
                            class: 'icon_alipay',
                            acount: res.data.alipayAccount
                        });
                        $scope.tData.acount = true;
                    }

                    if (res.data.wxAccount) {
                        $scope.tData.list.push({
                            title: '微信支付',
                            class: 'icon_wechat',
                            acount: res.data.wxAccount
                        });
                        $scope.tData.acount = true;
                    }

                    if (!res.data || (!res.data.wxAccount && !res.data.alipayAccount)) {
                        $scope.tData.list = [
                            {
                                id: 2,
                                title: '支付宝',
                                class: 'icon_alipay'
                            },
                            {
                                id: 1,
                                title: '微信支付',
                                class: 'icon_wechat'
                            }
                        ];
                        $scope.tData.binding = true;
                    }
                }

                $scope.tData.content = res.data;
                $scope.showHeader();
                $scope.tPage.view = true;
            },
            error: function (err) {
                $scope.showHeader();
                // $rootScope.showError = true;
            }
        });
    };

    // 绑定
    $scope.toBinding = function (e, item) {
        e.preventDefault();
        e.stopPropagation();

        var type = item.id;

        bridge.toBindBank(type).then(function (res) {

        }, function (err) {
            widget.msgToast('绑定失败!');
        });
    };
});
