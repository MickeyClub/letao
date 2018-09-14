$(function () {
    var letao = new Letao();
    // 获取用户
    letao.queryUser();
    // 更新用户状态
    letao.updateUser();
    // 退出登录
    letao.exit();
})

var Letao = function () {

}

Letao.prototype = {
    // 当前页数
    page: 1,
    // 当前页总容量
    pageSize: 10,
    // 总页码数
    totalPages: 0,
    // 获取用户
    queryUser: function () {
        var that = this;
        // 1. 请求数据
        $.ajax({
            url: "/user/queryUser",
            data: {
                page: that.page,
                pageSize: that.pageSize
            },
            success: function (data) {
                console.log(data);
                // 2. 判断如果未登录
                if (data.error) {
                    // 3. 跳转未登录页
                    location.href = 'login.html';
                } else {
                    // 4. 调用模板
                    var html = template('userTmp', data);
                    // 5. 渲染页面
                    $('.right tbody').html(html);
                    // 拿到总页码数                    
                    that.totalPages = Math.ceil(data.total / that.pageSize);
                    // 渲染页码
                    that.initPage();
                }
            }
        })
    },

    // 更新用户状态
    updateUser: function () {
        var that = this;
        // 1. 按钮点击事件
        $('.right tbody').on('click', '.btn-option', function () {
            var isDelete = $(this).parent().data('is-delete');
            var id = $(this).parent().data('id');
            // 点击后改变当前状态
            isDelete = isDelete ? 0 : 1;
            // 发送请求
            $.ajax({
                type: "post",
                url: "/user/updateUser",
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (data) {
                    if (data.error) {
                        // 跳转登录页
                        window.location.href = 'login.html';
                    } else {
                        // 渲染页面
                        that.queryUser();
                    }
                }
            })
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
                that.queryUser();
            }
        });
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