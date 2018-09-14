$(function () {
    var letao = new Letao();
    // 获取当前url传递的search 复制给乐淘对象的search属性
    // letao.search = decodeURI(window.location.search.split('=')[1]);
    letao.search = letao.getQueryString('search');
    console.log( letao.search);
    // 调用初始化下拉刷新及上拉加载
    letao.initPulldownupRefresh();
    // 调用搜索商品列表
    letao.searchProductList();
    // 搜索商品排序
    letao.productListSort();
    // 根据url刷新页面
    letao.getProductList();
    // 购买函数
    letao.productBuy();
});

var Letao = function () {

}

Letao.prototype = {
    search: '',
    page: 1,
    pageSize: 2,
    // 初始化下拉及上拉刷新
    initPulldownupRefresh: function () {
        var that = this;
        mui.init({
            pullRefresh: {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等区域滚动 的父容器可以写类名或者id选择器
                container: ".mui-scroll-wrapper",
                //初始化下拉刷新
                down: {
                    contentdown: "下拉有惊喜",
                    contentover: "惊喜以准备好",
                    contentrefresh: "surprise",
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    callback: function () {
                        that.page = 1;
                        console.log(that);
                        //注意现在官方文档结束下拉刷新的方法有问题
                        // mui('#refreshContainer').pullRefresh().endPulldown();
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束下拉刷新
                        setTimeout(function () {
                            //  发送请求商品列表数据
                            that.getProductListData(function (data) {
                                var html = template("productListTmp", data);
                                $('.product-content .mui-row').html(html);
                                //这才是真实结束下拉刷新的方法
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                // 重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                                mui('#refreshContainer').pullRefresh().refresh(true);
                            })
                        }, 1000)
                    }
                },
                up: {
                    contentrefresh: "福利正在加载",
                    contentmore: "在下实在等不及了",
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据
                    callback: function () {
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束上拉加载
                        setTimeout(function () {
                            that.page++;
                            //  发送请求商品列表数据
                            that.getProductListData(function (data) {
                                if(data.data.length > 0){
                                    // console.log(this.search);
                                    console.log(data);
                                    var html = template("productListTmp", data);
                                    console.log(html);
                                    $('.product-content .mui-row').append(html);
                                    //这才是真实结束上拉加载更多的方法
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else{
                                    //  结束上拉加载更多 并且提示没有更多数据
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            })
                        }, 1000);
                    }
                }
            }
        });
    },

    // 实现搜索商品列表
    searchProductList: function () {
        var that = this;
        // 1. 给搜索按钮添加点击事件
        $('.btn-search').on('tap', function () {
            // 2. 获取输入框内容
            that.search = $('.input-search').val();
            // 3. 判断search是否为空
            if (!that.search.trim()) {
                alert("请输入要搜索的商品");
                return;
            }
            // 搜索前重做page1
            that.page = 1;
            // 4. 发送请求商品列表数据
            $.ajax({
                url: "/product/queryProduct",
                // 一定要传参数
                data: {
                    page: that.page,
                    pageSize: that.pageSize,
                    proName: that.search
                },
                success: function (data) {
                    // console.log(this.search);
                    console.log(data);
                    var html = template("productListTmp", data);
                    // console.log(html);
                    $('.product-content .mui-row').html(html);
                    // 搜索完成重置上拉加载更多 
                    mui('#refreshContainer').pullRefresh().refresh(true);
                }
            })
        })
    },
    
    // 商品的排序
    productListSort: function () {
        var that = this;
        // 1. 给价格和数量添加点击事件
        $('.product-list .title a').on('tap',function () {
            // 2. 获取当前点击事件类型(价格或销量)
            var sortType = $(this).data('sort-type');
            // 3. 获取当前的排序顺序   1升序 2降序
            var sort = $(this).data('sort');
            // 4. 判断当前排序方式
            sort = sort == 1 ? sort = 2 : sort = 1;
            // 5. 更新当前a排序顺序
            $(this).data('sort',sort);
            // 6. 判断当前排序的方式,如果是价格,就调用价格api排序
            if(sortType == 'price'){
                // 7. 发送请求渲染页面
                that.getProductListData(function (data) {
                    // 9. 调用模板
                    var html = template("productListTmp", data);
                    // 10. 渲染页面
                    $('.product-content .mui-row').html(html);
                    //11. 重置上拉加载更多
                    mui('#refreshContainer').pullRefresh().refresh(true);
                },{price: sort})
            }else{
                 // 7. 发送请求渲染页面
                 that.getProductListData(function (data) {
                    // 9. 调用模板
                    var html = template("productListTmp", data);
                    // 10. 渲染页面
                    $('.product-content .mui-row').html(html);
                    //11. 重置上拉加载更多
                    mui('#refreshContainer').pullRefresh().refresh(true);
                },{num: sort})
            }
        })
    },
    
    // 根据url搜索内容调用api
    getProductList: function () {
        var that = this;
        // 搜索重置page1
        that.page = 1;
        // 发送请求
        that.getProductListData(function (data) {
            // 生成html
            var html = template("productListTmp", data);
            // 渲染页面
            $('.product-content .mui-row').html(html);
            // 重置上拉加载更多
            mui('#refreshContainer').pullRefresh().refresh(true);
        })
    },

    
    // 封装一部分专门用来获取数据函数
    getProductListData: function (callback,params) {
        var that = this;
        // 发送请求
        $.ajax({
            url: "/product/queryProduct",
            data: {
                page: that.page,
                pageSize: that.pageSize,
                proName: that.search,
                price: params && params.price,
                num: params && params.num
            },
            success: function (data) {
                // 由于success里的逻辑代码不一样,使用回调函数
                callback && callback(data);
            }
        })
    },


    productBuy: function () {
        // 1. 给购买添加点击事件 事件委托
        $('.product-content .mui-row').on('tap','.product-buy',function () {
            var id = $(this).data('id');
            window.location.href = "detail.html?id=" + id;
        })
    },
















    //专门获取地址栏参数的方法
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
}