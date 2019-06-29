import Api from '@/api/notice.js';

// 定义一个混入对象
let myMixin = {
    data() {
        return {
            noticeArray: [],
            totalNum: 0,
            page_num: 1,
            spinShow: false,
            hasUnRead: false
        };
    },
    mounted() {
        this.getNoticeLists(0, 0);
        this.isHasunRead();
    },
    methods: {
        getNoticeLists(type, read) {
            this.spinShow = true;
            let parmas = {
                num: this.page_num,
                size: 5,
                type: type,
                read: read
            };
            Api.getNoticeList(parmas).then((res) => {
                this.noticeArray = res.list;
                this.totalNum = res.total;
                this.spinShow = false;
            });
        },
        isHasunRead() {
            Api.getNoticeCount(0, 1).then((res) => {
                this.hasUnRead = !!res.total;
            });
        },
        setSingleRead(elem, index) {
            if (elem.readed == 2) {
                return;
            }
            Api.setSingleRead(elem.id).then(() => {
                this.$set(this.noticeArray[index], 'readed', 2);
            });
        },
    }
};

export default myMixin;
