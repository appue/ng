'use strict';
Ajmd
// 交易明细详情
.controller('cWalletWithdrawDetails', function (
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
    
    $scope.showHeader = function() {
        bridge.setHeader({
            title: '提现详情',
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


    $scope.loadData = function () {
        var oid = $stateParams.id ? parseInt($stateParams.id, 0) : '';

        if (!oid) return;

        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_withdraw_status.php',
            params: {
                orderNo: oid
            },
            success: function (res) {
                switch (parseInt(res.data.withdrawStatus, 0)) {
                    case 0:
                        res.data.title = '系统处理中';
                        res.data.class = 'cur_2';
                    break;
                    
                    case 1:
                        res.data.title = '支付成功';
                        res.data.class = 'cur_3';
                    break;

                    case 2:
                        res.data.title = '支付失败';
                        res.data.class = 'cur_3';
                    break;
                }
                
                $scope.tData = res.data;
                $scope.showHeader();
                $scope.tPage.view = true;
            }
        });
    };
    // $scope.loadData();
});
