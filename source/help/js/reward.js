'use strict';
Ajmd
// 打赏服务协议
.controller('cHelpReward', function (
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
    $scope.showHeader = function() {
        bridge.setHeader({
            title: '打赏服务协议',
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

    $scope.showHeader();
    $rootScope.isContentLoaded = true;
});
