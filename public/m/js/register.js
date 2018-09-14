$(function () {
    var letao = new Letao();
    // 注册
    letao.register();
    // 获取验证码
    letao.getVode();
})

var Letao = function () {
    
}

Letao.prototype = {
    vCode: "",
    // 登录功能
    register: function () {
        var that = this;
        // 1. 添加点击事件
        $('.btn-register').on('tap',function () {
            // 2. 获取当前输入用户名
            var username = $('.username').val()
            // 3. 获取手机号
            var mobile = $('.mobile').val()
            // 4. 密码1
            var password1 = $('.password1').val()
            // 5. 密码2
            var password2 = $('.password2').val()
            // 获取验证码
            var vCode = $('.vcode').val()
           
            // 提示判断(开关思想))
            var check = true;

            // 遍历所有输入框,判断是否为空
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒 
                if(!this.value || this.value.trim() == "") {
                    // 获取当前输入框的左边label
                    var label = this.previousElementSibling;
                    // mui.alert(label.innerText + "不允许为空");
                    mui.toast(label+'不允许为空',{duration:1000,type:'div'})
                    check = false;
                    return false;
                }
                }); 
                //校验通过，继续执行业务逻辑 
                if(check){
                    // mui.alert('验证通过!')
                    // 判断两次密码是否一致
                    if(password1 != password2){
                        mui.toast('两次密码输入错误',{duration:1000,type:'div'})
                        return false;
                    }
                    // 判断验证码输入正确
                    if(that.vCode != vCode){
                        mui.toast('验证码输入错误',{duration:1000,type:'div'})
                        return false;
                    }
                    // 发送请求
                    $.ajax({
                        type: "post",
                        url: "/user/register",
                        data: {username: username, password: password1, mobile: mobile,vCode: vCode},
                        success: function (data) {
                            console.log(data);
                            // 后台返回错误,提示用户
                            if(data.error){
                                mui.toast(data.message,{duration:1000,type:'div'})
                                return false;
                            }else{
                                // 注册成功跳转登录
                                window.location.href = "login.html?returnUrl=index.html";
                            }
                        }
                    })
                }

        })
    },

    // 获取验证码
    getVode: function () {
        var that = this;
        // 验证码按钮点击事件
        $('.btn-getvCode').on('tap',function () {
            $.ajax({
                url: "/user/vCode",
                success: function (data) {
                    console.log(data.vCode);
                    // 后台返回的验证码,并记录到全局
                    that.vCode = data.vCode;
                }
            })
        })
    }
}