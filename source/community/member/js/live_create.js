'use strict';
Ajmd
// 创建直播间
.controller('cLiveCreate', function (
    $q,
    $scope,
    $state,
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
        //--显示类型 list:有信息，text:无信息
        show: ''
    };
    $scope.tData = {
        //--数据
        list: []
    };
    $scope.tInput = {
        check: $stateParams.agree ? true : false,
        //--节目ID
        programId: '',
        //--选择的直播节目下次直播时间
        time: '',
        //--标题
        title: '',
        //--内容
        content: '',
        //--图片附件
        attach: '',
        img: []
    };
    
    $scope.showHeader = function () {
        bridge.setHeader({
            title: '发起直播',
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
                    content: $rootScope.imgUrl +'icon_note.jpg',
                    show_type: 'icon',
                    event: function () {
                        routeRedirect.toJump({
                            url: 'member/live/note.htm'
                        });
                    }
                }
            ]
        });
    };
    
    // 登录
    widget.toLogin(function () {
        $scope.isAccept();
        $scope.loadProgram();
    });

    // 停止播放器
    bridge.stopPlayer();

    // 检查用户直播间状态
    $scope.isAccept = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            method: 'GET',
            url: 'check_live_status.php',
            success: function (res) {
                $scope.tInput.check = (res.data && parseInt(res.data.isAccept, 0)) ? true : false;
            },
            error: function (res) {}
        });
    };
    // 拉社区信息
    $scope.loadProgram = function () {
        ajax.request({
            scope: $scope,
            showLoading: false,
            method: 'GET',
            url: 'get_user_program_list.php',
            success: function (res) {
                var text = true;

                angular.forEach(res.data, function (v, k) {
                    if (v.isLive == '0' && v.isNetLive == '0') {
                        text = false;
                    }
                });

                $scope.tData.list = res.data;

                if (text) {
                    $scope.tPage.show = 'text';
                } else {
                    $scope.tPage.show = 'list';
                }

                $scope.showHeader();
                $scope.tPage.view = true;
            },
            error: function (err) {
                $scope.showHeader();
                $scope.showError = true;
            }
        });
    };
    // $scope.loadProgram();

    $scope.chooseProgram = function (e, item) {
        e.preventDefault();
        e.stopPropagation();

        if (angular.element(e.target).hasClass('disable')) {
            return;
        }

        $scope.tInput.programId = item.programId;
        $scope.tInput.time      = item.timeBeginNext;

        // if ($scope.tInput.pid == item.pid) {
        //     $scope.tInput.pid = '';
        // } else {
        //     $scope.tInput.programId = item.programId;
        //     $scope.tInput.time      = item.timeBeginNext;
        // }
    };


    // 图片
    $scope.uploadImages = function (e) {
        e.preventDefault();
        e.stopPropagation();

        bridge.uploadImages().then(function (res) {
            if (res && res.files && res.files.length>0) {
                $scope.tInput.img = $scope.tInput.img.concat(res.files);
            }
        }, function (err) {

        });
    };
    $scope.deleteImage = function (e, key) {
        e.preventDefault();
        e.stopPropagation();

        $scope.tInput.img.splice(key, 1);
    };


    // 服务许可协议
    // $('body').off().on('click', '.js_agree', function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     $scope.toAgreement();
    // });
    $scope.toPact = function (e) {
        e.preventDefault();
        e.stopPropagation();

        routeRedirect.toJump({
            url: 'member/live/pact.htm'
        });
    };
    $scope.toCheck = function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $scope.tInput.check = !$scope.tInput.check;
    };


    // 创建直播间
    $scope.toCreate = function (e) {
        e.preventDefault();
        e.stopPropagation();

        $scope.tInput.attach = '';

        if (!$scope.tInput.check) {
            widget.msgToast('请阅读《直播服务协议》同意后才能提交');
            return;
        }

        if (!$scope.tInput.programId) {
            widget.msgToast('请选择社区');
            return;
        }

        if (!$scope.tInput.title) {
            widget.msgToast('请输入直播标题');
            return;
        }

        if ($scope.tInput.img && $scope.tInput.img.length>0) {
            $scope.tInput.attach = JSON.stringify({t: "img", files: $scope.tInput.img});
        }
        
        widget.toLogin(function () {
            setdata();
        });

        function setdata() {
            ajax.request({
                scope: $scope,
                url: 'create_live_room.php',
                method: 'GET',
                params: {
                    subject: $scope.tInput.title,
                    content: $scope.tInput.content,
                    contentAttach: $scope.tInput.attach,
                    programId: $scope.tInput.programId
                },
                success: function (res) {
                    bridge.createLive(res.data);
                }
            });
        }
    };
});
