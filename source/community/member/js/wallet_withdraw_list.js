'use strict';
Ajmd
// 交易明细
.controller('cWalletWithdrawList', function (
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
        //--页码
        pageIndex: 0,
        //--no more
        pageEnd: false,
        //--no data
        isNo: false
    };
    $scope.tData = {
        //--交易明细列表数据
        list: []
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
    widget.toLogin();

    // 获取数据
    $scope.loadMore = function () {
        if ($scope.tPage.pageEnd) return;

        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_withdraw_list.php',
            params: {
                page: $scope.tPage.pageIndex
            },
            success: function (res) {
                if ($scope.tPage.pageIndex == 0) {
                    $scope.showHeader();
                    $scope.tPage.view = true;
                }

                if (!res.data || res.data.length==0) {
                    $scope.tPage.pageEnd = true;
                    if (!$scope.tPage.pageIndex) $scope.tPage.isNo = true;
                } else {
                    if (res.data.length < 20) $scope.tPage.pageEnd = true;
                    $scope.tData.list = $scope.tData.list.concat(res.data);
                    $scope.tPage.pageIndex++;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        });
    };
    $scope.loadMore();

    // 去详情
    $scope.toDetail = function (e, item) {
        e.preventDefault();
        e.stopPropagation();
        
        routeRedirect.toJump({
            url: 'member/wallet/withdraw/details-'+item.orderNo+'.htm'
        });
    };
});
