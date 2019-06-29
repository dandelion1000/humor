import {
    post
} from './axios';

export default {
    sendCode(phone) {
        return post('/api/universal/sendcheckcode', {
            phone
        });
    },

    bindPhone(params) {
        return post('/api/account/bindphone', params);
    },
};
