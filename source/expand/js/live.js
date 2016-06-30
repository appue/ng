'use strict';
Ajmd
// 图文直播
.controller('cExpandLive', function (
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
        isMore: true,
        isFirst: true,

        //--no more
        pageEnd: false,
        //--no data
        isNo: false,
        pageSize: 5,

        prevId: 0,
        // lastId: 6908331
        lastId: 0
    };
    $scope.tData = {
        list: []
    };

    $scope.share = {
        link: 'link',
        title: 'title',
        desc: 'desc',
        img: ''
    };

    $scope.loadMore = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'v1/get_reply_list.php',
            params: {
                c: $scope.tPage.pageSize,
                o: 'desc',
                showType: 'html',
                s: $scope.tPage.lastId,
                t: 4779739
            },
            success: function (res) {
                var len = res.data.length;

                if (!len) {
                    $scope.tPage.pageEnd = true;
                    $timeout(function () {
                        $scope.getPrev();
                    }, 1000);
                    return;
                }

                angular.forEach(res.data, function (v, k) {
                    v.user.rankTheme = $filter('isGold')(v.user.rankimgPath);

                    v._attach = $filter('imglist')(v.replyAttach || '');
                });

                $scope.tPage.lastId = res.data[len-1].replyId;

                if ($scope.tPage.isFirst) {
                    $scope.tPage.prevId = (res.data && res.data.length>0) ? res.data[0].replyId : 0;

                    $timeout(function () {
                        $scope.getPrev();
                    }, 1000);

                    $scope.tPage.isFirst = false;
                }

                $scope.tData.list = $scope.tData.list.concat(res.data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        });
    };
    $scope.loadMore();

    $scope.getPrev = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'v1/get_reply_list.php',
            params: {
                c: $scope.tPage.pageSize,
                o: 'asc',
                showType: 'html',
                s: $scope.tPage.prevId,
                t: 4779739
            },
            success: function (res) {
                if (res.data.length > 0) {
                    angular.forEach(res.data, function (v, k) {
                        v.user.rankTheme = $filter('isGold')(v.user.rankimgPath);

                        v._attach = $filter('imglist')(v.replyAttach || '');
                    });

                    var arr = res.data.reverse();

                    $scope.tPage.prevId = res.data[0].replyId;
                    $scope.tData.list = arr.concat($scope.tData.list);
                }

                $timeout(function () {
                    $scope.getPrev();
                }, 2000);
            }
        });
    };
});
