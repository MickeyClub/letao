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
    addHistory: function () {
        var that = this;
        // 1. 给按钮添加点击事件
        $('.btn-search').on('click',function () {
            // 2. 获取当前输入值
            var search = $('.input-search').val();
            // 3. 判断当前输入值为空,提示用户
            if(!search.trim()){
                alert('请输入商品');
                return;
            }
            // 4. 将搜索内容存到本地存储中不仅存值,还要存数据id  默认id为1
            var id = 1;
            // 5. 定义一个对象保存搜索记录
            var searchObj = {
                id: id,
                search: search
            }
            // 6. 定义历史数据数组，如果本地存储没值，添加空数组，有就本地存储（转成json）
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 7. 判断数组的长度大于0（新增数据） 当前的id最后一个值加1  id+1
            if(historyList.length > 0){
                searchObj.id = historyList[historyList.length - 1].id + 1;
            }
            // 8. 把搜索记录添加到数组中
            historyList.push(searchObj);
            // 9. 将数组存到localStorage中(转成js对象)
            localStorage.setItem('historyList',JSON.stringify(historyList));
            // 10. 后台渲染添加的数据
            that.queryHistory();
            // 11. 跳转搜素
            window.location.href = 'productlist.html?search='+search;
        })
    },

    // 查询搜索历史记录渲染
    queryHistory: function () {
        // 1. 获取本地存储数组
        var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
        // 2. 调用模板生成html
        console.log(historyList);
        var html = template('historyTmp',{'list': historyList})
        // 3. 把生成的html放到历史记录ul中
        $('.content ul').html(html);
    },

    // 删除记录
    removeHistory: function () {
        var that = this;
        // 1. 添加删除事件
        $('.search-history .content ul').on('tap','.btn-delete',function () {
            // 2. 获取当前点击的x对象要删除的id
            var id = $(this).data('id');    //注意,data()传递的参数必须是字符串
            console.log(id);
            // 3. 获取本地localStorage数据 并转成js对象, 或者是空数据
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 4. 遍历数组,并判断当前点击的x的id是否与本地数据的id一直,进行数组删除
            for (var i = 0; i < historyList.length; i++) {
                if(historyList[i].id == id){
                    historyList.splice(i,1);
                }
            }
            // 5. 删除完毕将数组保存至本地localStorage 并转成json对象
            localStorage.setItem('historyList',JSON.stringify(historyList));
            console.log(historyList);
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
            localStorage.removeItem('historyList');
            // 3. 渲染页面
            that.queryHistory();
        })
    }
}

