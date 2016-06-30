'use strict';
Ajmd
.directive('noMore', function (
) {
    return {
        restrict: 'E',
        replace: true,
        template:'<div class="mod_no_more">没有更多了</div>',
        link: function ($scope, $element, $attrs) {}
    }
})

.directive('noData', function (
) {
    return {
        restrict: 'E',
        replace: true,
        template:'<div class="mod_no">暂无记录</div>',
        link: function ($scope, $element, $attrs) {}
    }
})

.directive('showError', function (
) {
    return {
        restrict: 'E',
        replace: true,
        template:'<section ng-if="showError" class="mod_error">'+
            '网络不畅通，请稍后再试'+
            '</section>',
        link: function ($scope, $element, $attrs) {
            $element.on('touchstart touchmove touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    };
})

.directive('showLoading', function (
) {
    return {
        restrict: 'E',
        replace: true,
        template:'<section ng-if="showLoading" class="mod_loading">'+
            '   <div class="spinner">'+
            '        <div class="spinner-container container1">'+
            '            <div class="circle1"></div>'+
            '            <div class="circle2"></div>'+
            '            <div class="circle3"></div>'+
            '            <div class="circle4"></div>'+
            '        </div>'+
            '        <div class="spinner-container container2">'+
            '            <div class="circle1"></div>'+
            '            <div class="circle2"></div>'+
            '            <div class="circle3"></div>'+
            '            <div class="circle4"></div>'+
            '        </div>'+
            '        <div class="spinner-container container3">'+
            '            <div class="circle1"></div>'+
            '            <div class="circle2"></div>'+
            '            <div class="circle3"></div>'+
            '            <div class="circle4"></div>'+
            '        </div>'+
            '    </div>'+
            '</section>',
        link: function ($scope, $element, $attrs) {
            $element.on('touchstart touchmove touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    };
})

.directive('scrollFix', function (
) {
    return {
        restrict: 'A',
        scope: {},
        link: function ($scope, $element, $attrs) {
            var startY, 
                startTopScroll,
                element = $element[0];

            $element.bind('touchstart', function(event){
                startY = event.touches[0].pageY;
                startTopScroll = element.scrollTop;

                if(startTopScroll <= 0) {
                    element.scrollTop = 1;
                }

                if(startTopScroll + element.offsetHeight >= element.scrollHeight) {
                    element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
                }
            });
        }
    };
})

.directive('overflowScroll', function (
) {
    return {
        restrict: 'A',
        scope: {
            overflowScroll: '=overflowScroll'
        },
        link: function ($scope, $element, $attrs) {
            if ($scope.overflowScroll) $element.addClass('overflow-scroll');
        }
    }
})

.directive('infiniteScroll', function (
    $window,
    $timeout,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        require: ['infiniteScroll'],
        template: '<div class="mod_more_loading">数据加载中...</div>',
        scope: true,
        controller: function ($scope, $element, $attrs) {
            var self = this;
            
            self.isLoading = false;

            $scope.$on('scroll.infiniteScrollComplete', function() {
                $element[0].classList.remove('active');
                $timeout(function () {
                    self.checkBounds();
                }, 30, false);
                self.isLoading = false;
            });

            $scope.$on('$destroy', function() {
                if (self.scrollEl) {
                    self.scrollEl.removeEventListener('scroll', self.checkBounds);
                } else {
                    angular.element($window).off('scroll', self.checkBounds);
                }
            });

            function onInfinite() {
                $element[0].classList.add('active');
                self.isLoading = true;
                $scope.$parent && $scope.$parent.$apply($attrs.onInfinite || '');
            }

            self.checkBounds = function () {
                if (self.isLoading) return;

                if (self.scrollEl) {
                    if (self.scrollEl.scrollTop >= self.scrollEl.scrollHeight - self.scrollEl.clientHeight) {
                        onInfinite();
                    }
                } else {
                    var scrollTop = 0,
                        clientHeight = 0,
                        scrollHeight = 0;

                    if (document.documentElement && document.documentElement.scrollTop) {
                        scrollTop = document.documentElement.scrollTop;
                    } else if (document.body) {
                        scrollTop = document.body.scrollTop;
                    }

                    if (document.body.clientHeight && document.documentElement.clientHeight) {
                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    } else {
                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }

                    scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

                    if ((clientHeight < $rootScope.screenHeight - 50) || (scrollTop + clientHeight + 30 >= scrollHeight)) {
                        onInfinite();
                    }
                }
            };
        },
        link: function ($scope, $element, $attrs, ctrls) {
            var infiniteScrollCtrl = ctrls[0];

            infiniteScrollCtrl.scrollEl = widget.getParentOrSelfWithClass($element[0].parentNode, 'overflow-scroll');

            if (infiniteScrollCtrl.scrollEl) {
                infiniteScrollCtrl.scrollEl.addEventListener('scroll', infiniteScrollCtrl.checkBounds);
            } else {
                angular.element($window).on('scroll', infiniteScrollCtrl.checkBounds);
            }

            // $timeout(function() {
            //     infiniteScrollCtrl.checkBounds();
            // });
        }
    };
})

/**
 * 透明的顶部
 * @example:
 * <header-opacity title="标题" share="分享的信息object"></header-opacity>
 * title: 顶部标题
 * *share: 分享参数 link|title|desc|img
 */
.directive('headerOpacity', function (
    $rootScope,
    routeRedirect,
    bridge,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            title: '=title',
            share: '=share'
        },
        template: '<header class="mod_header_opacity" ng-class="{ios: classHeight}">'+
            '    <div ng-click="toBack()" class="back"></div>'+
            '    <h1>{{title}}</h1>'+
            '    <div to-share="{{share}}" class="right"></div>'+
            '</header>',
        link: function ($scope, $element, $attrs) {
            // alert($rootScope.classHeight);
            // $scope.classHeight = true;
            if ($rootScope.isHybrid && $rootScope.isApple) {
                $scope.classHeight = true; // 顶部条是否要20PX
            }

            $scope.toBack = function () {
                routeRedirect.toBack();
            };

            // $scope.toShare = function () {
            //     if (!$scope.share) return;
            //     widget.toShare({
            //         link: $scope.share.link,
            //         title: $scope.share.title,
            //         desc: $scope.share.desc,
            //         img: $scope.share.img
            //     });
            // };
        }
    };
})

// 分享
.directive('toShare', function (
    widget
) {
    return {
        restrict: 'A',
        scope: {},
        link: function ($scope, $element, $attrs) {
            $element.on('click', function(event){
                $scope.$apply(function () {
                    if (!$attrs.toShare) return;
                    widget.toShare($scope.$eval($attrs.toShare));
                });
            });
        }
    };
});