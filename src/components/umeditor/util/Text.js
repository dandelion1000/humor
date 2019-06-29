// 粘贴事件（粘贴文字 粘贴图片）
import $ from './dom-core.js';
import { getPasteText, getPasteHtml, getPasteImgs } from './paste-handle.js';
import { UA, isFunction, replaceHtmlSymbol } from './util.js';
// 构造函数
function Text(editor) {
    this.editor = editor;
}

// 修改原型
Text.prototype = {
    constructor: Text,
    // 初始化
    init: function () {
        // 绑定事件
        this._pasteHandle();
    },
    _pasteHandle: function () {
        const editor = this.editor;
        const config = editor.config;
        const pasteFilterStyle = config.pasteFilterStyle;
        const pasteTextHandle = config.pasteTextHandle;
        const ignoreImg = config.pasteIgnoreImg;
        const $textElem = editor.$textElem;

        // 粘贴图片、文本的事件，每次只能执行一个
        // 判断该次粘贴事件是否可以执行
        let pasteTime = 0;
        function canDo() {
            let now = Date.now();
            let flag = false;
            if (now - pasteTime >= 100) {
                // 间隔大于 100 ms ，可以执行
                flag = true;
            }
            pasteTime = now;
            return flag;
        }
        function resetTime() {
            pasteTime = 0;
        }

        // 粘贴文字
        $textElem.on('paste', e => {
            if (UA.isIE()) {
                return;
            } else {
                // 阻止默认行为，使用 execCommand 的粘贴命令
                e.preventDefault();
            }

            // 粘贴图片和文本，只能同时使用一个
            if (!canDo()) {
                return;
            }

            // 获取粘贴的文字
            let pasteHtml = getPasteHtml(e, pasteFilterStyle, ignoreImg);
            let pasteText = getPasteText(e);
            pasteText = pasteText.replace(/\n/gm, '<br>');

            const $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            const nodeName = $selectionElem.getNodeName();

            // code 中只能粘贴纯文本
            if (nodeName === 'CODE' || nodeName === 'PRE') {
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteText = '' + (pasteTextHandle(pasteText) || '');
                }
                editor.cmd.do('insertHTML', `<p>${pasteText}</p>`);
                return;
            }

            // 先放开注释，有问题再追查 ————
            // // 表格中忽略，可能会出现异常问题
            // if (nodeName === 'TD' || nodeName === 'TH') {
            //     return
            // }

            if (!pasteHtml) {
                // 没有内容，可继续执行下面的图片粘贴
                resetTime();
                return;
            }
            try {
                // firefox 中，获取的 pasteHtml 可能是没有 <ul> 包裹的 <li>
                // 因此执行 insertHTML 会报错
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteHtml = '' + (pasteTextHandle(pasteHtml) || '');
                }
                editor.cmd.do('insertHTML', pasteHtml);
            } catch (ex) {
                // 此时使用 pasteText 来兼容一下
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteText = '' + (pasteTextHandle(pasteText) || '');
                }
                editor.cmd.do('insertHTML', `<p>${pasteText}</p>`);
            }
        });

        // 粘贴图片
        $textElem.on('paste', e => {
            if (UA.isIE()) {
                return;
            } else {
                e.preventDefault();
            }

            // 粘贴图片和文本，只能同时使用一个
            if (!canDo()) {
                return;
            }

            // 获取粘贴的图片
            const pasteFiles = getPasteImgs(e);
            if (!pasteFiles || !pasteFiles.length) {
                return;
            }

            // 获取当前的元素
            const $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            const nodeName = $selectionElem.getNodeName();

            // code 中粘贴忽略
            if (nodeName === 'CODE' || nodeName === 'PRE') {
                return;
            }

            // 上传图片
            const uploadImg = editor.uploadImg;
            uploadImg.uploadImg(pasteFiles);
        });

    }

};
export default {

};
