$(function () {
    var letao = new Letao();

    // 调用初始化下拉刷新及上拉加载
    letao.initPulldownupRefresh();
});

var Letao = function () {

}

Letao.prototype = {
    // 初始化下拉及上拉刷新
    initPulldownupRefresh: function () {
        mui.init({
            pullRefresh: {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等区域滚动 的父容器可以写类名或者id选择器
                container: ".mui-scroll-wrapper",
                //初始化下拉刷新
                down: {
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    callback: function () {
                        //注意现在官方文档结束下拉刷新的方法有问题
                        // mui('#refreshContainer').pullRefresh().endPulldown();
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束下拉刷新
                        setTimeout(function () {
                            //这才是真实结束下拉刷新的方法
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        }, 1000)
                    }
                },
                up: {
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据
                    callback: function () {
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束上拉加载
                        setTimeout(function () {
                            //这才是真实结束上拉加载更多的方法
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        }, 1000);
                    }
                }
            }
        });
    },
}