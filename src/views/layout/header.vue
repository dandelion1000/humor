<template>
    <div class="relax-header flex-center">
        <div class="header-left">
            <div class="flex-center">
                <div class="um-logo pointer"  @click="goIndex">
                    <!-- v-html="umorLogo()" -->
                    <i>Umor</i>
                </div>
                <div class="navbar">
                    <a class="nav-item">
                        我的U时光
                    </a>
                    <router-link  class="nav-item" :to="{ name: 'helpme'}">bug求助区</router-link>
                    <router-link  class="nav-item" :to="{ name: 'aroundshop'}">周边商城</router-link>
                    <router-link  class="nav-item" :to="{ name: 'support'}">支持我们</router-link>
                    <router-link  class="nav-item" :to="{ name: 'aboutus'}">关于我们</router-link>
                </div>
            </div>
        </div>
        <div class="user-profile">
            <template v-if="!islogin">
                <router-link class="link-url" to="/login">
                    登录
                </router-link>
                <router-link class="link-url" to="/register">
                    注册
                </router-link>
            </template>
            <template v-else>
                <div class="flex-center">
                    <div class="pointer header-notice">
                        <Icon type="ios-notifications-outline" />
                        <i class="justify-pos isreaddot" v-if="hasUnRead">
                        </i>
                        <div class="notice-list">
                            <div class="notice-item"
                                 v-for="(elem, index) in noticeArray"
                                 :key="elem.id"
                                 @click="setSingleRead(elem, index)"
                            >
                                <div class="flex-center">
                                    <div class="isreaddot" v-if="elem.readed==1">
                                    </div>
                                    <div class="flex1 break-word" v-html="elem.msg" >
                                    </div>
                                </div>
                            </div>
                            <div class="topic-link notice-item">
                                <router-link :to="{ name: 'allnotice'}">查看全部通知 》</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="click-user pointer flex-center" @click="showMenu">
                        <img  :src="userImg" alt="">

                        <span>
                            {{ username }}
                        </span>
                        <div class="hover-display white-bg"  v-if="clickTrue" >
                            <div class="nav1">
                                <router-link :to="{ name: 'infoSeting'}">个人中心</router-link>
                            </div>
                            <div class="nav1">
                                <a @click="logout">退出登录</a>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import mixin from '@/components/notice-mixinfn.js';
export default {
    mixins: [mixin],
    data() {
        return {
            clickTrue: false,
            // noticeArray: [],
            color: ['#4285f4', '#ea4334', '#9EA3F9', '#adb6d0', '#fbbc06', '#34a853', '#11244f', '#6bdfd0', '#833349', '#928ebf'],
        };
    },
    computed: {
        userImg() {
            return this.$store.state.user.userinfo.account_avatar;
        },
        islogin() {
            return this.$store.state.user.islogin;
        },
        username() {
            return this.$store.state.user.userinfo.name;

        }
    },
    mounted() {
        //do something after mounting vue instance
        let $self = this;
        document.addEventListener('click', function ($event) {
            event = $event || window.event;
            $self.clickTrue = false;
            event.stopPropagation();
        //   event.preventDefault();
        });
    },
    methods: {
        goIndex() {
            this.$router.push({name: 'umtime'});
        },
        showMenu($event) {
            let event = $event || window.event;
            this.clickTrue = true;
            event.stopPropagation();
        },
        umorLogo() {
            /*logo几个字母随机颜色*/
            let str = 'Umor';
            console.log('umor');
            return str.split('').map((item) => {
                let self_clr = this.color[Math.floor(Math.random()*9)];
                return `<i style="color:${self_clr}">${item}</i>`;
            }).join('');
        },
        logout() {
            this.$store.dispatch('handleLogOut').then(() => {
                this.$router.push({name: 'login'});
            });
        }

    }
};
</script>
<style lang="less">
.relax-header {
    width: 100%;
    position: fixed;
    top:0px;
    height: 60px;
    border-bottom: 1px solid #eee;
    padding: 10px 90px;
    z-index: 100;
    background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB,#8090f9);
    background-size: 400% 400%;
    animation: titlebar 15s ease infinite;
    color: #fff;
    a.nav-item {
        color: #fff;
    }
    @keyframes titlebar {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%
    }
    100% {
        background-position: 0% 50%
    }
    }
    .header-left {
        flex: 1;
        .um-logo {
            font-size: 30px;
            font-weight: 500;
            width: 160px;
            // filter: blur(1px);
            // text-shadow:1px 1px #333;
            // background: linear-gradient(to right, #fff, #efefef, #9ea3a9, #333, #1a1a1a, #333, #9ea3a9, #efefef, #fff); /* 标准的语法（必须放在最后） */

        }
    }
    .navbar {
        margin-left: 30px;
        position: relative;
        top: 3px;
    }
    .link-url,.nav-item {
        margin: 0 15px;
    }
    .user-profile {
        .header-notice {
            position: relative;
            width: 118px;
            text-align: center;
            margin-right: 30px;
            height: 100px;
            .justify-pos {
                position: relative;
                top: -2px;
            }
            .ivu-icon-ios-notifications-outline {
                font-size: 22px;
                line-height: 100px;
            }
            .notice-list {
                .isreaddot {
                    position: relative;
                    top: -10px;
                }
                width: 260px;
                display: none;
                position: absolute;
                top: 78px;
                right: -49px;
                border: 1px solid #eee;
                background: #fff;
                border-radius: 4px;
                text-align: left;
                .topic-link {
                    text-align: center;
                }
            }
            &:hover > .notice-list{
                display: block;
            }
        }

        .click-user{
            position: relative;
        }
        .hover-display {
            width: 120px;
            height: 100px;
            border: 1px solid #eee;
            border-radius: 5px;
            position: absolute;
            top: 50px;
            padding: 20px 10px;
            .nav1 {
                height: 30px;
                line-height: 30px;
                // border-bottom: 1px solid #eee;
            }
        }

    }
}
</style>
