$(function () {
    var letao = new Letao();
    letao.initScroll()
    letao.getCategory()
    letao.getBrandData(1);
    letao.getBrand();

})

var Letao = function () {

}

Letao.prototype = {
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
    },
     //获取分类的数据
     getCategory: function () {
        //  1. 请求左侧的api接口
        $.ajax({
            url: "/category/queryTopCategory",
            success: function (data) {
                // console.log(data);
                // 2.  调用模板,并渲染到html页面
                var html = template('categoryTmp',data);
                $('.category-left ul').html(html);

            }
        })
     },
    //  getCategoryId: function () {
    //      var lis = $('category-left ul li').on
    //  },
    //  点击左侧分类,获取品牌的数据
    getBrand: function () {
        var that = this;
        // 1. 给左侧分类添加点击事件,由于li的动态添加,使用事件委托
        $('.category-left ul').on('tap','li a',function () {
            var id = $(this).data('id');
            console.log(id);
            // 2. 根据id获取右侧品牌的数据
            that.getBrandData(id);
        })
    },
    // 获取品牌数据
    getBrandData: function (id) {
        // 1. 发送局部请求
        $.ajax({
            url: "/category/querySecondCategory",
            data: {'id': id},
            success: function (data) {
                // 2. 调用模板 渲染页面
                var html = template("brandTmp",data);
                console.log(html);
                $('.category-right .mui-row').html(html);
                
            }
        })
    }
  
}