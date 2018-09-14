$(function () {
    var letao = new Letao();

    // 发送请求渲染页面
    letao.queryCategory();
    // 添加分类
    letao.addCategory();
    // 退出登录
    letao.exit();
})

var Letao = function () {
    
}

Letao.prototype = {
    // 当前页码数
    page: 1,
    // 每页大小（容量）
    pageSize: 5,
    // 总页数
    totalPages: 0,
    // 渲染一级分类数据
    queryCategory: function () {
        var that = this;
        // 发送请求
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            data: {page: that.page, pageSize: that.pageSize},
            success: function (data) {
                console.log(data);
                // 创建模板并渲染
                var html = template('categoryFirstTmp',data);
                // 渲染页面
                $('.table-box tbody').html(html);
                // 计算总页数   总页数 / 每页大小  并且向上取整
                that.totalPages = Math.ceil(data.total / that.pageSize);
                // 调用分类插件
                that.initPage();
            }
        })
    },

     // 分页插件初始化
     initPage: function () {
        var that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: that.totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                // 当前点击的页码
                that.page = page;
                // 重新渲染页面
                that.queryCategory();
            }
        });
    },

    // 添加分类
    addCategory: function () {
        var that = this;
        // 点击事件
        $('.btn-save').on('click',function () {
            // 获取当前输入分类值
            var categoryName = $('.modal-body input').val();
            // 发送请求接口实现添加分类
            $.ajax({
                type: "post",
                url: "/category/addTopCategory",
                data: {
                    categoryName: categoryName
                },
                success: function (data) {
                    if(data.success){
                        // 重新渲染页面
                        that.queryCategory();
                        // 隐藏模态框
                        $('#myModal').hide();
                        // 恢复遮罩层
                        $('.modal-backdrop').fadeOut();
                    }else{
                        // 请求失败跳回登录
                        location.href = 'login.html'
                    }
                }
            })
        })
    },

    // 退出登录
    exit: function () {
        $('.btn-exit').on('click',function (e) {
            // 阻止a标签默认事件
            e.preventDefault()
            $.ajax({
                url: "/employee/employeeLogout",
                success: function (data) {
                    // 退出成功跳转登录页
                    if(data.success){
                        location.href = 'login.html';
                    }
                }
            })
        })
    }
}