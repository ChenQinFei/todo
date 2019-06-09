<template>
    <div id="signInUp">
        <h1>TODO</h1>
        <ul class="form-login">
            <li>
                <label for="account"> 用户名</label>
                <input type="text" id="account" autofocus="autofocus" v-model="account"/>
            </li>
            <li>
                <label for="password">密码</label>
                <input type="password" id="password" v-model="password">
            </li>
            <li>
                <label for="re_password">重复密码</label>
                <input type="password" id="re_password" v-model="rePassword">
            </li>
            <li>
                <label for="email">邮箱</label>
                <input type="email" id="email" v-model="email" placeholder="abc@def.com">
            </li>
            <li>
                <label for="tel">电话</label>
                <input type="tel" id="tel" v-model="tel" placeholder="123-4567-8901">
            </li>
            <li class="tip" :class="regState == 1 ? 'right' : 'error'" v-if="msg.length > 0">{{msg}}</li>
            <li>
                <a href="javascript:void(0)" @click="handleRegister" class="log-button selected">注册</a>
            </li>
            <li class="tip">已有账号，去 <router-link to="/login" class="signin"> 登录 </router-link></li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "signInUp",
        data: function() {
            return {
                account: '',
                password: '',
                rePassword: '',
                email: '',
                tel: '',
                msg: '',
                regState: 0,
            }
        },
        methods : {
            register: function(){
                const _this = this;
                this.$axios.post('/register', {
                    account: this.account,
                    password: this.password,
                    email: this.email,
                    tel: this.tel,
                }).then(function(res) {
                    res = res.data;
                    if (res.code === 0) {
                        _this.msg = res.msg;
                        _this.loginState = 0;
                    } else {
                        _this.$router.push({ path: 'home' })
                    }
                }).catch(function(error) {
                    _this.msg = '注册失败，请稍后重试！';
                    _this.loginState = 0;
                });
            },
            handleRegister: function() {
                if (this.account === "" || this.password === "") {
                    this.msg = "用户名或密码为空！";
                    this.loginState = 0;
                    return;
                } else if (this.rePassword === "") {
                    this.msg = "请再次输入密码！";
                    this.loginState = 0;
                    return;
                } else if (this.rePassword !== this.password) {
                    this.msg = "两次输入密码不一致！";
                    this.loginState = 0;
                    return;
                }
                this.msg = "注册中...";
                this.loginState = 1;
                this.register();
            }
        }
    }
</script>
<style scoped lang="scss">
    #signInUp {
        width: 400px;
        /*height: 150px;*/
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*border: solid 2px #172f50;*/
        border-radius: 3px;
        box-shadow: 0 0 3px #ccc;
        padding: 50px;
    }
    #signInUp h1 {
        background: linear-gradient(to right, #ffeb3b, #ff5722);
        -webkit-background-clip: text;
        color: transparent;
        font-size: 50px;
    }
    .form-login li {
        margin: 15px auto 0;
        display: flex;
        width: 300px;
    }

    .form-login li label {
        flex: 1;
        text-align: right;
        margin-right: 20px;
        line-height: 26px;
    }
    .form-login li input {
        flex: 3;
        padding: 3px;
        border: 1px solid #ccc;
        border-radius: 3px;
        line-height: 18px;

    }
    .form-login .log-button {
        /*flex:1;*/
        padding: 5px;
        width: 250px;
        margin: 20px auto 0;
        border: 1px solid #ccc;
        border-radius: 2px;
        color:#555;
        transition: background-color .3s ease;
    }
    .form-login .log-button:hover {
        background: #f7f7f7;
    }
    .form-login .log-button.selected {
        background-color: #ff9800;
        color: #fff;
        border: transparent;
    }
    .form-login .log-button.selected:hover {
        background: #ff7700;
    }
    .form-login li.tip {
        margin-left:70px;
    }
    li.tip.right {
        color: orange;
    }
    li.tip.error {
        color: red;
    }
    .form-login li.tip a {
        color: #ff9800;
    }
    .form-login li.tip a:hover {
        text-decoration: underline;
    }


</style>