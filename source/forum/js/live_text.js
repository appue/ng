'use strict';
Ajmd
// 直播间详情
.controller('cForumLiveText', function (
    $q,
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
        phid: $stateParams.phid || ''
    };
    $scope.tData = {};

    if (!$scope.tPage.phid) {
        bridge.toBack();
        return;
    }

    // 取数据
    $scope.loadData = function () {
        ajax.request({
            scope: $scope,
            url: 'get_live_info.php',
            params: {
                phId: $scope.tPage.phid
            },
            success: function (res) {
                if (!res.data) return;

                if (res.data.content) {
                    res.data.content = $filter('repenter')(res.data.content);
                }

                if (res.data.contentAttach) {
                    var img = JSON.parse(res.data.contentAttach);
                    if (img.t == 'img' && img.files && img.files.length>0) {
                        res.data._img = img.files;
                    }
                }

                $scope.tData = res.data;
            }
        });
    };
    $scope.loadData();

    // 返回
    // $scope.toBack = function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     bridge.toBack();
    // };
});
