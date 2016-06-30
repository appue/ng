'use strict';
Ajmd
// 用户钱包
.controller('cWalletUser', function (
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
        //--页面码
        pageIndex: 0,
        //--分页是否结束
        pageEnd: false,
        //--no data
        isNo: false
    };
    $scope.tData = {
        //--最近打赏的主播
        latest: [],
        //--交易明细
        list: []
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
            ]
        });
    };

    // 登录
    widget.toLogin(function () {
        $scope.loadData();
    });
    // 停止播放器
    bridge.stopPlayer();

    // debug
    // $scope.showHeader();
    // $scope.tPage.view = true;
    // $scope.tData.latest = [
    //     {
    //         "presenterName": "培怡",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     },
    //     {
    //         "presenterName": "雪瑾",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/11111-1AGNnr.png"
    //     },
    //     {
    //         "presenterName": "一野",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     },
    //     {
    //         "presenterName": "培怡",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     },
    //     {
    //         "presenterName": "雪瑾",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/11111-1AGNnr.png"
    //     },
    //     {
    //         "presenterName": "一野",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     },
    //     {
    //         "presenterName": "培怡",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     },
    //     {
    //         "presenterName": "雪瑾",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/11111-1AGNnr.png"
    //     },
    //     {
    //         "presenterName": "一野",
    //         "presenterimgPath": "http://img-ossimg-test.ajmide.com/avatar/10005-1AQeEl.png"
    //     }
    // ];
    // $scope.myScrollOptions = { 'wrapper': {} };

    

    // 获取数据
    $scope.loadData = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_latest_presenter.php',
            success: function (res) {
                angular.forEach(res.data, function (v, k) {
                    if (v.presenterimgPath) {
                        v.presenterimgPath = v.presenterimgPath+'@100h_100w_1e_1c';
                    } else {
                        v.presenterimgPath = $rootScope.userFace;
                    }
                });
                $scope.tData.latest = res.data;
                $scope.showHeader();
                $scope.tPage.view = true;

                $scope.myScrollOptions = { 'wrapper': {} };
            },
            error: function (err) {
                $scope.showHeader();
                $rootScope.showError = true;
            }
        });
    };
    // $scope.loadData();
    
    // 常见问题
    // $scope.toQuestion = function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
        
    //     routeRedirect.toJump({
    //         url: 'help/wallet.htm'
    //     });
    // };

    // 用户钱包拉明细
    $scope.loadMore = function () {
        if ($scope.tPage.pageEnd) return;

        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_order_list.php',
            params: {
                page: $scope.tPage.pageIndex
            },
            success: function (res) {
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
});
