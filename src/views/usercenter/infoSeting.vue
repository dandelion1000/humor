<template>
    <div class="infoSeting">
        <div class="info-title box-border-bottom">
            个人信息设置
        </div>
        <div class="info-main-content">
            <div class="flex justify">
                <div class="user-cur-image flex-center">
                    <div class="user-img-border">
                        <div class="mask-img pointer" @click="editAvator">
                            <Icon type="ios-create-outline" />
                        </div>
                        <img :src="userAvator" alt="">
                    </div>
                    <div class="userbaseinfo">
                        <div class="info-line">
                            用户名: {{userInfos.name}}
                        </div>
                        <div class="info-line">
                            手机号:<span v-if="userInfos.phone">{{userInfos.phone}}  <Icon class="pointer" type="md-create" @click="bindPhone(2)"/></span> <span class="unverify" v-else>手机号未验证</span>
                        </div>
                        <div class="info-line">
                            昵称: {{userInfos.nick_name}} xxx
                        </div>
                    </div>
                </div>

                <Alert v-if="!userInfos.phone" class="right-Alert" type="info" show-icon closable>
                    请绑定手机号
                    <div slot="desc">
                        绑定手机号后才能解锁更多功能噢,
                        <a class="link-blue" @click="bindPhone(1)">立即绑定</a>
                    </div>
                </Alert>
            </div>

        </div>
        <bind-phone ref="bind" :title="bindTitle" ></bind-phone>
        <media-modal ref="media" @on-change="updateAvator"></media-modal>
    </div>
</template>
<script>
import bindPhone from './bindphone.vue';
import MediaModal from './mediaCamera.vue';
export default {
    components: {
        'bind-phone': bindPhone,
        'media-modal': MediaModal
    },
    data() {
        return {
            userAvator: '',
            hasCamerImg: false,
            userInfos: {},
            bindTitle: ''
        };
    },
    watch: {

    },
    mounted() {
        this.userInfos = this.$store.state.user.userinfo;
        this.userAvator = this.$store.state.user.userinfo.account_avatar;
    },
    methods: {
        bindPhone(type) {
            this.bindTitle  =  type === 1 ? '绑定手机号' : '修改手机号';
            this.$refs.bind.openmodal();
        },
        editAvator() {
            this.$refs.media.open();
        },
        updateAvator(data) {
            this.userAvator = data;
        }


    }
};
</script>
<style lang="less">
.infoSeting {
    .info-main-content {
        margin-top: 20px;
        border-bottom: 1px solid #eee;
        .info-line {
            margin: 15px 20px;
            .ivu-icon-md-create {
                font-size: 16px;
                position: relative;
                top: -2px;
                left: 4px;
            }
        }
        .right-Alert {
            width: 400px;
            height: 84px;
            .ivu-alert-desc {
                margin-top: 8px;
            }
        }
        .unverify {
            display: inline-block;
            background-color: rgb(222, 250, 212);
            color: #458a45;
            width: 90px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            border-radius: 2px;
            text-align: center;
            margin-left: 5px;
        }
    }
    .user-img-border {
        width: 100px;
        height: 100px;
        position: relative;
        .mask-img {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            line-height: 100px;
            text-align: center;
            background: #00000070;
            z-index: 100;
            border-radius: 50%;
            .ivu-icon {
                color: #fff;
                font-size: 24px;
            }
        }
        &:hover > .mask-img {
            display: block;
        }
        img {
            width: 100%;
            height: 100%;
            background: #efefef;
            padding: 8px;
            border-radius: 50%;
        }
    }
}
#video {
    display: block;
}
.update-avator-modal {
    .ivu-modal-body {
        position: relative;
        height: 300px;
        .userCameraImg {
            height: 280px;
            width: 100%;
            padding: 20px;
            .justify-img {
                border: 1px solid #eee;
                width: 100%;
                height: 240px;
                .middle-cell {
                    height: 230px;
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                }
                img {
                    max-width: 100%;
                    max-height: 100%;
                    padding: 4px;
                    vertical-align: middle;
                }
            }
            .ivu-radio-group-vertical .ivu-radio-wrapper {
                margin-bottom: 15px;
            }
            .update-method {
                margin-left: 20px;
                .img-line {
                    .ivu-icon {
                        margin-left: 12px;
                        font-size: 28px;
                    }
                    span {
                        position: relative;
                        top: 2px;
                        left: 10px;
                    }
                }
            }

        }
    }
}

.carmea-btn {
    margin: 20px;
}
</style>
