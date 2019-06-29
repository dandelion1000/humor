import {
    post
} from './axios';

export default {
    getTopics(num, size) {
        return post('/api/topic/list', {
            num,
            size
        });
    },

    getBubbleList(parmas) {
        return post('/api/bubble/list', parmas);
    },

    createBubble(parmas) {
        return post('/api/bubble/insert', parmas);
    },

    deleteBubble(parmas) {
        return post('/api/bubble/del', parmas);
    },

    insertComment(parmas) {
        return post('/api/comment/insert', parmas);
    },

    getCommentList(parmas) {
        return post('/api/comment/list', parmas);
    },

    touchLike(parmas) {
        return post('/api/rela/like', parmas);
    },

    deleteComment(parmas) {
        return post('/api/comment/del', parmas);
    }
};
