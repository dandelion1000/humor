<template>
    <div class="my-bubble">
        我的冒泡记录
    </div>
</template>
<script>
export default {
    data() {
        return {
            theme2: 'light'
        };
    },
    methods: {
        handleUpload(file) {
            console.log(file);
        }

    }
};
</script>
<style lang="less">

</style>
