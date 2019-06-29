// const UmtimeIndex = () => import(/* webpackChunkName: "umtime" */ '@/views/relax/index.vue');
import AboutUs from '@/views/relax/index.vue';
export default {
    name: 'aboutus',
    contents: [
        {
            path: '/umtime/aboutus',
            name: 'aboutus',
            component: AboutUs,
            meta: {
                title: '关于我们'
            },
        },
    ]

};
