$(function () {
    var letao = new Letao();
    // 登录功能
    letao.login();
})

var Letao = function () {
    
}

Letao.prototype = {
    // 登录功能
    login: function () {
        var that = this;
        // 1. 添加登录点击事件
        $('.btn-login').on('tap',function () {
            // 2. 获取当前输入用户名
            var username = $('.username').val()
            // 3. 判断当前是否输入用户名
            // if(!username){
            //     // 4. 调用mui的小时提示框
            //     mui.toast('请输入用户名',{duration:1000,type:'div'})
            //     // 6. 后面代码不执行
            //     return;
            // }
            // 7. 获取当前输入密码
            var password = $('.password').val()
            // 定义开关
            var check = true;
            // 遍历所有input并判断值是否为空
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒 
                if(!this.value || this.value.trim() == "") {
                    // 获取当前输入框的左边label
                    var label = this.previousElementSibling;
                    // mui.alert(label.innerText + "不允许为空");
                    mui.toast(label.innerHTML+'不允许为空',{duration:1000,type:'div'})
                    check = false;
                    return false;
                }
                }); 
            //校验通过，继续执行业务逻辑 
            if(check){
                // 提示用户
                mui.toast('验证通过!',{duration:1000,type:'div'})
                $.ajax({
                    type: "post",
                    url: "/user/login",
                    data: {username: username, password: password},
                    success: function (data) {
                        console.log(data);
                        if(data.error){
                            // 登录错误提示用户  
                            mui.toast(data.message,{duration:1000,type:'div'})
                        }else{
                            // 获取url
                            var returuUrl = that.getQueryString('returuUrl');
                            // 防止returuUrl为null报错
                            returuUrl ? window.location.href = returuUrl :  window.location.href = 'index.html';
                        }
                    }
                })
            }

        })
    },
    
    // 正则,获取url值
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
}