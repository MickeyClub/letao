$(function () {
    var letao = new Letao();
    letao.initScroll()
      //调用获取左侧分类的数据
    //   letao.getCategory();
    //   //调用获取右侧品牌的数据
    //   letao.getBrand();
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

    //  //获取分类的数据
    //  getCategory: function() {
    //     // 1. 请求左侧分类的API接口
    //     $.ajax({
    //         url: '/category/queryTopCategory',
    //         // type:'get'
    //         //dataType:'json'
    //         success: function(data) {
    //             console.log(data);
    //             // 3. 调用左侧分类的模板
    //             var html = template('categoryTmp', data);
    //             // 4. 把生成的li放到左侧分类的ul里面
    //             $('.category-left ul').html(html);
    //         }
    //     });
    // },
    // //点击左侧分类 获取分类的品牌数据
    // getBrand: function() {
    //     //6. 默认调用一下获取右侧品牌的数据 传递id为1
    //     this.getBrandData(1);
    //     //因为onclick事件里面的this是当前触发事件的dom a 
    //     //不是letao对象 但是事件外面的是letao对象 把对象保存在that变量里面 事件里面使用that
    //     var that = this;
    //     // 1. 给左侧分类的添加点击事件 由于li是动态添加的 所以需要使用委托的方式添加         
    //     $('.category-left ul').on('click', 'li a', function() {
    //         var id = $(this).data('id');
    //         that.getBrandData(id);
    //         //7. 修改当前的左侧的active 给当前的a的父元素li添加类名其他兄弟li删除类名
    //         $(this).parent().addClass('active').siblings().removeClass('active');
    //     });
    // },
    // //获取品牌数据的函数
    // getBrandData: function(id) {
    //     // 2. 拿到当前点击的a的id 分类id  data是jquery或者zepto的方法 专门用来获取自定义属性            // 3. 根据分类的id去请求右侧品牌数据
    //     $.ajax({
    //         url: '/category/querySecondCategory',
    //         data: { 'id': id },
    //         success: function(data) {
    //             // 4. 调用模板引擎生成html
    //             var html = template('brandTmp', data);
    //             // 5. 把生成的html放到右侧分类的mui-row里面
    //             $('.category-right .mui-row').html(html);
    //         }
    //     })
    // }
}