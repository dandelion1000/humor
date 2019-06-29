
import { get, post } from './axios';

export default {
    Login(name, password) {
        return post('/api/login', {
            name,
            password
        });
    },
    GetUserInfo() {
        return get('/api/account/info');
    },
    Register(name, password) {
        return post('/api/register', {
            name,
            password
        });
    },
    Logout() {
        return post('/api/logout');
    },
    allAavtor() {
        return post('/api/common/avatar');
    },

};
