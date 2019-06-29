// const UmtimeIndex = () => import(/* webpackChunkName: "umtime" */ '@/views/relax/index.vue');
const Login = () => import('@/views/login/index.vue');
const Register = () => import('@/views/login/register.vue');

export default {
    name: 'um时刻',
    contents: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
    ]

}
