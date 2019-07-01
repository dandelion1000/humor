<template>
    <div class="um-container-editor white-bg">
        <div class="tribute-container" v-if="isPop">
            <ul>
                <li data-index="0" class=""  @click="insertTp" v-for="elem in labels" :key="elem.id">
                    {{elem.title}}
                </li>
            </ul>
        </div>
        <div class="pp-editor">
            <div id="um-editor"
                 class="editor-content"
                 contenteditable="true"
                 placeholder="#悠一下# 今天摸鱼了吗"
                 @keyup="dealMentionPop"
                 @input="editorInput"
                 @click="getFocus"
                 @keydown="editorKeyDown">
            </div>
            <!-- <vue-tribute :options="options">
                <div id="um-editor"
                     class="editor-content"
                     contenteditable="true"
                     placeholder="#悠一下# 今天摸鱼了吗"
                     @input="editorInput"
                     @click="getFocus"
                     @keydown="editorKeyDown"
                ></div>
            </vue-tribute> -->
            <div class="editor-icon">
                <!-- <Icon type="ios-code" @click="codeEdit" /> -->
                <Icon type="ios-image" :class="{ 'opcity-half': preventImg }" @click="uploadImage" />
                <input id="upload-file" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileChange($event)">
            </div>
        </div>
        <div class="u-tags pull-left">
            <template v-for="item in labels.slice(0,4)">
                <a class="labels" @click="clickLabel">#{{ item.title }}#</a>
            </template>
        </div>
    </div>
</template>
<script>
// import Tribute from "tributejs";
import VueTribute from 'vue-tribute';
import posxy from './getFocusPos';
import Api from '@/api/common.js';
import $ from './util/dom-core.js';
import handlePaste from './util/dealPaste.js';
export default {
    inject: ['app'],
    components: {
        VueTribute
    },
    props: {
        html: String,
    },
    data() {
        return {
            isPop: false,
            editorHtml: '',
            labels: JSON.parse(localStorage.getItem('labels')),
            // labels: ['悠一下', '开心一刻', '摸鱼咯', '打卡', '神代码片段'],
            viewEye: true,
            disnone: false,
            lastEditRange: null,
            currentSelection: null,
            preventImg: false,
            topicList: [],
            poxobj: {},
            tribute: null,
            options: JSON.parse(localStorage.getItem('ppoptions'))

        };
    },
    mounted() {
        let $textElem = document.querySelector('#um-editor'), $self = this;
        handlePaste($textElem, this);
        // this.dealMention();
        // $textElem.addEventListener('tribute-replaced', function (e) {
        //      const editor = document.querySelector('#um-editor');
        //      editor.click();
        // });
    },
    methods: {
        /*
        1.过滤div标签即可,现在问题就在于处理文本区域的内容了，现在每次回车就会产生div标签，首先我需要过滤div标签
        其次需要将</div>的位置换成br，换行符号提交,而后端那边则需要将我这个转成一段包裹p标签的html
        2.md 语法缩减，仅支持代码code和图片语法
        3.现在还有问题，就是图片可在任意位置插入,表情包也是，这个问题怎么解决呢
        */
        // initTribute() {
        //     this.tribute = new Tribute({
        //         trigger: '#',
        //         allowSpaces: false,
        //         values: this.topicList,
        //         selectTemplate: function (item) {
        //           return `#${item.original.value}#`;
        //         },
        //     })
        //     let umeditor = document.getElementById('um-editor');
        //     this.tribute.attach(umeditor);
        //
        // },
        // dealMention() {
        //     Api.getTopics().then((res) => {
        //         let list = res.list.map((item) => {
        //             return {
        //                 key: item.title,
        //                 value: `${item.title}#`
        //             }
        //         });
        //         var tribute = new Tribute({
        //             trigger: '#',
        //             values: list,
        //             allowSpaces: false,
        //             spaceSelectsMatch: false,
        //             searchOpts: {
        //               pre: '<span>',
        //               post: '</span>'
        //             }
        //         });
        //         tribute.attach(document.getElementById('um-editor'));
        //     })
        //
        // },
        backCode() {
            this.viewEye = true;
        },
        codeEdit() {
            const editor = document.querySelector('#um-editor');
            this.setLastRange();
            document.execCommand('insertHTML', false, '<pre class="precode"><code><br></code></pre><div><br></div>');

        },
        editorKeyDown($event) {
            let elemName = this.lastEditRange.startContainer.parentNode.nodeName;
            // console.log('elemName', elemName);
            if ($event.keyCode !== 13) {
                this.preventImg = false;
                return;
            } else {
                if ((elemName == 'CODE') || (elemName == 'PRE')) {
                    $event.preventDefault();
                    this.preventImg = true;
                    document.execCommand('insertHTML', false, '\n');
                }
            }

            //处理代码片段回车问题
        },
        uploadImage() {
            if (this.preventImg) {
                return;
            }
            document.getElementById('upload-file').click();
        },

        /*
        光标位置插入选定标签文本
        */
        clickLabel($event, type) {
            let val = $event.target.innerText;
            let text = (type == 1) ? (`${val}# `) : ` ${val} `;
            this.setLastRange();
            document.execCommand('insertText', false, text);
        },

        /*
        光标位置插入图片，如果不保存呢历史光标位置，则会插入到富文本最前面
        */
        fileChange(e) {
            const files = e.target.files;
            if (!files || !files[0]) {
                return;
            }
            Api.uploadFile(files[0]).then((res) => {
                this.setLastRange();
                let img_str = `<br/> <img src="${res.url}"><br/>`;
                document.execCommand('insertHTML', false, img_str);
                // document.execCommand('insertImage', false, res.url )
            });
        },
        getFocus() {
            //保存每次光标变动时候的位置，只需要记录文本的click事件
            const sels = window.getSelection();
            // 设置最后光标对象
            const range = sels.getRangeAt(0);
            let elemName = range.startContainer.parentNode.nodeName;
            if (elemName == 'CODE' || elemName == 'PRE') {
                this.preventImg = true;
            } else {
                this.preventImg = false;
            }
            this.lastEditRange = range;

        },
        editorInput($event) {
            //编辑文本input事件的时候获取光标的位置
            const sels = window.getSelection();
            const range = sels.getRangeAt(0);
            if (range.startOffset > 0) {
                this.lastEditRange = range;
            }
            let elemName = range.startContainer.parentNode.nodeName;
            if (elemName == 'CODE' || elemName == 'PRE') {
                this.preventImg = true;
            } else {
                this.preventImg = false;
            }
            this.poxobj = posxy.kingwolfofsky.getSelectionCoords();
        },
        dealMentionPop($event) {
            if ($event.keyCode == 32) {
                this.isPop = false;
            }
            if ($event.key === '#') {
                this.isPop = true;
                setTimeout(() => {
                    document.querySelector('.tribute-container').style.cssText = `top: ${this.poxobj.y+18}px;left: ${this.poxobj.x}px`;
                });
            }
        },
        insertTp($event) {
            this.clickLabel($event, 1);
            this.closePop();
        },
        closePop() {
            this.isPop = false;
        },
        setLastRange() {
            const editor = document.querySelector('#um-editor');
            editor.focus();
            const sels = window.getSelection();
            // 判断是否有最后光标对象存在
            if (this.lastEditRange) {
                // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
                sels.removeAllRanges();
                sels.addRange(this.lastEditRange);
            }
        },

        /*添加代码段``` ```时光标位置*/
        resetRange(startContainer, startOffset, endContainer, endOffset) {
            let selection = window.getSelection();
            selection.removeAllRanges();
            let range = document.createRange();
            range.setStart(startContainer, startOffset);
            range.setEnd(endContainer, endOffset);
            selection.addRange(range);
        },


    }
};
</script>
<style lang="less">
.um-container-editor {
    .u-tags {
        margin-top: 20px;
        text-align: left;
        a {
            color: #76808e;
            margin-right: 10px;
            &:hover {
                color: #323a45;
            }
        }

    }
    .pp-editor {
        position: relative;
        min-height: 120px;
        border: 1px solid #eee;
        border-radius: 5px;
        text-align: left;
        .editor-content {
            padding: 10px 10px 30px;
            min-height: 90px;
            word-break: break-all;
            word-wrap: break-word;
            .hixl {
                padding: 5px;
                background: #efefef;
                border-radius: 5px;
            }
            img {
                // width: 100%;
                max-width: 100%;
                // max-height: 200px;
            }
        }
        .editor-icon {
            height: 30px;
            line-height: 30px;
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 20px;
            .ivu-icon {
                margin-right: 6px;
            }
            .ivu-icon-ios-code:hover,
            .ivu-icon-ios-eye-off,
            .ivu-icon-ios-eye:hover,
            .ivu-icon-ios-happy-outline:hover,
            .ivu-icon-ios-image:hover,
            .opcity-half {
                cursor: pointer;
                opacity: 0.5;
            }
        }
    }

}

// Tribute-specific styles
.tribute-container {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    max-height: 300px;
    max-width: 500px;
    overflow: auto;
    display: block;
    z-index: 999999;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(#000, 0.13);
}
.tribute-container ul {
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    background: #fff;
    border-radius: 4px;
    border: 1px solid rgba(#000, 0.13);
    background-clip: padding-box;
    overflow: hidden;
}
.tribute-container li {
    color: #3f5efb;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
}
.tribute-container li.highlight,
.tribute-container li:hover {
    background: #3f5efb;
    color: #fff;
}
.tribute-container li span {
    font-weight: bold;
}
.tribute-container li.no-match {
    cursor: default;
}
.tribute-container .menu-highlighted {
    font-weight: bold;
}
</style>
