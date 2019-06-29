<template>
    <div id="app" class="umtime-main-content">
        <router-view class="animated bubble-main-content"></router-view>
    </div>
</template>

<script>
import Api from '@/api/common.js';
export default {
    name: 'app',
    provide() {
        return {
            app: this
        };
    },
    data() {
        return {
            labels: [],
            options: {
            },
        };
    },
    mounted() {

    }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.umtime-main-content{
        min-width: 1170px;
        height: 100%;
}
</style>
