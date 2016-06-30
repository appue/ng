'use strict';
Ajmd
// 实名认证
.controller('cIdentity', function (
    $scope,
    $state,
    $filter,
    $timeout,
    $rootScope,
    $stateParams,
    routeRedirect,
    checkData,
    bridge,
    widget,
    ajax
){
    $scope.tPage = {
        //--页面是否显示
        view: false,
        //--显示页面类型 1:没有认证 2:认证过
        // type: $stateParams.type ? parseInt($stateParams.type, 0) : 1,
        //--认证提交,通过
        result: false,
        //--来路 1
        // origin: $stateParams.origin ? true : false
        origin: true
    };
    $scope.tInput = {
        //--身份证照片
        img: '',
        //--姓名
        name: '',
        //--手机号
        mobile: $stateParams.mobile || '',
        //--身份证号
        card: ''
    };
    $scope.err = {card: false};
    $scope.tData = {};

    $scope.showHeader = function() {
        bridge.setHeader({
            title: '实名认证',
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
       $scope.getAuthInfo();
    });
    // 停止播放器
    bridge.stopPlayer();

    // 获取用户信息
    $scope.getAuthInfo = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            url: 'get_user_authinfo.php',
            success: function (res) {
                if (res.data && res.data.mobile && res.data.trueName && res.data.cardNo) {
                    $scope.tData = res.data;
                    $scope.tPage.type = 2;
                } else {
                    $scope.tPage.type = 1;
                }

                $scope.showHeader();
                $scope.tPage.view = true;
            }
        });
    };

    // $scope.showHeader();
    // $scope.tPage.view = true;
    // $scope.tPage.type = 1;


    // 检查身份证号
    $scope.chkCard = function () {
        $scope.err.card = !checkData.card($scope.tInput.card);
    };
    $scope.setCard = function () {
        if ($scope.tInput.card.length >= 18) {
            $scope.tInput.card = $scope.tInput.card.substring(0,18);
        }
    };
    // 检查用户名
    $scope.chkName = function () {
        $scope.tInput.name = $filter('showtext')($scope.tInput.name);
    };
    // 检查联系方式
    $scope.chkMobile = function () {
        $scope.tInput.mobile = $filter('inputMobile')($scope.tInput.mobile);
    };

    // 图片上传调用
    $scope.uploadImages = function (e) {
        e.preventDefault();
        e.stopPropagation();

        bridge.uploadImages().then(function (res) {
            if (res && res.files && res.files.length>0) {
                $scope.tInput.img = res.files[0].url;
            }
        }, function (err) {
            widget.msgToast('上传失败，请重新上传!');
        });
    };

    // 提交数据
    $scope.setPush = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$scope.tInput.name) {
            widget.msgToast('请输入用户名');
            $scope.err.name = true;
            return;
        }

        if ($scope.tInput.name.length > 100 || $scope.tInput.name.length == 1) {
            widget.msgToast('输入正确的用户名');
            $scope.err.name = true;
            return;
        }

        if (!$scope.tInput.mobile) {
            widget.msgToast('请输入联系方式');
            $scope.err.mobile = true;
            return;
        }
        
        if (!$scope.tInput.card) {
            widget.msgToast('请输入身份证号');
            $scope.err.card = true;
            return;
        }

        $scope.chkCard();
        if ($scope.err.card) return;

        if (!$scope.tInput.img) {
            widget.msgToast('请上传身份证照片');
            return;
        }

        ajax.request({
            scope: $scope,
            url: 'update_user_authinfo.php',
            params: {
                trueName: $scope.tInput.name,
                cardNo: $scope.tInput.card,
                cardImgPath: $scope.tInput.img,
                telePhone: $scope.tInput.mobile
            },
            success: function (res) {
                $scope.tPage.type = '';
                $scope.tPage.result = true;
                // $scope.$apply();
                bridge.setHeader({
                    title: '提交成功',
                    left: [
                        {
                            content: $rootScope.imgUrl +'icon_arrow.jpg',
                            show_type: 'icon',
                            event: function () {
                                bridge.toBack();
                            }
                        }
                    ],
                    right: [
                        {
                            content: '完成',
                            show_type: 'text',
                            event: function () {
                                bridge.toBack();
                            }
                        }
                    ]
                });
            }
        });
    };
});
