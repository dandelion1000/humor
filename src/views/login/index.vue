<template>
    <div class="login">
        <div class="login-form white-bg">
            <h3>登录umor</h3>
            <div class="line-group">
                <Input size="large" type="text" v-model="username" prefix="ios-contact" placeholder="请输入用户名" style="width: 400px" />
            </div>
            <div class="line-group">
                <Input size="large" type="password" v-model="password" placeholder="请输入密码" style="width: 400px" />
            </div>
            <div class="line-group login-btn">
                <Button size="large" type="primary" @click="goLogin">登录</Button>
            </div>
            <div class="unregister">
                还未注册？<router-link class="link-url" to="/register">点击注册</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import Api from '@/api/user.js';
export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        goLogin() {
            if (!this.username || !this.password) {
                this.$Message.warning('信息不完整');
                return;
            }
            Api.Login(this.username, this.password).then((res) => {
                this.$Message.success('登录成功');
                window.localStorage.setItem('islogin', true);
                this.$router.push({name: 'umtime'});

            });
        }
    }
};
</script>

<style lang="less">
.login {
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/6.jpg");
    background-size: 100% 100%;
    .login-form {
        width: 478px;
        height: 375px;
        border-radius: 10px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        h3 {
            margin-top: 20px;
        }
        .unregister {
            a {
                color: #2D8cF0;
            }
            position: absolute;
            bottom: 20px;
            right: 28px;
        }
        .line-group {
            margin-top: 30px;
        }
        .login-btn {
            width: 400px;
            margin: 30px auto;
            .ivu-btn {
                width: 100%;
            }
        }
    }

}
</style>
