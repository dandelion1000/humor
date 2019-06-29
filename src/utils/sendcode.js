let throttle = function (fn, delay, immediate, debounce) {
    let curr = +new Date(), //当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //时间差
        context, //上下文
        args,
        exec = function () {
            last_exec = curr;
            fn.apply(context, args);
        };
    return function () {
        curr= +new Date();
        context = this,
        args = arguments,
        diff = curr - (debounce ? last_call : last_exec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        last_call = curr;
    };
};

let debounce = function (fn, delay, immediate) {
    return throttle(fn, delay, immediate, true);
};
export default {
    debounce: debounce,
    /**
     * 根据QueryString参数名称获取值
     */
    getQueryStringByName(name)  {
        const result = location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'));
        if (result == null || result.length < 1) {
            return '';
        }
        return result[1];
    },
    //设置url上查询参数
    toQueryString(obj) {
        let ret = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] != null) {
                ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return ret.join('&');
    },

    /**
     * 倒计时方法
     * @param seconds
     * @param option {Object}
     * @param option.onProgress {Function}
     * @param option.onEnd {Function} 倒计时结束回调
     * @param option.interval {Number}倒时计刷新频率, 单位ms, default: 1000
     * @returns {destroy} 销毁倒计时
     */
    countdown(seconds, option) {
        let sTime = +new Date();

        let timer = setInterval(function () {
            let s = seconds - Math.round((+new Date() - sTime) / 1e3);
            if (s < 0) {
                s = 0;
                option.onEnd && option.onEnd(s);
                clearInterval(timer);
            } else {
                option.onProgress && option.onProgress(s);
            }
        }, option.interval || 1000);

        return function destroy() {
            clearInterval(timer);
        };
    },
};
