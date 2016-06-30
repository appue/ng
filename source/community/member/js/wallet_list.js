'use strict';
Ajmd
// 交易明细
.controller('cWalletList', function (
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
        isNo: false,
        //--tab 1:收入 2:支出
        tab: 1
    };
    $scope.tData = {
        //--交易明细列表数据
        list: []
    };
    
    $scope.showHeader = function() {
        bridge.setHeader({
            title: '交易明细',
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

    $scope.toTab = function (tab) {
        if ($scope.tPage.tab == parseInt(tab, 0)) return;

        $scope.tPage.tab       = parseInt(tab, 0);
        $scope.tPage.pageIndex = 0;
        $scope.tPage.pageEnd   = false;
        $scope.tPage.isNo      = false;
        $scope.tData.list      = [];

        $scope.loadMore();
    };

    // 获取数据
    $scope.loadMore = function () {
        if ($scope.tPage.pageEnd) return;

        if ($scope.tPage.tab == 1) {
            ajax.request({
                scope: $scope,
                showLoading: false,
                url: 'get_ewallet_list.php',
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
        } else if ($scope.tPage.tab == 2) {
            // 支出
            ajax.request({
                scope: $scope,
                showLoading: false,
                url: 'get_order_list.php',
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
        }
    };
    $scope.loadMore();

    // 去详情
    $scope.toDetail = function (e, item) {
        e.preventDefault();
        e.stopPropagation();
        
        if (item.orderType == '1') {
            routeRedirect.toJump({
                url: 'member/wallet/details-'+item.orderNo+'.htm'
            });
        }
    };
});
