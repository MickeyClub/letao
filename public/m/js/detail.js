$(function () {
    var letao = new Letao();
    // 区域滚动
    letao.initScroll();
    //  获取当前商品id(根据地址参数)
    letao.id = letao.getQueryString('id');
    // 调用获取商品数据,传入当前商品id
    letao.getProductDetail(letao.id);
    // 加入购物车
    letao.addCart();
})

var Letao = function () {

}

Letao.prototype = {
    // 初始化轮播图方法
    initSlide: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 获取商品详情数据
    getProductDetail:function () {
        var that = this;
        // 发送请求获取数据
        $.ajax({
            url: "/product/queryProductDetail",
            data: {id: that.id},
            success: function (data) {
                console.log(data);
                // 生成模板
                var slideHtml = template('slideTmp',data)
                // 渲染页面
                $('#slide').html(slideHtml);
                // 在页面渲染后再初始化轮播图
                that.initSlide();
                // 将尺码处理成数组
                var min = data.size.split('-')[0];
                var max = data.size.split('-')[1];
                console.log(min);
                console.log(max);
                var sizeArr = [];
                for (var i = min; i <= max; i++) {
                    // 往数组中添加每一个尺码
                    sizeArr.push(parseInt(i))
                }
                // 把数据原理的40-50替换成我们的sizeArr
                data.size = sizeArr;
                // console.log(data);
                // 生成模板
                var html = template('productInfoTmp',data);
                // 渲染页面
                $('.product').html(html);
                // 初始化nui数字框
                mui('.mui-numbox').numbox();
                // 尺码点击事件
                $('.btn-size').on('tap',function () {
                    // 给当前点击的尺码添加active
                    $(this).addClass('active').siblings().removeClass('active');
                })
            }
        })
    },

    // 加入购物车
    addCart: function () {
        var that = this;
        // 1. 给购物车添加点击事件
        $('.btn-add-cart').on('tap',function () {
            // 2.  通过自定义属性获取当前选中的尺码和数量值
            var size = $('.btn-size.active').data('size');
            // 3. 判断如果没选中尺码提示用户
            if(!size){
                // 参数一: 提示内容 
                mui.toast('请选择尺码',{duration:1000,type:'div'})
                return;
            }
            // 4. 获取选择数量,使用MUI提供的方法获取数字框的值
            var num = mui('.mui-numbox').numbox().getValue()
            if(!num){
                // 没选数量码提示用户
                mui.toast('请选择数量',{duration:1000,type:'div'})
                return;
            }
            // 5. 调用添加购物车的api接口,并根据接口文档发送post请求
            $.ajax({
                type: 'post',
                url: "/cart/addCart",
                data: {
                    productId: that.id,
                    size: size,
                    num: num
                },
                success: function (data) {
                    // 6. 判断data返回值 有error表示未登录
                    if(data.error){
                        window.location.href = "login.html?returnUrl=detail.html?id=" + that.id;
                    }else{
                        // 7. 添加购物车成功,并MUI弹出确认框询问用户是否去购物车页查看
                        console.log(data);
                        // 弹出确认框问用户是否去购物车查看(mui插件)
                        // 参数一: 提示内容 参数二: 标题
                        mui.confirm( "添加购物车成功~是否要去购物车查看", "温馨提示", ['yes','no'], function (e) {
                            // console.log(e);  /返回是或否的索引
                            // 判断是否点击了yes||on
                            if(e.index == 0){
                                // yes
                                location.href = 'cart.html';
                            }else if(e.index == 1){
                                // no
                                mui.toast("请充斥余额不足,充值继续购买",{duration:1000,type:'div'})
                            }
                        })
                    }
                }
            })
        })
    },

    //专门获取地址栏参数的方法
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    // 初始化区域滚动
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006,
            
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹

            // 以上都是默认值 如果都一样可以不设置参数
        });
    }
}