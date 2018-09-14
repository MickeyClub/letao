$(function () {
    var letao = new Letao();
    // 乐淘后台登录
    letao.login();
})

var Letao = function () {
    
}

Letao.prototype = {
    // 后台登录
    login: function () {
        // 1. 登录点击事件
        $('.btn-login').on('click',function () {
            // 2. 获取用户名和密码
            var username = $('#username').val();
            var password = $('#password').val();
            // 开关(判断输入框是否为空)
            var check = true;
            $('.input-group input').each(function () {
                if(!this.value || this.value.trim() == "") {
                    // 获取当前输入框的左边label
                    var label = this.parentNode.previousElementSibling;
                    // mui.alert(label.innerText + "不允许为空");
                    alert('不允许为空'+label.innerHTML)
                    check = false;
                    return false;
                }
            })
            //校验通过，继续执行业务逻辑 
           if(check){
               $.ajax({
                   type: "post",
                   url: "/employee/employeeLogin",
                   data: {username: username, password: password},
                   success: function (data) {
                       if(data.error){
                            // 登录失败提示用户   
                            alert(data.message);
                       }else{
                            // 登录成功跳转主页
                           window.location.href = "index.html";
                       }
                   }
               })
           }
        })
    }
}