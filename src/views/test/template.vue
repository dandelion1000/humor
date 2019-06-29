<template>
    <div id="">
        <van-icon name="photo-o" @click="startMedia" />
        <video id="video" width="304" height="240" autoplay="autoplay"></video>
        <canvas  id="canvas" width="304" height="240"></canvas>
    <!-- <input type="file" id='image' accept="image/*" capture='camera'> -->
    <!-- <input type="file" id='video' accept="video/*" capture='camcorder'> -->

    </div>
</template>
<script>
import {
    Icon
} from 'vant';
import adapterjs from 'adapterjs';
export default {
    components: {
        [Icon.name]: Icon,
    },
    data: () => ({

    }),
    mounted() {
        //do something after mounting vue instance
        const videoNode = document.getElementById('video');
        let videoStream = null;
        adapterjs.webRTCReady(function (isUsingPlugin) {
            // WebRTC API 已准备就绪
            //isUsingPlugin: 使用WebRTC插件时为true，否则为false
            getUserMedia({
                audio: false,
                video: true,
            }, (stream) => {
                videoNode.srcObject = stream;
                videoNode.play();
                videoStream = stream;
            }, (error) => {
                console.error('navigator.getUserMedia error: ', error);
            });
        });
    },
    methods: {
        startMedia() {
            const constraints = {
                audio: false, // 是否打开语音
                video: true, // 是否打开视频
            };
            let userMedia = null; // media 对象
            if (navigator.mediaDevices.getUserMedia) {
                // 最新标准 API
                userMedia = navigator.mediaDevices.getUserMedia(constraints);
            } else if (navigator.webkitGetUserMedia) {
                // webkit 内核浏览器
                userMedia = navigator.webkitGetUserMedia(constraints);
            } else if (navigator.mozGetUserMedia) {
                // Firefox 浏览器
                userMedia = navigator.mozGetUserMedia(constraints);
            } else if (navigator.getUserMedia) {
                // 旧版 API
                userMedia = navigator.getUserMedia(constraints);
            }
            // 此时 userMedia 是一个 promise 对象
            userMedia.then((stream) => {
                // 成功后返回的业务逻辑
                videoNode.srcObject = stream;
                videoNode.play();
                videoStream = stream;
            }).catch((error) => {
                console.error('navigator.getUserMedia error: ', error);
            });
        },
        open() {
            // this.$refs.usermedia.medioDevice()
        }
    }
};
</script>
<style lang="less" scoped>
</style>
