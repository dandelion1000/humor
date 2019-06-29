<template>
    <div class="relax-main">
        <um-header></um-header>
        <div class="umtime-content flex" v-infinite-scroll="loadMore" infinite-scroll-disabled="disableLoadMore" infinite-scroll-distance="50">
            <div class="umtime-left">
                <div class="um-pp flex">
                    <div class="user-avator">
                        <!-- <Icon type="ios-bug-outline" /> -->
                        <img class="user-avator-img" :src="userAvator" alt="">
                    </div>
                    <div class="user-bubble">
                        <um-editor ref="editor" :html.sync="editorText">
                        </um-editor>
                        <div class="u-bb-footer">
                            <Checkbox v-model="single">隐身</Checkbox>
                            <div class="u-button" @click="releaseBubble">
                                <um-button>U一下</um-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="umbb-list">
                    <div class="umbb-item flex" v-for="(elem,index) in bbArray" :key="elem.index">
                        <div class="user-avator">
                            <img class="user-avator-img" :src="elem.account_info.account_avatar" alt="">
                        </div>
                        <div class="box-border  user-self-bubble  white-bg flex1">
                            <div class="bb-top-area">
                                <div class="bb-content " :class="{'overflow': elem.isHideMore}">
                                    <div v-html="elem.content">
                                    </div>
                                    <div class="show-more" v-if="elem.height > 200 && elem.isHideMore" @click="showMore(elem)">
                                    </div>
                                </div>
                                <div class="bubble-info flex">
                                    <div>{{elem.account_info.account_name}}</div>
                                    <div>
                                        <Icon type="ios-alarm-outline" /> <span> {{elem.created_at}}</span></div>
                                    <div class="pointer" @click="likeBubble(index, elem.islike, elem.id)">
                                        <Icon v-if="!elem.islike" type="ios-heart-outline" />
                                        <Icon v-else type="ios-heart" :class="{'islike-bb': elem.likedClick, 'islikeed': elem.islike}" />

                                        <span> {{elem.like_num}}</span>
                                    </div>
                                    <div>
                                        <Icon type="ios-text-outline" /> <span> {{elem.comment_num}}</span></div>
                                    <div class="can-delete-bubble pointer" v-if="elem.current_account" @click="deleteMyBubble(index, 1, elem.id)">
                                        <Icon type="md-close" /> <span> 删除</span>
                                    </div>
                                    <Modal :mask="false" :mask-closable="false" :closable="false" style="text-align:center;margin:30px 0;" v-model="dmodal" :styles="{top: '0px'}">
                                        <p style="font-size:16px;margin:10px 0;">{{deleteTitle}}</p>
                                        <div slot="footer">
                                            <div class="del-cancel-text pointer" @click="cancel2">取消</div>
                                            <Button type="primary" @click="sureKeyDel">确定</Button>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                            <div class="bb-comment">
                                <comment-editor ref="comeditor" :pindex="index" @on-click="releaseCommet(index, elem.id)"></comment-editor>
                                <div class="bb-comment-list" v-if="elem.comment.length > 0">
                                    <div class="comment-item clearfix" v-for="(item, no) in elem.comment">
                                        <div class="user-profile pull-left">
                                            <img :src="item.account_info.account_avatar" alt="">
                                        </div>
                                        <div class="comment-right pull-left">
                                            <div class="comment-content">
                                                {{ parseText(item.content) }}
                                            </div>
                                            <div class="bubble-info flex">
                                                <div>{{item.account_info.account_name}}</div>
                                                <div>
                                                    <Icon type="ios-alarm-outline" /> <span> {{item.created_at}}</span></div>
                                                <div class="reply-comment pointer" @click="replyUser(item.account_info.account_name, index)">
                                                    <Icon type="ios-create" /> <span> 回复</span>
                                                </div>
                                                <div class="can-delete-comment pointer" v-if="item.current_account" @click="deleteMyBubble(no, 2, item.id, index)">
                                                    <Icon type="md-close" /> <span> 删除</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="show-all-reply pointer" @click="showMoreReply(index, elem.id)" v-if="elem.comment_num > 5 && elem.com_num < Math.ceil(elem.comment_num / 5)">
                                        <Icon type="ios-arrow-dropdown-circle" />显示更多评论
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="um-bb-loading" v-if="loading">
                        <Icon type="ios-bug" />加载中...
                    </div>
                </div>
            </div>
            <div class="umtime-right">
                <div class="down-app white-bg">
                    下载umor官方APP
                </div>
                <div class="swipper-pos">
                    <img src="https://dn-coding-net-production-static.codehub.cn/d232ab0c-23ca-46e1-bf06-70ef6e3a8586.jpg" alt="蚂蚁金服ATEC科技大会">
                </div>
                <div class="get-fish-area box-border">
                    捞鱼区,待开发...
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UmHeader from '@/views/layout/header.vue';
import UmEditor from '@/components/umeditor/ppeditor.vue';
import commentEditor from '@/components/umeditor/comment-editor.vue';
import UmButton from '@/components/Button/button.vue';
import Api from '@/api/bubble.js';
import InfiniteScroll from '@/components/scrollLoad/infinite-scroll.js';
import emotjson from '@/components/umeditor/emoji/emojis.js';
export default {
    directives: {
        InfiniteScroll
    },
    components: {
        'um-header': UmHeader,
        'um-editor': UmEditor,
        'um-button': UmButton,
        'comment-editor': commentEditor
    },
    data() {
        return {
            userAvator: '',
            editorText: '',
            dmodal: false,
            single: 0,
            loading: true,
            topicList: [],
            commentList: [],
            deleteTitle: '确认删除该条泡泡?',
            bbArray: [],
            objxy: {},
            isHideMore: true,
            disableLoadMore: false,
            curBbId: '',
            curIndex: 0,
            curNumber: 0,
            delType: 1,
            page_num: 1,
            totalpage: 1,
        };
    },
    mounted() {
        this.userAvator = this.$store.state.user.userinfo.account_avatar;
        if (this.totalpage == 0) {
            this.disableLoadMore = true;
        }
        // this.getBublist();
    },
    methods: {
        loadMore: function () {
            this.disableLoadMore = true;
            if (this.totalpage < this.page_num) {
                this.disableLoadMore = true;
            } else {
                this.getBublist(false);
            }
        },
        parseText(text) {
            let reg = /:([^:]+):/g;
            let parsetx = text.replace(reg, function (word) {
                let ed = word.replace(/:/g, '');
                if (emotjson.hasOwnProperty(ed)) {
                    return emotjson[ed].char;
                }
                return word;
            });
            return parsetx;
        },
        getBublist(reload) {
            let page = {
                num: this.page_num,
                size: 10
            };
            console.log('page', page);
            this.loading = true;
            Api.getBubbleList(page).then((data) => {
                this.totalpage = Math.ceil(data.total / 10);
                let data1 = data.list.map((item) => {
                    return {
                        ...item,
                        isHideMore: true,
                        com_num: 1
                    };
                });
                this.disableLoadMore = false;
                this.loading = false;
                this.bbArray = reload ? data1 : this.bbArray.concat(data1);
                setTimeout(() => {
                    let list = Array.from(document.querySelectorAll('.bb-content'));
                    let pindex = (this.page_num - 1) * 10;
                    list.slice(pindex).map((item, index) => {
                        this.$set(this.bbArray[pindex + index], 'height', item.scrollHeight);
                    });
                    ++this.page_num;
                }, 500);
            }).catch(err => {
                this.disableLoadMore = true;
                this.loading = false;
            });
        },
        deleteMyBubble(index, type, id, no) {
            if (type == 2) {
                this.deleteTitle = '是否删除该评论?';
            }
            this.dmodal = true;
            this.delType = type;
            this.curIndex = index;
            this.curNumber = no;
            this.curBbId = id;
        },
        showMore(elem) {
            elem.isHideMore = false;
        },
        cancel2() {
            this.dmodal = false;
        },
        sureKeyDel() {
            if (this.delType === 1) {
                Api.deleteBubble({
                    id: this.curBbId
                }).then(() => {
                    this.$Message.success('泡泡删除成功');
                    this.dmodal = false;
                    this.bbArray.splice(this.curIndex, 1);
                });
            } else {
                Api.deleteComment({
                    id: this.curBbId
                }).then(() => {
                    this.$Message.success('评论删除成功');
                    this.dmodal = false;
                    this.bbArray[this.curNumber].comment.splice(this.curIndex, 1);
                });
            }
        },
        likeBubble(index, bol, id) {
            this.touchLike(index, bol, 1, id);
        },
        touchLike(index, bol, type, id) {
            let obj = {
                handle: bol ? 2 : 1,
                type: type,
                id: id
            };
            Api.touchLike(obj).then(() => {
                let bItem = this.bbArray[index];
                this.$set(bItem, 'likedClick', bol ? 0 : 1);
                this.$set(bItem, 'islike', bol ? 0 : 1);
                this.$set(bItem, 'like_num', bol ? bItem['like_num'] - 1 : bItem['like_num'] + 1);
            });
        },
        releaseCommet(index, id) {
            let obj = {
                bid: id,
                text: document.querySelector(`#um-bb-editor${index}`).innerText
            };
            Api.insertComment(obj).then(() => {
                this.$Message.success('评论成功');
                document.querySelector(`#um-bb-editor${index}`).innerText = '';
                this.bbArray[index].com_num = 1;
                this.$set(this.bbArray[index], 'com_num', 1);
                this.$set(this.bbArray[index], 'comment_num', this.bbArray[index].comment_num + 1);
                this.getCommentList(false, index, id);

            });
        },
        getCommentList(reload, index, id) {
            let obj = {
                num: this.bbArray[index].com_num,
                size: 5,
                bid: id
            };
            Api.getCommentList(obj).then((res) => {
                let list = reload ? this.bbArray[index].comment.concat(res.list) : res.list;
                this.$set(this.bbArray[index], 'comment', list);
            });
        },
        releaseBubble() {
            let text = document.getElementById('um-editor').innerHTML;
            let objs = {
                content: text,
                incognito: Number(this.single),
            };
            Api.createBubble(objs).then(() => {
                this.$Message.success('成功发布摸鱼动态');
                document.getElementById('um-editor').innerHTML = '<div><br></div>';
                this.page_num = 1;
                this.getBublist(true);

            });
        },
        showMoreReply(index, id) {
            this.bbArray[index].com_num++;
            this.getCommentList(true, index, id);
        },
        replyUser(name, index) {
            /*回复作为评论即可*/
            this.$refs.comeditor[index].dealMention(name, index);
        }

    }
};
</script>
<style lang="less">
.relax-main {

    .umtime-content {
        margin-top: 60px;
        padding: 20px 105px;
    }
    .umtime-left {
        flex: 1;
        max-width: 720px;
        height: 100%;
        .umbb-list {
            margin: 60px 0 30px;
            .umbb-item {
                margin-bottom: 30px;
            }
        }
        .islikeed {
            color: #f75288;
        }
        .islike-bb {
            display: inline-block;
            color: #f75288;
            animation: fadeline 1.5s linear;
        }
        @keyframes fadeline {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(2);
                opacity: 0.1;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        .can-delete-bubble,
        .can-delete-comment {
            display: none;
            .ivu-icon-md-close {
                font-size: 18px;
                color: #fa6855;
            }
        }

        .user-self-bubble {
            .bb-top-area {
                padding: 10px;
                border-bottom: 1px solid #eee;
                .overflow {
                    max-height: 200px;
                    overflow: hidden;
                }
                .bb-content {
                    position: relative;
                    line-height: 30px;
                    margin-bottom: 10px;
                    word-break: break-all;
                    word-wrap: break-word;
                    cursor: text;
                    .show-more {
                        cursor: pointer !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,.02);
                        &:after {
                            position: absolute;
                            width: 100%;
                            height: 12px;
                            bottom: 0;
                            content: '';
                            background: url("../../assets/images/hideicon.png");
                            background-size: 12px 12px;
                        }
                    }
                    img {
                        max-width: 100%;
                    }
                }
            }
            .bb-comment {
                padding: 4px 0;
                .bb-comment-list {
                    margin-top: 10px;
                    background: #fafbfc;
                }
                .comment-item {
                    border-bottom: 1px solid #e5e9ed;
                    padding: 10px;
                    &:hover .can-delete-comment,
                    &:hover .reply-comment {
                        display: block;
                    }
                    &:hover {
                        background: #f2f4f7;
                    }
                    .comment-right {
                        .comment-content {
                            margin-bottom: 10px;
                            max-width: 555px;
                        }
                    }
                    .reply-comment {
                        display: none;
                    }
                }
                .reply-comment,
                .show-all-reply {
                    color: #5097e8;
                }
                .show-all-reply {
                    text-align: center;
                    padding-top: 10px;
                    .ivu-icon-ios-arrow-dropdown-circle {
                        font-size: 20px;
                        position: relative;
                        top: -2px;
                    }
                }
            }
            .bubble-info {
                color: #76808ef7;
                font-size: 12px;
                div {
                    margin-right: 20px;
                }
                span {
                    position: relative;
                    top: 1px;
                }
                .ivu-icon {
                    font-size: 16px;
                }
                &:hover > .can-delete-bubble {
                    display: block;
                }
            }

        }
        .user-bubble {
            flex: 1;
        }
        .u-bb-footer {
            line-height: 40px;
            margin-top: 10px;
            position: relative;
            .ivu-checkbox-wrapper {
                position: absolute;
                right: 100px;
            }
            .u-button {
                position: absolute;
                right: 0;
            }
        }
    }
    .umtime-right {
        margin-left: 60px;
        width: 450px;
        .down-app {
            height: 42px;
            line-height: 42px;
            margin-bottom: 20px;
            border-radius: 2px;
            border: 1px solid #d8dde4;
            text-align: center;

        }
        .swipper-pos {
            img {
                width: 100%;
            }
        }
        .get-fish-area {
            height: 200px;
            font-size: 18px;
            line-height: 200px;
            margin-top: 20px;
        }
    }
}
</style>
