<template>
    <div class="notice-union">
        <div class="notice-header flex">
            <div class="">
                通知中心
            </div>
            <div class="">
                <Button @click="setRead">标记全部已读</Button>
                <Button type="primary" @click="viewNotice(1)">查看未读</Button>
                <Button type="primary" @click="viewNotice(2)">查看所有已读</Button>
            </div>
        </div>
        <div class="notice-list">
            <div class="notice-item"
                 v-for="(elem, index) in noticeArray"
                 :key="elem.id"
                 @click="setSingleRead(elem, index)"
            >
                <div class="flex-center">
                    <div class="isreaddot" v-if="elem.readed==1">

                    </div>
                    <div class="" v-if="elem.type==2">
                        系统消息:
                    </div>
                    <div class="flex1" v-html="elem.msg" >
                    </div>
                    <div class="update-time">
                        <Icon type="ios-alarm-outline" /> <span> {{elem.created_at}}</span></div>
                </div>
            </div>
            <div class="no-data" v-if="noticeArray.length == 0">
                暂无数据
            </div>
            <div class="notice-loading">
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </div>
        <div class="notice-page">
            <Page :total="totalNum" show-elevator @on-change="pageChange" />
        </div>
    </div>
    </div>
</template>
<script>
import UmButton from '@/components/Button/button.vue';
import Api from '@/api/notice.js';
import mixin from '@/components/notice-mixinfn.js';
export default {
    components: {
        'um-button': UmButton,
    },
    mixins: [mixin],
    data() {
        return {

        };
    },
    mounted() {
        // this.getNoticeLists(0, 0);
    },
    methods: {
        // getNoticeLists(type, read) {
        //     this.spinShow = true;
        //     let parmas = {
        //         num: this.page_num,
        //         size: 5,
        //         type: type,
        //         read: read
        //     };
        //     Api.getNoticeList(parmas).then((res) => {
        //         console.log(res);
        //         this.noticeArray = res.list;
        //         this.totalNum = res.total;
        //         this.spinShow = false;
        //     });
        // },
        pageChange(num) {
            this.page_num = num;
            this.getNoticeLists(0, 0);
        },
        setRead() {
            Api.setAllRead().then(() => {
                this.$Message.success('操作成功');
                this.getNoticeLists(0, 0);
            });
        },
        // setSingleRead(id) {
        //     Api.setSingleRead(id).then(() => {
        //         this.getNoticeLists(0, 0);
        //     });
        // },
        viewNotice(type) {
            this.page_num = 1;
            this.getNoticeLists(0, type);
        }
    }
};
</script>
<style lang="less">
.notice-union {
    padding: 30px;
    .notice-header {
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #f5f7fa;
        padding-bottom: 20px;
        .ivu-btn {
            margin-right: 15px;
        }
    }
    .notice-list{
        position: relative;
        border: 1px solid #efefef;
        border-radius: 4px;
        padding: 20px;
        margin-top: 20px;
    }
    .notice-item {
        .update-time {
            color: #76808ef7;
            font-size: 12px;
        }
        &:hover {
            background: #f5f7f9;
        }
    }
    .no-data {
        text-align: center;
    }
    .has-read {
        // background: #dadfe6;
        color: #ddd;
    }
    .notice-page {
        margin-top: 30px;
        text-align: right;
    }
}
</style>
