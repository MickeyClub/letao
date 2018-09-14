$(function () {
    var letao = new Letao();
    // 获取用户信息
    letao.queryUserMessage();
    // 退出登录
    letao.exit();
})

var Letao = function () {
    
}

Letao.prototype = {
    // 获取用户信息
    queryUserMessage: function () {
        // 1. 页面渲染立刻调用用户信息api
        $.ajax({
            url: "/user/queryUserMessage",
            success: function (data) {
                console.log(data);
                if(data.error){
                    // 未登录,跳转登录页
                    location.href = 'login.html?returuUrl=user.html'
                }else{
                    // 2. 将用户名和手机号渲染成获取的信息
                    $('.username').html(data.username);
                    $('.mobile').html(data.mobile);
                }
            }
        })
    },
    
    // 退出登录
    exit: function () {
        // 1. 点击事件退出
        $('.exit .btn-exit').on('tap',function () {
            console.log('1');
            // 2. 发送请求退出api登录
            $.ajax({
                url: "/user/logout",
                success: function (data) {
                    console.log(data);      
					// 3. 退出成功就跳转到登录
                    if(data.success){
                        location.href = 'login.html?returnUrl=user.html';
                    }
                }
            })
            
        })
    }
}