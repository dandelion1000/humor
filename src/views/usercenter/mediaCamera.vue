<template>
    <Modal class="update-avator-modal" v-model="mediaModal" :closable="false" :mask-closable="false">
        <div class="userCameraImg flex-center">
            <div class="justify-img flex1">
                <div class="" v-show="radioType=='1'">
                    <video v-show="isVideo" id="video" width="304" height="240" autoplay="autoplay"></video>
                    <canvas v-show="!isVideo" id="canvas" width="304" height="240"></canvas>
                </div>
                <div class="inline-table">
                    <div class="middle-cell" v-show="radioType!='1'"><img :src="userImg" alt=""></div>
                </div>
            </div>
            <div class="update-method">
                <RadioGroup v-model="radioType" @on-change="radioTypeChange" vertical>
                    <Radio label="1">
                        <span class="img-line">
                            <Icon type="md-camera"/><span>&nbsp;&nbsp;拍摄</span>
                        </span>
                    </Radio>
                    <Radio label="2">
                        <span class="img-line">
                            <Icon class="pointer" type="ios-cloud-upload-outline"/><span> 本地上传</span>
                        </span>
                    </Radio>
                </RadioGroup>
                <div v-if="radioType == '1'">
                    <Button v-if="iscamera" class="sureImage width100" @click="reCamera">
                        {{cameraText}}
                    </Button>
                    <Button v-else class="sureImage width100" @click="surePhoto">
                        定格
                    </Button>
                </div>
                <div v-if="radioType == '2'" class="">
                    <input id="upload-file" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileChange($event)">
                    <Button class="sureImage width100" @click="uploadImage">
                        上传图片
                    </Button>
                </div>
            </div>
        </div>
        <div slot="footer">
            <div class="del-cancel-text pointer" @click="closeMedia">关闭</div>
            <Button type="primary" @click="okAvator">确定</Button>
        </div>
    </Modal>
</template>
<script>
import Api from '@/api/common.js';
import adapter from 'webrtc-adapter';
export default {
    data() {
        return {
            userImg: '',
            mediaModal: false,
            videoNode: null,
            videoStream: null,
            isVideo: false,
            iscamera: true,
            radioType: '1',
            canvasObj: null,
            isStartCamer: 1,
            cameraText: '开始拍摄',
        };
    },
    methods: {
        fileChange(e) {
            const files = e.target.files;
            if (!files || !files[0]) {
                return;
            }
            Api.uploadFile(files[0]).then((res) => {
                this.userImg = res.url;
            });
        },
        medioDevice() {
            this.$Message.info('拍摄照片可能需允许使用您的摄像头');
            const mediaStreamConstraints = {
                video: {
                    width: 304,
                    height: 240
                },
            };
            const localVideo = document.querySelector('video');
            navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
                .then((mediaStream) => {
                    localVideo.srcObject = mediaStream;
                    this.videoStream = mediaStream;
                }).catch((error) => {
                    console.log('navigator.getUserMedia error: ', error);

                });

        },
        surePhoto() {
            let video = document.getElementById('video');
            this.isVideo = false;
            this.canvasObj = document.getElementById('canvas');
            let ctx =  this.canvasObj.getContext('2d');
            ctx.drawImage(video, 0, 0, 304, 240);
            this.hasCamerImg = true;
            if (this.videoStream) {
                this.iscamera = true;
                this.closeCarmea();
            }
        },
        radioTypeChange(type) {
            if (type === '2' && !!this.videoStream) {
                this.closeCarmea();
            } else {
                if (!this.iscamera) {
                    this.medioDevice();
                }
            }
        },
        uploadImage() {
            document.getElementById('upload-file').click();
        },

        reCamera() {
            this.isVideo = true;
            this.iscamera = false;
            this.hasCamerImg = false;
            if (this.isStartCamer) {
                this.cameraText = '重新拍摄';
                this.medioDevice();
            } else {
                this.medioDevice();
            }
        },
        open() {
            this.mediaModal = true;
        },
        okAvator() {
            if (!this.hasCamerImg && !this.userImg) {
                return this.$Message.warning('头像不能为空');
            }
            if (this.radioType === '1' && !!this.canvasObj) {
                this.canvasObj.toBlob((blob) => {
                    Api.uploadFile(blob, 'userImg.png').then(data => {
                        this.updateAvators(data.url);
                    });
                });
            } else {
                this.updateAvators(this.userImg);
            }
            if (this.videoStream) {
                this.closeCarmea();
            }
            this.mediaModal = false;
        },
        updateAvators(url) {
            Api.updateAvator({
                avatar_url: url
            }).then(() => {
                this.$emit('on-change', url);
                return this.$Message.success('头像更换成功');
            });
        },
        closeMedia() {
            if (this.videoStream) {
                this.closeCarmea();
            }
            this.mediaModal = false;
        },
        closeCarmea() {
            const tracks = this.videoStream.getTracks();
            tracks[0].stop();
        }
    }
};
</script>
