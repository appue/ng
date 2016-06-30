'use strict';
Ajmd
// 提现
.controller('cWalletWithdraw', function (
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
        view: false,
        //--提现结果页
        result: false
    };
    $scope.tInput = {
        //--提现金额
        money: '',
        //--支付账户
        pay: ''
    };
    $scope.tData = {};
    
    $scope.showHeader = function() {
        bridge.setHeader({
            title: '提现',
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
                    content: '详情',
                    show_type: 'text',
                    event: function () {
                        routeRedirect.toJump({
                            url: 'member/wallet/withdraw/list.htm'
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

    // $scope.toPick = function (e, item) {
    //     $scope.tInput.pay = item.id;
    // };

    $scope.toChange = function (value) {
        $scope.tInput.money = $filter('showdecimal')($scope.tInput.money);
    };

    $scope.toBlur = function () {
        if ($scope.tInput.money && !$filter('decimal')($scope.tInput.money)) {
            widget.msgToast('请输入最多保留2位小数点的数');
            return;
        }

        if ($scope.tInput.money > Number($scope.tData.withDrawAmount)) {
            widget.msgToast('您提现的金额已经超出可提现的金额数');
            return;
        }
    };

    // 提取全部
    $scope.toComplete = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (Number($scope.tData.withDrawAmount)) {
            $scope.tInput.money = Number($scope.tData.withDrawAmount);
        } else {
            widget.msgToast('没有可提现金额');
        }
    };

    // 取数据
    $scope.loadData = function (param) {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_user_ewallet.php',
            success: function (res) {
                $scope.showHeader();
                $scope.tPage.view = true;

                if (res.data.withDrawAmount && typeof res.data.withDrawAmount == 'string') {
                    res.data.withDrawAmount = Number(res.data.withDrawAmount.replace(/,/g, ''));
                }
                
                $scope.tData = res.data;
                // if (param) $scope.$apply();
            },
            login: function (state) {
                $scope.loadData();
            },
            error: function (err) {
                $rootScope.showError = true;
            }
        });
    };
    // $scope.loadData();
    // $scope.tPage.view = true;

    // 提现
    $scope.setPush = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$scope.tInput.money) {
            widget.msgToast('请输入您要提现的金额');
            return;
        }

        if (!$filter('decimal')($scope.tInput.money)) {
            widget.msgToast('请输入的数字格式有误，请重新输入');
            return;
        }

        if ($scope.tInput.money > Number($scope.tData.withDrawAmount)) {
            widget.msgToast('您提现的金额已经超出可提现的金额数');
            return;
        }

        if ($scope.tInput.money < 100) {
            widget.msgToast('您提现的金额不能小于100元');
            return;
        }

        ajax.request({
            scope: $scope,
            url: 'apply_withdraw_order.php',
            params: {
                applyAmount: $scope.tInput.money
            },
            success: function (res) {
                bridge.setHeader({
                    title: '提现',
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
                            content: '完成',
                            show_type: 'text',
                            event: function () {
                                bridge.toBack();
                            }
                        }
                    ]
                });
                $scope.tPage.result = true;
                $scope.tData.restime = res.data;
            },
            login: function (state) {
                $scope.loadData();
            }
        });
    };
});
