$(function () {
  var letao = new Letao();
  // 初始化渲染购物车数据
  letao.queryCart();
  // 购物车
  letao.editCart();
})

var Letao = function () {

}

Letao.prototype = {
  page: 1,
  pageSize: 6,
  // 初始化购物车(上拉刷星下拉加载)
  queryCart: function () {
    var that = this;
    mui.init({
      pullRefresh: {
        container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          auto: true, //可选,默认false.首次加载自动下拉刷新一次
          callback: function () {
            $.ajax({
              url: "/cart/queryCartPaging",
              data: {
                page: that.page,
                pageSize: that.pageSize
              },
              success: function (data) {
                setTimeout(function () {
                  var html = template('cartTmp', data);
                  $('#cartList > ul').html(html);
                  mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                  mui('#refreshContainer').pullRefresh().refresh(true);
                }, 500)

              }
            })
          }
        },
        up: {
          auto: true, //可选,默认false.首次加载自动上拉加载一次
          callback: function () {
            that.page++;
            $.ajax({
              url: "/cart/queryCartPaging",
              data: {
                page: that.page,
                pageSize: that.pageSize
              },
              success: function (data) {
                setTimeout(function () {
                  // 追加html渲染
                  var html = template('cartTmp', data);
                  $('#cartList > ul').append(html);
                  mui('#refreshContainer').pullRefresh().endPullupToRefresh();  
                },500)
              }
            })
          }
        }
      }
    });
  },
  // 编辑购物车
  editCart: function () {
    // 编辑点击事件
      $('#cartList').on('tap','.btn-edit',function () {
        var li = this.parentNode.parentNode;
        // 获取模板的自定义属性值
        var product = {
          productSize: $(li).children().data('product-size'),
          size: $(li).children().data('size'),
          productNum: $(li).children().data('product-num'),
          num: $(li).children().data('num'),
          id: $(li).children().data('id'),
        }
        console.log(product.productSize);
        var min = product.productSize.split('-')[0];
        var max = product.productSize.split('-')[1];
        var sizeArr = [];
        for (var i = min; i <= max; i++) {
          sizeArr.push(parseInt(i))
        }
        // 尺码处理成数组
        product.productSize = sizeArr;

        var html = template('editCartTmp',product);
        html = html.replace(/[\r\n]/g,"");
        // 弹出框
        mui.confirm( html, "温馨提示", ["确定","取消"], function (e) {
            // 确定
            if(e.index == 0){
              // 获取编辑后的尺码和数量
                var size = $('.btn-size.active').data('size');
                var num = mui('.mui-numbox').numbox().getValue();
                console.log(size);
                console.log(num);
                // 放松请求
                $.ajax({
                  type: "post",
                  url: "/cart/updateCart",
                  data: {
                    id: product.id,
                    num: num,
                    size: size,
                  },
                  success: function (data) {
                      console.log(data);
                  }
                })
            }else if(e.index == 1){
              console.log("取消");
            }
        } )
        
        // 初始化mui数字框,能够点击选择
        mui('.mui-numbox').numbox();
        // 尺码的点击事件active
        $('.btn-size').on('tap',function () {
            $(this).addClass('active').siblings().removeClass('active')
        })

      })
  },
}