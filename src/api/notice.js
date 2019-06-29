import {
    post
} from './axios';

export default {
    getNoticeList(parmas) {
        return post('/api/notice/list', parmas);
    },

    setAllRead() {
        return post('/api/notice/allread');
    },

    setSingleRead(id) {
        return post('/api/notice/read', {
            id
        });
    },
    getNoticeCount(type, read) {
        return post('/api/notice/count', {
            type,
            read
        });
    }

};
