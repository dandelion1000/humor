<template>
    <div class=" white-bg">
        <div class="pp--bb-editor">
            <div
                :id="'um-bb-editor'+pindex"
                class="editor-content um-bb-editor"
                tabindex="0"
                contenteditable="true"
                v-html="editorHtml"
                placeholder="在此输入您的评论内容"
                @input="editorInput"
                @click="getFocus"
                @paste="onPaste"
            >
            </div>
            <div class="bb-handle-icon">
                <Icon type="ios-happy-outline pointer" @click="showEmotj" />
                <!-- <Icon type="md-send" /> -->
                <!-- <Icon type="ios-cafe" /> -->
                <!-- <Icon type="ios-send pointer" /> -->
                <Icon type="md-send pointer"  @click="onRelease" />
            </div>
            <div class="emoticon" v-if="showEmo">
                <div class="emotj-item" v-for="(elem, index) in emotjlist" :key="index" >
                    <b class="pointer" @click="clickEmotion(index)">{{elem.char}}</b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import UmButton from '@/components/Button/button.vue';
import posxy from './getFocusPos';
import Api from '@/api/common.js';
import { getPasteText, getPasteHtml } from './util/paste-handle.js';
import emotjson from './emoji/emojis.js';
export default {
    components: {

    },
    props: {
        pindex: Number,
    },
    data() {
        return {
            editorHtml: '',
            showEmo: false,
            lastEditRange: null,
            emotjlist: {}
        };
    },
    mounted() {
        console.log('emojilist', emotjson);
        this.emotjlist = emotjson;
        let $textElem2 = document.querySelectorAll('.um-bb-editor'), $self = this;
        document.addEventListener('click', function ($event) {
            event = $event || window.event;
            $self.showEmo = false;
            event.stopPropagation();
            //   event.preventDefault();
        });

    },
    methods: {
        onPaste($event) {
            $event.preventDefault();
            let editor = $event.target;
            editor.focus();
            let pasteHtml = getPasteHtml($event, false, true);
            let pasteText = getPasteText($event);
            pasteText = pasteText.replace(/\n/gm, '<br>');
            document.execCommand('insertHTML', false,  `${pasteText}`);
        },
        onRelease() {
            this.$emit('on-click');
        },
        dealMention(name, index) {
            if (this.lastEditRange) {
                this.setLastRange();
            } else {
                let elem = document.querySelector(`#um-bb-editor${index}`);
                elem.focus();
            }
            document.execCommand('insertHTML', false,  `@${name}`);
        },
        showEmotj($event) {
            let event = $event || window.event;
            this.showEmo = true;
            event.stopPropagation();
        },
        clickEmotion(elem) {
            this.setLastRange();
            document.execCommand('insertText', false, `:${elem}:`);
        },
        getFocus() {
            //保存每次光标变动时候的位置，只需要记录文本的click事件
            const sels = window.getSelection();
            // 设置最后光标对象
            const range = sels.getRangeAt(0);
            this.lastEditRange = range;

        },
        editorInput($event) {
            //编辑文本input事件的时候获取光标的位置
            const sels = window.getSelection();
            const range = sels.getRangeAt(0);
            if (range.startOffset > 0) {
                this.lastEditRange = range;
            }
        },
        setLastRange() {
            const editor = document.querySelector(`#um-bb-editor${this.pindex}`);
            editor.focus();
            const sels = window.getSelection();
            // 判断是否有最后光标对象存在
            if (this.lastEditRange) {
                // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
                sels.removeAllRanges();
                sels.addRange(this.lastEditRange);
            }
        },

    }
};
</script>
<style lang="less">
.pp--bb-editor {
    padding:0 64px 0 10px;
    position: relative;
    border: 1px solid #eee;
    margin: 6px 10px 10px;  
    .bb-handle-icon {
        position: absolute;
        bottom: 5px;
        right: 0;
        .ivu-icon {
            font-size: 20px;
            margin-right: 8px;
        }
    }
    .emoticon {
        z-index: 100;
        width: 300px;
        position: absolute;
        top: 34px;
        right: -1px;
        border: 1px solid #eee;
        background: #fff;
        /* border-radius: 4px; */
        text-align: left;
        padding: 10px;
        .emotj-item {
            font-size: 18px;
            display: inline-block;
        }
    }
    .editor-content {
        // border:1px solid #eee;
        padding: 5px 0;
    }
}
</style>
