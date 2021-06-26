<template>
  <view class="cu-form-group">
    <!-- 上传视频 -->
    <view class="grid grid-square flex-sub grid02" :class="['col-' + col]">
      <view class="bg-img" v-if='isUpl'>
        <block v-if='videoList.src'>
          <!-- poster='' 封面图 -->
          <!-- <video :src="videoList.src" class="video"> -->
          <image :src="videoPoster" alt="" mode="aspectFill" @tap='previewVideo(videoList.src)'></image>
          <video :src="videoList.src" class="video" style="display: none;" id='myVideo'
            @fullscreenchange='fullscreenchange'></video>
          <!-- </video> -->
          <view class="cu-tag bg-red" v-if="!videoList.loading || videoList.loading == '100%'" @tap.stop="DelVideo">
            <text class="cuIcon-close"></text>
          </view>
        </block>
        <view class="progress-mask flex justify-center align-center padding-lr-sm" v-if='!videoList.src || !isUpl'>
          <view class="cu-progress bg-mask round xs">
            <view class="bg-white" :style="{ width: videoList.loading }"></view>
          </view>
        </view>
      </view>
      <view class="solids solids02" @tap="chooseVideo" v-if="!isUpl">
        <text class="cuIcon-cameraadd"></text>
      </view>
    </view>

  </view>
</template>

<script>
  /**
   * @description 视频组件
   * */
  import { UPLOAD_VIDEO_URL } from "@/common/config.js";
  export default {
    props: {
      col: {
        type: [Number, String],
        default: 4,
      },
      video: {
        type: String,
        default() {
          return '';
        },
      },
    },
    data() {
      return {
        cameraList: [{
          value: 'back',
          name: global.i18n['后置摄像头'],
          checked: 'true'
        },
        {
          value: 'front',
          name: global.i18n['前置摄像头']
        },
        ],
        videoUrl: UPLOAD_VIDEO_URL,
        videoList: { src: this.video, error: true, loading: '0%' },
        isUpl: false,
        cameraIndex: 0,
        temp: '',
        videoPoster: '', // 视频封面图
      };
    },
    computed: {
    },
    methods: {
      previewVideo(val) {
        console.log(111111, val)
        // 获取 video 上下文 videoContext 对象
        this.videoContext = uni.createVideoContext('myVideo');
        // 进入全屏状态
        this.videoContext.requestFullScreen(0);
        setTimeout(function () {
          uni.createVideoContext('myVideo').play(); //开始视频播放事件
        }, 500)
      },
      // 退出全屏时视频暂停
      fullscreenchange() {
        uni.createVideoContext('myVideo').pause(); //暂停视频播放事件
        uni.createVideoContext('myVideo').seek(0);
      },
      // 删除视频
      DelVideo() {
        this.videoList.src = '',
          this.videoList.loading = '0%'
        this.isUpl = false
      },
      // 上传视频
      chooseVideo(data) {
        uni.chooseVideo({
          maxDuration: 60,
          count: 1,
          camera: this.cameraList[this.cameraIndex].value,
          sourceType: ['album', 'camera'],
          success: (responent) => {
            this.isUpl = true
            let videoFile = responent.tempFilePath;
            console.log(videoFile)
            const uploadTask = uni.uploadFile({
              url: this.videoUrl,
              filePath: videoFile,
              name: "file",
              success: (res) => {
                uni.hideLoading();
                console.log(res)
                let videoUrls = JSON.parse(res.data) //微信和头条支持
                console.log(11111, videoUrls)
                if (videoUrls.code == 1) {
                  var fileData = videoUrls.data.data;
                  this.videoList.src = fileData.file
                  console.log(this.videoList.src)
                  this.videoPoster = this.videoList.src + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_300,h_300';
                  this.$emit("change", fileData.fileId);
                }

              },
              fail: () => {
                uni.hideLoading();
                this.isUpl = false
              }
            })
            uploadTask.onProgressUpdate((res) => {
              this.videoList.loading = res.progress + "%";
              console.log(this.videoList.loading)
            });
          }
        })
      },
    },
  };
</script>
<style lang="scss" scoped>
  .progress-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
  }

  /* .cu-tag{
  z-index: 99;
} */
  /* .video {
    width: 200rpx;
    height: 200rpx;
  }

  .grid02 {
    height: 240rpx;
  }

  .grid02.col-4.grid-square>uni-view {
    width: 240rpx;
    height: 240rpx;
  }

  .grid02.col-4.grid-square>.solids02 {
    width: 240rpx;
    height: 240rpx;
  }
  .uni-video-video {
    width: 240rpx;
    height: 240rpx;
  } */
</style>
