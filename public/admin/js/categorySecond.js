$(function () {
    var letao = new Letao();

    // 发送请求渲染页面
    letao.queryBrand();
    // 添加品牌
    letao.addBrand();
    // 退出登录
    letao.exit();
})

var Letao = function () {

}

Letao.prototype = {
    // 当前页数
    page: 1,
    // 每页大小
    pageSize: 5,
    // 总页数
    totalPages: 0,
    // 渲染一级分类数据
    queryBrand: function () {
        var that = this;
        // 发送请求
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            data: {
                page: that.page,
                pageSize: that.pageSize
            },
            success: function (data) {
                // 请求失败返回登录
                if (data.error) {
                    location.href = "login.html";
                } else {
                    var html = template('queryBrandTmp', data);
                    console.log(html);
                    // 渲染页面
                    $('.table-box tbody').html(html);
                    // 计算总页数
                    that.totalPages = Math.ceil(data.total /  that.pageSize)
                    // 初始化分页
                    that.initPage();
                }
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
                that.queryBrand();
            }
        });
    },

    // 添加品牌
    addBrand: function () {
        var that = this;
        // 添加品牌点击事件
        $('.add-category .addBrand').on('click',function () {
            // 发送请求
            $.ajax({
                url: "/category/queryTopCategoryPaging",
                data: {page: that.page, pageSize: 50},
                success: function (data) {
                    if(data.error){
                        // 请求失败返回登陆
                        location.href = 'login.html'
                    }else{
                        // 调用模板
                        var html = template('selectBrandTmp',data)
                        // 页面渲染
                        $('#selectBrand').html(html);
                    }
                }
            })
        })

        // 图片值改变事件
        $('#fileChange').on('change',function (e) {
            // 实现图片预览
            console.log(e);
            // 获取图片路径
            var fileName = e.target.files[0].name;
            console.log(fileName);
            // 拼接一个url
            var imgUrl = '/admin/images/' + fileName;
            console.log(imgUrl);
            // 更改图片路径
            $(this).siblings().attr('src',imgUrl);
        })

        // 保存添加渲染
        $('.btn-save').on('click',function () {
            // 获取输入值
            var brandName = $('#brandName').val();
            // 图片路径
            var brandLogo = $('.file-img').attr('src');
            // 分类
            var categoryId = $('#selectBrand').val();
            // 发送请求
            $.ajax({
                type: "post",
                url: "/category/addSecondCategory",
                data: {
                    brandName: brandName,
                    brandLogo: brandLogo,
                    categoryId: categoryId
                },
                success: function (data) {
                    if(data.error){
                        location.href = 'login.html';
                    }else{
                        $('#myModal').fadeOut()
                        $('.modal-backdrop').fadeOut()
                        // 重新渲染页面
                        that.queryBrand();
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