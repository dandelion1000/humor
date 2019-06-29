<template>
    <Modal
        class="bind-mobile-modal"
        width="380"
        v-model="bindmobile" :title="title"
        :closable="false" :mask-closable="false">
        <div class="line-group clearfix">
            <Input size="large" type="text" v-model="mobile" placeholder="请输入手机号" style="width: 100%" />
        </div>
        <div class="line-group flex-center">
            <Input  size="large" v-model="verifycode" placeholder="请输入验证码" style="width: 220px" />
            <div :class="{ 'btn-disabled': disSendCode  }" class="getcode flex1" @click="getVerifyCode" >
                {{  codeStatus ? codeRefresh + 's' : '获取验证码' }}
            </div>
        </div>
        <div slot="footer">
            <div class="del-cancel-text pointer" @click="close">关闭</div>
            <Button type="primary" @click="bindPhone">确定</Button>
        </div>
    </Modal>
</template>
<script>
import utils from '@/utils/sendcode.js';
import Api from '@/api/updateinfo.js';
export default {
    props: {
        'title': String,
    },
    data() {
        return {
            bindmobile: false,
            mobile: '',
            verifycode: '',
            codeStatus: 0,
            codeRefresh: 60,
        };
    },

    computed: {
        disSendCode() {
            let reg = /^1\d{10}$/;
            return !reg.test(this.mobile) || this.codeStatus;
        }
    },
    mounted: function () {

    },

    methods: {
        getVerifyCode() {
            if (this.codeStatus || this.disSendCode) {
                return ;
            }
            this.codeStatus = 1;
            Api.sendCode(this.mobile).then(() => {
                this.$Message.success('发送成功');
                this.codeRefresh = 60;
                this.destroyCountDown  = utils.countdown(this.codeRefresh, {
                    onProgress: (s) => this.codeRefresh = s,
                    onEnd: () => this.codeStatus = 0
                });
            }).catch(() => {

            });
        },

        bindPhone: function () {
            if (this.destroyCountDown) {
                this.destroyCountDown();
            }
            let obj = {
                phone: this.mobile,
                code: this.verifycode
            };
            Api.bindPhone(obj).then(() => {
                this.$Message.success('绑定成功');
                this.close();
            }).catch((err) => {
                this.$Message.error(err);
                this.codeRefresh = 60;
                this.codeStatus = 0;
            });
        },
        openmodal() {
            this.bindmobile = true;
        },
        close() {
            this.bindmobile = false;
        },
    }

};
</script>
<style lang="less">
.bind-mobile-modal {
    .line-group {
        margin-top: 20px;
    }
    .getcode {
        display: inline-block;
        margin-left: 8px;
        height: 36px;
        line-height: 36px;
        padding: 0 5px;
        text-align: center;
        border: 1px solid #333;
        color: #333;
    }
    .btn-disabled {
        border: 1px solid #eee;
        color: #777;
    }
}
</style>
