import UserInfo from '@/views/usercenter/userinfo.vue';
import MyBubble from '@/views/usercenter/mybubble.vue';
import InfoSeting from '@/views/usercenter/infoSeting.vue';
import Myfish from '@/views/usercenter/myfish.vue';
import AllNotice from '@/views/usercenter/allnotice.vue';
import MyFocus from '@/views/usercenter/myfocus.vue';
export default {
    contents: [{
        path: '/personal',
        name: 'userinfo',
        name: '个人中心',
        component: UserInfo,
        children: [{
            name: 'mybubble',
            path: 'mybubble',
            component: MyBubble
        },
        {
            name: 'infoSeting',
            path: 'infoSeting',
            component: InfoSeting
        },
        {
            name: 'myfish',
            path: 'myfish',
            component: Myfish
        },
        {
            name: 'allnotice',
            path: 'allnotice',
            component: AllNotice
        },
        {
            name: 'myfocus',
            path: 'myfocus',
            component: MyFocus
        }
        ]
    }, ]

};
