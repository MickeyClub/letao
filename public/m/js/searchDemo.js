$(function () {
    var letao = new Letao();
    // 添加搜索历史记录
    letao.addHistory();
    // 查询localStorage并渲染页面
    letao.queryHistory();
    // 删除事件
    letao.removeHistory();
    // 全部删除事件
    letao.clearHistory();
})


var Letao = function () {
    
};

Letao.prototype = {
    // 添加搜索历史记录
    historyArr: JSON.parse(localStorage.getItem('historyList')) || [],
    addHistory: function () {
        var thar = this;
        // 1. 给按钮添加点击事件
        $('.btn-search').on('click',function () {
            // 2. 获取当前输入值
            var search = $('.input-search').val();
            // 3. 判断当前输入值为空,提示用户
            if(!search.trim()){
                alert('请输入商品');
                return;
            }
            // 4. 历史记录存进数组
            that.historyArr.unshift(word);
            // 5. 将数组存到localStorage中(转成json对象)
            localStorage.setItem('keyWords',JSON.stringify(that.historyArr));
            // 6. 后台渲染添加的数据
            that.queryHistory();
            // 7. 清空搜索框
            $('.input-search').val('');
        })
    },

    // 查询搜索历史记录渲染
    queryHistory: function () {
        // 2. 调用模板生成html
        
        // 3. 把生成的html放到历史记录ul中
    },

    // 删除记录
    removeHistory: function () {
        var that = this;
        // 1. 添加删除事件
        $('.search-history .content ul').on('tap','.btn-delete',function () {
            // 2. 获取当前点击的x对象要删除的id
            // 3. 获取本地localStorage数据 并转成js对象, 或者是空数据
            // 4. 遍历数组,并判断当前点击的x的id是否与本地数据的id一直,进行数组删除
            // 5. 删除完毕将数组保存至本地localStorage 并转成json对象
            // 6. 渲染页面
            that.queryHistory();
        })
    },

    // 全部删除
    clearHistory: function () {
        var that = this;
        // 1. 全部删除点击事件
        $('.btn-trash').on('tap',function (){
            // 2. 本地localStorage删除--------clearItem慎用
            // 3. 渲染页面
        })
    }
}
