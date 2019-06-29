import Api from '@/api/user';

export default {
    state: {
        islogin: false,
        userinfo: {

        },
    },

    mutations: {
        setUserInfo(state, data) {
            state.userinfo = data;
        },
        updateLoginStatus(state, data) {
            state.islogin = data;
        },
    },

    actions: {
        getUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                Api.GetUserInfo().then((res) => {
                    commit('setUserInfo', res);
                    commit('updateLoginStatus', true);
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        },

        handleLogOut({ state }) {
            return new Promise((resolve, reject) => {
                Api.Logout().then((res) => {
                    state.userInfo = '';
                    state.islogin = false;
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        }
    }
};
