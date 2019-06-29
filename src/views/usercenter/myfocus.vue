<template>
    <div class="dash-frame">
        我的关注
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
.dash-frame {
    .upload-file {
        width: 30vw;
        margin: 30px auto;

    }
}
</style>
