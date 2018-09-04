$(function () {
    var letao = new Letao();
    // 添加事件
    letao.addHistory();
    // 查询并渲染
    letao.queryHistory();
    // 删除
    letao.removeHistory();
    letao.clearHistory();
});

var Letao = function () {
    
}

Letao.prototype = {
    // 添加搜索历史几率
    addHistory: function () {
        // 将this的letao对象保存在that
        var that = this;
        // 1. 添加按钮点击事件
        $('.btn-search').on('tap',function () {
            // 2. 获取当前输入的值
            var search = $('.input-search').val();
            $('.input-search').val('');
            // 3. 判断如果当前输入值为空,提示用户
            if(!search.trim()){
                alert("请输入商品");
                return
            }
            // 4. 把搜索内容存到本地存储中,不仅存值,还要这条数据id
            // 定义一个id默认为1 如果本地存储有值 id+1 最后一条数据+1
            var id = 1;
            // 5. 定义一个对象保存搜索记录
            var searchObj = {
                id: id,
                search: search
            }
            // 6. 定义历史记录的数组,如果本地存储中没有值,第一次添加空数组,如果有就本地存储
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 7. 判断如果数组的长度大于0  当前记录的id最后一个值id+1
            if(historyList.length > 0){
                searchObj.id = historyList[historyList.length - 1].id+1;
            }
            // 8. 把当前搜索记录添加到历史记录的数组中
            historyList.push(searchObj);
            // 9. 将数组存到本地localStorage
            localStorage.setItem('historyList',JSON.stringify(historyList));
            // 10. 添加后渲染新添加的数据
            that.queryHistory();
        })
    },
    // 查询搜索历史记录
    queryHistory: function () {
        // 1. 获取本地存储的数组
        var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
        // console.log(historyList);
        // 2. 调用模板生成html
        var html = template('historyTmp',{'list': historyList})

        // 3. 把生成的html 放到历史记录ul中
        $('.search-history .content ul').html(html);
    },
    // 删除记录
    removeHistory: function () {
        var that = this;
        // 1. 添加删除事件
        $('.search-history .content ul').on('tap','.btn-delete',function () {
            // console.log('1');
            // 2. 获取当前点击的x对应要删除的id
            var id = $(this).data('id');
            // console.log(id);
            // 3. 获取本地localStorage数据      转成js对象,并且是不是空数组
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            console.log(historyList);
            // 4. 从数组中遍历id,并与当前点击一直的x一直,进行数组删除
            for (var i = 0; i < historyList.length; i++) {
                // 4.1 判断当前点击的x与数据的id是否一直
                if(historyList[i].id == id){
                    // 4.2 从数组中删除这条数据
                    console.log(id);
                    historyList.splice(i,1);
                }
            }
            // console.log(historyList);
            // 5. 删除完成将数组保存至本地localStorage(setItem) 并转成json对象
           localStorage.setItem('historyList',JSON.stringify(historyList));
            // 6. 删除后需要刷星列表 调用查询方法
            that.queryHistory();
        })
    },
    // 清空历史事件
    clearHistory: function () {
        var that = this;
        // 1. 清空点击事件
        $('.btn-trash').on('tap',function () {
            // 2. 清空本地存储的值,并删掉历史记录的键
            localStorage.removeItem('historyList');
            // 3. 刷新页面
            that.queryHistory();
        })
    }
}