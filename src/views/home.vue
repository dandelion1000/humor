<template>
    <div class="dash-frame">
        <h2>个人基本信息设置</h2>
        <div class="upload-file">
            <Upload :before-upload="handleUpload" action="//jsonplaceholder.typicode.com/posts/">
                <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
        </div>
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
