$(function () {
    var letao = new Letao();
    // 调用查询购物车方法
    letao.queryCart();
    // 调用编辑购物车
    letao.editCart();
    // 删除购物车
    letao.deleteCart();
    // 计算订单总额
    letao.getCount();
})

var Letao = function () {

}

Letao.prototype = {
    // 定义全局page当前页码数
    page: 1,
    // 定义全局每页容量
    pageSize: 6,
    // 查询购物车方法
    queryCart: function () {
        var that = this;
        // 1. 初始化实现下拉刷新下拉加载的组件
        mui.init({
            pullRefresh: {
                container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    // 默认第一次初始化下拉刷新渲染页面
                    auto: true,
                    // 下拉刷新 回调函数  发ajax请求  刷新页面
                    callback: function () {
                        // 重置当前页
                        that.page = 1;
                        // 2. 下拉刷新请求数据
                        $.ajax({
                            url: "/cart/queryCartPaging",
                            data: {
                                page: that.page,
                                pageSize: that.pageSize
                            },
                            success: function (data) {
                                // 3. 请求成功渲染当前购物车列表
                                console.log(data);
                                setTimeout(function () {
                                    // 4. 请求成功并用模板渲染页面
                                    var html = template('cartTmp', data);
                                    $('#cartList > .mui-table-view').html(html);
                                    // 5. 结束下拉刷新
                                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                    // 6. 要重置上拉加载的效果, 要放到请求完毕后重置
                                    mui('#refreshContainer').pullRefresh().refresh(true);
                                    // 7. 初始化总金额
                                    $('#count .mui-pull-left span').html('0.00');
                                }, 500)
                            }
                        })
                    }
                },
                up: {
                    // 1. 上拉加载更多 回调函数  发ajax请求  刷新页面
                    callback: function () {
                        // 2. 上拉加载请求下一些数据
                        setTimeout(function () {
                            // 3. 请求下一页数据
                            that.page++;
                            $.ajax({
                                url: "/cart/queryCartPaging",
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize
                                },
                                success: function (data) {
                                    // 7. 数据返回有点问题 返回是一个[]空数组 而不是一个对象里面的data值为空  判断当前数据是否还有值 判断data.data.length 是否大于0
                                    // if (data.data && data.data.length > 0) {
                                    if (data instanceof Array == false && data.data.length > 0) {
                                        console.log(data);
                                        // 4. 模板渲染页面
                                        var html = template('cartTmp', data);
                                        // 5. 追加渲染页面 append
                                        $("#cartList > .mui-table-view").append(html);
                                        // 6. 渲染结束上拉加载更多
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                    }else{
                                        // 8. 数据为空时提示用户没有更多数据
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }
                                    // $('#count .mui-pull-left span').html('0.00');
                                }
                            })
                        }, 500)
                    }
                }
            }
        });
    },
    // 购物车编辑
    editCart: function () {
        var that = this;
        // 1. 给编辑按钮添加点击
        $('#cartList').on('tap','.btn-edit',function () {
            // 2. 获取按钮的li元素
            var li = this.parentNode.parentNode;
            // 3. 准备一个编辑的尺码和数量的模板(html)
            // 4. 准备模板需要数据 通过之定义属性获取  
            // 所有商品尺码 
            // 当前选择的尺码 
            // 所有商品数量 
            // 当前选择数量 
            // 当前编辑商品id
            var product = {
                productSize: $(this).parent().data('product-size'),
                size: $(this).parent().data('size'),
                productNum: $(this).parent().data('product-num'),
                num: $(li).parent().data('num'),
                id: $(this).parent().data('id'),
            };
            // 5. 将尺码处理成数组 例如30-40 处理成[30,31,...40]
            var min = product.productSize.split('-')[0];
            var max = product.productSize.split('-')[1];
            var sizeArr = [];
            for (var i = min; i <= max; i++) {
                // 往数组中添加每一个尺码
                sizeArr.push(parseInt(i))
            }
            // console.log(sizeArr);
            // 把数据原理的40-50替换成我们的sizeArr
            product.productSize = sizeArr;
            // 6. 调用编辑模板,传入对应的数据
            var html = template('editCartTmp', product);
            // 7. 因为模板会将换行变成br,所以通过正则把生成的html字符串去掉回车和换行
            html = html.replace(/[\r\n]/g, "");

            // 2. 弹出框
            mui.confirm(html,"编辑商品",["确定","取消"],function (e) {
                // console.log(e);
                // 10. 如果点击确定编辑
                if(e.index == 0){
                    // 11. 获取值编辑后的尺码和数量
                    var size = $('.btn-size.active').data('size');
                    var num = mui('.mui-numbox').numbox().getValue();
                    // 12. 请求api并更改数据库的尺码和数量
                    $.ajax({
                        type: "post",
                        url: "/cart/updateCart",
                        // 根据id修改商品尺码和数量
                        data: {id: product.id, size: size, num: num},
                        success: function (data) {
                            // 13. 判断success返回值,成功=>收回mui的滑动列表 并修改编辑后的尺码和数量
                            if(data.success){
                                // 编辑成功,收回mui滑动列表
                                mui.swipeoutClose(li)
                                // 修改编辑后的尺码和数量
                                $(li).find('.pruduct-size span').html(size);
                                $(li).find('.pruduct-num span').html(num);
                                // 并且更改模板上的自定义属性
                                $(li).find('.mui-slider').data('size');
                                $(li).find('.mui-slider').data('num');
                            }else{
                                // 14. 编辑失败表示未登录
                                window.location.href = "login.html?returnRrl=cart.html"
                            }
                        }
                    })
                }
            })

            // 8. 初始化nui数字框,让数字框能够选择
            mui('.mui-numbox').numbox();
            // 9. 尺码点击事件
            $('.btn-size').on('tap',function () {
                // 9.1 给当前点击的尺码添加active
                $(this).addClass('active').siblings().removeClass('active');
            })
        })
    },

    // 购物车删除
    deleteCart: function () {
        // 1. 添加删除事件
        $('#cartList').on('tap','.btn-delete',function () {
            // 获取当前点击的删除按钮父元素li
            var li = this.parentNode.parentNode;
            var id = $(this).parent().data('id')
            console.log(id);
            // 2. 弹出确认框
            mui.confirm("您确定要删除吗?","温馨提示!",["确定","取消"],function (e) {
                // 3. 判断当前点击了确定还是取消
                if(e.index == 0){
                    // 4. 发送请求,并更改数据
                    $.ajax({
                        url: "/cart/deleteCart",
                        data: {id: id},
                        success: function (data) {
                            // 5. 判断返回数据是否成功
                            if(data.success){
                                // 6. 提示删除成功
                                mui.toast('删除成功');
                                // 7. 在当前父元素删除当前li
                                li.parentNode.removeChild(li)
                            }else{
                                // 8. 删除失败跳转登录
                                window.location.href = 'login.html?returnUrl=cart.html';
                            }
                        }
                    })
                }else{
                    // 9. 点击取消关闭滑动列表
                    mui.swipeoutClose(li)
                }
            })
        })
    },

    // 计算总金额
    getCount: function () {
        // 1. 给所有复选框添加改变事件(change)
        $('#cartList').on('change','input[type=checkbox]',function () {
            // 2. 获取所有选中的复选框
            // var checkboxs = $(':chexked');
            var checkboxs = $('input[type="checkbox"]:checked');
            var sum = 0;
            // console.log(checkboxs);
            // 3. 遍历所有选中复选框
            checkboxs.each(function (index, value) {
                // 4. 获取每个复选框的价格及数量
                var price = $(value).data('price');
                var num = $(value).data('num');
                // 5. 将复选框价的价格和数量相乘并累加
                sum += price * num;
                console.log(sum);
            })
            // 6. 保留总金额2位小数
            sum = sum.toFixed(2);
            // 7. 渲染页面的总金额
            $('#count .mui-pull-left span').html(sum);
        })
    }
}
