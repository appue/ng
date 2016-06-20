angular.module('lazyload', [])
.directive('lazySrc', ['$window', '$document', '$timeout', function($window, $document, $timeout) {
    var doc = $document[0],
        body = doc.body;

    function getWindowOffset(){
        var t,
            pageXOffset = (typeof $window.pageXOffset == 'number') ? $window.pageXOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : body).ScrollLeft,
            pageYOffset = (typeof $window.pageYOffset == 'number') ? $window.pageYOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollTop == 'number' ? t : body).ScrollTop;
        return {
            offsetX: pageXOffset,
            offsetY: pageYOffset
        };
    }

    function isVisible(iElement){
        var elem         = iElement[0],
            elemRect     = elem.getBoundingClientRect(),
            windowOffset = getWindowOffset(),
            winOffsetY   = windowOffset.offsetY,
            elemHeight   = elemRect.height,
            elemOffsetY  = elemRect.top + winOffsetY,
            viewHeight   = Math.max(doc.documentElement.clientHeight, $window.innerHeight || 0),
            yVisible;

        if (elemOffsetY <= winOffsetY) {
            if (elemOffsetY + elemHeight >= winOffsetY) {
                yVisible = true;
            }
        } else if (elemOffsetY >= winOffsetY) {
            if (elemOffsetY <= winOffsetY + viewHeight) {
                yVisible = true;
            }
        }

        return yVisible;
    };

    function onLoad(){
        var $el = angular.element(this);
        $el.css('opacity', 1);
    }

    function getParentOrSelfWithClass(e, className, depth) {
        depth = depth || 10;
        while (e && depth--) {
            if (e.classList && e.classList.contains(className)) {
                return e;
            }
            e = e.parentNode;
        }
        return null;
    }

    return {
        restrict: 'A',
        scope: {
            lazySrc: '@'
        },
        link: function($scope, $element, $attr){
            $element.bind('load', onLoad);

            $element.css({
                'background-color': '#fff',
                'opacity': 0,
                '-webkit-transition': 'opacity 0.5s',
                'transition': 'opacity 0.5s'
            });

            var elem = getParentOrSelfWithClass($element[0].parentNode, 'overflow-scroll');

            var watch = $scope.$watch('lazySrc', function () {
                $timeout(function () {
                    // console.log($element[0].getBoundingClientRect());
                    if(isVisible($element)) {
                        $element.attr('src', $scope.lazySrc);
                    }
                    watch();
                }, 0);
            });

            elem.addEventListener('scroll', checkImages);

            $scope.$on('$destroy', function(){
                $element.unbind('load');
                elem.removeEventListener('scroll', checkImages);
            });

            function checkImages() {
                if(isVisible($element)) {
                    $element.attr('src', $scope.lazySrc);
                }
            }
        }
    };
}]);
