import Vue from 'vue';
import axios from 'axios';
import {Message} from 'iview';
Vue.prototype.$Message = Message;

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.transformRequest = [function (data) {
    return typeof data === 'object' ? JSON.stringify(data) : data;
}];

const CODE_MAP = {
    UNLOGIN: 600,
    SUCCESS: 200
};

export function post(url, data, config) {
    return axios.post(url, data, config).then(dealApi, serverError);
}

export function get(url, data) {
    return axios.get(url, {params: data}).then(dealApi, serverError);
}

function dealApi(res) {
    let data = res.data;
    if (data.status === CODE_MAP.SUCCESS) {
        return data.data;
    } else if (data.status === CODE_MAP.UNLOGIN) {
        //未登录状态处理
    }
    // Message.error(data.msg);
    throw new Error(data.msg);
}

function serverError(res) {
    let msg = res.message;
    Message.error('服务器异常，状态码：'+msg);
    throw new Error('服务器异常，状态码：'+msg);
}


export default {
    axios,
    post,
    get,
};
