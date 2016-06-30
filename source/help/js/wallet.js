'use strict';
Ajmd
.controller('cHelpWallet', function (
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
    $scope.showHeader = function () {
        bridge.setHeader({
            title: '常见问题',
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
    $rootScope.isContentLoaded = true;

    $scope.showContent = function (e, item) {
        item.select = !item.select;
    };

    // 取数据
    $scope.loadData = function () {
        $scope.showHeader();
        
        $scope.tData = {
            list: [
                {
                    title: "关于可提现金额",
                    content: "答：可提现金额为今日前推两个自然日的未提现金额（尚未扣除30%服务手续费）。",
                    select: false
                },
                {
                    title: "关于收支明细",
                    content: "答：收支明细中金额为用户实时打赏金额（尚未扣除30%服务手续费）。",
                    select: false
                },
                {
                    title: "关于提现详情",
                    content: "答：提现详情中的金额，为扣除30%服务手续费后的金额。",
                    select: false
                },
                {
                    title: "提现是否有次数限制？",
                    content: "答：每个自然周至多只能提现一次。",
                    select: false
                },
                {
                    title: "提现后几个工作日能到账？",
                    content: "答：提现申请通过后会在七个工作日内到账到您绑定的微信或者支付宝帐号。",
                    select: false
                }
            ]
        };
    };
    $scope.loadData();
});
