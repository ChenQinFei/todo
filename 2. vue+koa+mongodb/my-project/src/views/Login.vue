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
            <li class="tip" :class="loginState == 1 ? 'right' : 'error'" v-if="msg.length > 0">{{msg}}</li>
            <li>
                <a href="javascript:void(0)" @click="handleSignin" class="log-button selected">登录</a>
                <router-link to="/register" class="log-button">注册</router-link>
            </li>

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
                msg: '',
                loginState: 1,
            }
        },
        methods: {
            signin: function(){
                const _this = this;
                this.$axios.post('/signin', {
                    account: this.account,
                    password: this.password
                }).then(function(res){
                    res = res.data;
                    if (res.code === 0) {
                        _this.msg = res.msg;
                        _this.loginState = 0;
                    } else {
                        _this.$router.push({ path: 'home' })
                    }
                }).catch(function(error) {
                    _this.msg = '登录失败，请稍后重试！';
                    _this.loginState = 0;
                });
            },
            handleSignin: function() {
                if (this.account === "" || this.password === "") {
                    this.msg = "用户名或密码为空！";
                    this.loginState = 0;
                    return;
                }
                this.msg = "登录中...";
                this.loginState = 1;
                this.signin();
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
        line-height: 32px;
    }
    .form-login li input {
        flex: 3;
        padding: 3px;
        border: 1px solid #ccc;
        border-radius: 3px;
        line-height: 24px;

    }
    .form-login .log-button {
        flex:1;
        padding: 5px;
        margin: 20px 10px 0;
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
    li.tip {
        margin-left: 138px;
    }
    li.tip.right {
        color: orange;
    }
    li.tip.error {
        color: red;
    }


</style>