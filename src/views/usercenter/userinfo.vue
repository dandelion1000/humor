<template>
    <div class="personal-center">
        <um-header></um-header>
        <div class="layout">
            <Layout>
                <Sider class="umsider" hide-trigger :style="{background: '#fff'}">
                    <Menu :active-name="curActive" theme="light" width="auto" :open-names="['1']">
                        <template v-for="elem in menuLists" >
                            <MenuItem
                                :key="elem.id"
                                :name="elem.id"
                                @click.native="menuExchange(elem)">
                                {{elem.name}}
                            </MenuItem>
                        </template>
                    </Menu>
                </Sider>
                <Layout class="center-container" :style="{padding: '0 24px 24px'}">
                    <router-view class="animated"></router-view>
                </Layout>
            </Layout>
        </div>
    </div>
</template>

<script>
import UmHeader from '@/views/layout/header.vue';
export default {
    components: {
        'um-header': UmHeader,
    },
    data() {
        return {
            curActive: '1-1',
            menuLists: [
                {
                    id: '1-1',
                    name: '个人基本信息设置',
                    path: 'infoSeting'
                },
                {
                    id: '1-2',
                    name: '我的摸鱼时光轴,鱼苗',
                    path: 'myfish'
                },
                {
                    id: '1-3',
                    name: '通知中心',
                    path: 'allnotice'
                },
                {
                    id: '1-4',
                    name: '我的关注',
                    path: 'myfocus'
                }
            ],
            curActiveMenu: 1
        };
    },
    mounted() {
        let pos = this.menuLists.findIndex((value, index) => {
            return value.path == this.$route.name;
        });
        this.curActive = this.menuLists[pos].id;
    },
    methods: {
        menuExchange(elem) {
            this.curActive = elem.id;
            this.$router.push({name: elem.path});
        }
    }
};
</script>
<style scoped>
.personal-center {
    height: 100%;
    background: #f5f7fa;
}
.layout{
    max-width: 1200px;
    margin: 0 auto;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    top: 70px;
    height: calc(100vh - 70px);
}
.ivu-layout.ivu-layout-has-sider {
    height: 100%;
}
.umsider.ivu-layout-sider{
    padding-top: 20px;
}
.center-container.ivu-layout{
    padding: 30px !important;
    background: #fff;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
