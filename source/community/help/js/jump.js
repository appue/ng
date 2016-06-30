'use strict';
Ajmd
.controller('cHelpJump', function (
    $q,
    $scope,
    $rootScope,
    routeRedirect,
    storagePool,
    bridge,
    widget
){
    $scope.tData = {
        input: '',
        list: storagePool.pull('testUrl') || []
    };
    $scope.showHeader = function () {
        bridge.setHeader({
            title: 'H5跳转',
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

    $scope.toJump = function (e) {
        if (!$scope.tData.input) {
            widget.msgToast('不填URL你也想跳，做梦吧你！');
            return;
        }
        $scope.tData.list = [{url: $scope.tData.input}].concat($scope.tData.list);
        storagePool.push('testUrl', $scope.tData.list);
        bridge.toTest($scope.tData.input);
    };


    $scope.toUrl = function (e, item) {
        if (!item.url) return;
        bridge.toTest(item.url);
    };

    $scope.toClean = function (e) {
        storagePool.remove('testUrl');
        $scope.tData.list = [];
    };
});
