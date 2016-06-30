'use strict';
Ajmd
// 直播服务协议
.controller('cLivePact', function (
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
            title: '直播服务协议',
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
