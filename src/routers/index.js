import Vue from 'vue';
import Router from 'vue-router';
import menuModule from './router';
import store from '@/store';
Vue.use(Router);
const Home = () => import('@/views/home.vue');
import UmtimeIndex from '@/views/relax/index.vue';
import Api from '@/api/common.js';
const router = new Router({
    base: process.env.BASE_URL,
    routes: [
        // {
        //   path: '/umtime/index',
        //   name: 'umtime',
        //   component: UmtimeIndex,
        //   meta: {
        //     title: 'um时刻'
        //   }
        // },
        {
            path: '/',
            name: 'umtime',
            component: UmtimeIndex,
            meta: {
                title: 'U 时光'
            },
            beforeRouteEnter(to, from, next) {
                console.log('to, from, next')
            }
        },
        {
            path: '*',
            name: 'error_404',
            component: () =>
                import('@/views/error/404.vue')
        },
        {
            path: '/unauthorized',
            name: 'error_401',
            component: () =>
                import ('@/views/error/401.vue')
        },
        {
            path: '/testdrag',
            name: 'testdrag',
            component: () =>
                import ('@/components/dragdiv.vue')
        },
        ...generateRoutesFromMenu(menuModule.state.contents)
    ]
});

function generateRoutesFromMenu(menu = [], routes = []) {
    for (let i = 0, l = menu.length; i<l; i++) {
        let item = menu[i];
        if (item.path) {
            routes.push(item);
        }
        if (!item.component) {
            generateRoutesFromMenu(item.contents, routes);
        }
    }
    return routes;
}
const LOGIN_PAGE_NAME = 'login';
const DEFAULT_PAGE_NAME = ['login', 'register']; //若已登录成功状态不可查看，未登录状态可以访问
router.beforeEach((to, from, next) => {
    if (to.name == 'umtime') {
        Api.getTopics().then((res) => {
        let list = res.list.map((item) => {
                return {
                    key: item.title,
                    value: `${item.title}#`
                }
            });
             let options = {
                 trigger: "#",
                 values: list,
                 selectTemplate: function (item) {
                   if (this.range.isContentEditable(this.current.element)) {
                     return '<a href="http://zurb.com" title="' + item.original.email + '">@' + item.original.value + '</a>';
                   }

                   return '#' + item.original.value;
                 },
                // collection: [
                    // {
                    //     trigger: "@",
                    //     values: [
                    //       { key: "Collin Henderson", value: "syropian" },
                    //       { key: "Sarah Drasner", value: "sarah_edo" },
                    //       { key: "Evan You", value: "youyuxi" },
                    //       { key: "Adam Wathan", value: "adamwathan" }
                    //     ]
                    // }, {
                    //     trigger: "#",
                    //     values: list,
                    //     selectTemplate: function (item) {
                    //       if (this.range.isContentEditable(this.current.element)) {
                    //         return '<a href="http://zurb.com" title="' + item.original.email + '">@' + item.original.value + '</a>';
                    //       }
                    //
                    //       return '#' + item.original.value;
                    //     },
                    // }
                // ]
            }
            localStorage.setItem('ppoptions', JSON.stringify(options))
            localStorage.setItem('labels', JSON.stringify(res.list))
        });

    }
    store.dispatch('getUserInfo').then(() => {
        // if (to.name === LOGIN_PAGE_NAME) {
        //     next({
        //         name: 'umtime'
        //     });
        // } else {
        //     next();
        // }
        next();
    }).then(() => {
        console.log('链式');
    }).catch((err) => {
        // console.log('err',err)
        // if (DEFAULT_PAGE_NAME.includes(to.name)) {
        //     next();
        // }else{
        //     next({
        //         name: LOGIN_PAGE_NAME
        //     });
        // }
        next();
    });
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    // next();
});

export default router;
