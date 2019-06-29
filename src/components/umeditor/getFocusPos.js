/*js how to get rich-text  px position*/
let kingwolfofsky = {
    /**
     * 获取输入光标在页面中的坐标
     * @param        {HTMLElement}    输入框元素
     * @return        {Object}        返回left和top,bottom
     */
    //https://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
    //https://bugs.webkit.org/show_bug.cgi?id=65324
    getSelectionCoords: function (win) {
        win = win || window;
        let doc = win.document;
        let sel = doc.selection, range, rects, rect;
        let x = 0, y = 0;
        if (sel) {
            console.log(sel.type);
            if (sel.type != 'Control') {
                range = sel.createRange();
                range.collapse(true);
                console.log('range', range);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                console.log('win.getselection', range);
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    console.log('range.getClientRects', rects);
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    // 光标在行首时，rect为undefined
                    if (rect) {
                        x = rect.left;
                        y = rect.top;
                    }
                }
                // Fall back to inserting a temporary element
                if ((x == 0 && y == 0) || rect === undefined) {
                    let span = doc.createElement('span');
                    console.log(span);
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild(doc.createTextNode('\u200b'));
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        console.log('rect', rect);
                        x = rect.left;
                        y = rect.top;
                        let spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    },

    getInputPositon: function (elem) {
        if (document.selection) { //IE Support
            elem.focus();
            let Sel = document.selection.createRange();
            return {
                left: Sel.boundingLeft,
                top: Sel.boundingTop,
                bottom: Sel.boundingTop + Sel.boundingHeight
            };
        } else {
            let that = this;
            let cloneDiv = '{$clone_div}',
                cloneLeft = '{$cloneLeft}',
                cloneFocus = '{$cloneFocus}',
                cloneRight = '{$cloneRight}';
            let none = '<span style="white-space:pre-wrap;"> </span>';
            let div = elem[cloneDiv] || document.createElement('div'),
                focus = elem[cloneFocus] || document.createElement('span');
            let text = elem[cloneLeft] || document.createElement('span');
            let offset = that._offset(elem),
                index = this._getFocus(elem),
                focusOffset = {
                    left: 0,
                    top: 0
                };

            if (!elem[cloneDiv]) {
                elem[cloneDiv] = div, elem[cloneFocus] = focus;
                elem[cloneLeft] = text;
                div.appendChild(text);
                div.appendChild(focus);
                document.body.appendChild(div);
                focus.innerHTML = '|';
                focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                div.className = this._cloneStyle(elem);
                div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
            }
            div.style.left = this._offset(elem).left + 'px';
            div.style.top = this._offset(elem).top + 'px';
            let strTmp = elem.innerHTML.replace(/\<div\>|\<\/div\>(?=[^\<div\>]+)/g, '<br/>');
            text.innerHTML = strTmp;
            focus.style.display = 'inline-block';
            try {
                focusOffset = this._offset(focus);
            } catch (e) {}
            focus.style.display = 'none';
            let obj = {
                left: focusOffset.left,
                top: focusOffset.top,
                bottom: focusOffset.bottom
            };
            // console.log('=======', obj)
            return obj;
        }
    },

    // 克隆元素样式并返回类
    _cloneStyle: function (elem, cache) {
        if (!cache && elem['${cloneName}']) {return elem['${cloneName}'];}
        let className, name, rstyle = /^(number|string)$/;
        let rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth
        let cssText = [],
            sStyle = elem.style;

        for (name in sStyle) {
            if (!rname.test(name)) {
                let val = this._getStyle(elem, name);
                if (val !== '' && rstyle.test(typeof val)) { // Firefox 4
                    name = name.replace(/([A-Z])/g, '-$1').toLowerCase();
                    cssText.push(name);
                    cssText.push(':');
                    cssText.push(val);
                    cssText.push(';');
                }
            }
        }
        cssText = cssText.join('');
        elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
        this._addHeadStyle('.' + className + '{' + cssText + '}');
        return className;
    },

    // 向页头插入样式
    _addHeadStyle: function (content) {
        let style = this._style[document];
        if (!style) {
            style = this._style[document] = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
    },
    _style: {},

    // 获取最终样式
    _getStyle: 'getComputedStyle' in window ? function (elem, name) {
        return getComputedStyle(elem, null)[name];
    } : function (elem, name) {
        return elem.currentStyle[name];
    },

    // 获取光标在文本框的位置
    _getFocus: function (elem) {
        elem.focus();
        let index = window.getSelection().getRangeAt(0).startOffset;
        return (index);
    },

    // 获取元素在页面中位置
    _offset: function (elem) {
        let box = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement;
        let clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop,
            left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
        return {
            left: left,
            top: top,
            right: left + box.width,
            bottom: top + box.height
        };
    }
};


export default {
    kingwolfofsky
};
