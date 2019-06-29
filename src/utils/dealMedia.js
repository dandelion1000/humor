// import adapterjs from 'adapterjs';
import adapter from 'webrtc-adapter';

console.log(adapter);

function initMedia(videoNode) {
    return new Promise((resolve, reject) => {
        adapter.webRTCReady(function (isUsingPlugin) {
            // WebRTC API 已准备就绪
            //isUsingPlugin: 使用WebRTC插件时为true，否则为false
            getUserMedia({
                audio: false,
                video: {
                    width: 304,
                    height: 240
                },
            }, (stream) => {
                console.log('videoNode', videoNode);
                videoNode.srcObject = stream;
                videoNode.play();
                let videoStream = stream;
                let obj = {
                    videoNode: videoNode,
                    videoStream: videoStream
                };
                resolve(obj);
            }, (error) => {
                reject(error);
                console.error('navigator.getUserMedia error: ', error);
            });
        });
    });
}


// const videoNode = document.getElementById('video');
const openBtn = document.getElementById('open');
const closeBtn = document.getElementById('close');

const startMedia = (videoNode) => {
    const constraints = {
        audio: false, // 是否打开语音
        video: {
            width: 304,
            height: 240
        },
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
    return new Promise((resolve, reject) => {
        userMedia.then((stream) => {
            // 成功后返回的业务逻辑
            videoNode.srcObject = stream;
            videoNode.play();
            let videoStream = stream;
            let obj = {
                videoNode: videoNode,
                videoStream: videoStream
            };
            resolve(obj);
        }).catch((error) => {
            reject(error);
            console.error('navigator.getUserMedia error: ', error);
        });
    });

};

export default {
    initMedia,
    startMedia
};
