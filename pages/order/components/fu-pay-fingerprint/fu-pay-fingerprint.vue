<template>
  <view v-if="show">
    <!-- mask层 -->
    <view :class="['mask', show ? '' : 'visible']"></view>
    <view class="content">
      <view class="title">
        <view class="close" @click="close()">
          <!-- <image src="/static/close.png" /> -->
          <text class="cuIcon-close"></text>
        </view>
        <view class="right" @click="handlePassWord">{{i18n['使用密码']}}</view>
      </view>
      <!-- 未开启指纹支付 -->
      <view v-if="!isBiological" class="desc errorDesc">
        <image src="./static/no.png" mode="aspectFill"></image>
        <view class="text-blue text-weight ">{{i18n['你暂未开启指纹支付']}} </view>
        <view class="setting" @click="handlerRoute">{{i18n['去开启']}} >></view>
      </view>
      <!-- 开启了指纹支付 显示错误信息 或者平台不支持 -->
      <view v-if="result && isBiological" class="desc errorDesc">
        <image src="./static/no.png" mode="aspectFill"></image>
        <view class="text-weight text-red">{{result}}</view>
      </view>
      <!-- 开启了指纹支付 且 支持平台支付 -->
      <view v-if="!result && isBiological" class="desc">
        <image src="./static/fingerprint.png" mode="aspectFill"></image>
        <view>{{i18n['请验证指纹']}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        isBiological: false,
        result: "",
      };
    },
    onLoad() {

    },
    methods: {
      handlePassWord() {
        this.$emit('handlePassWord');
      },
      close() {
        this.$emit('close');
      },
      handlerRoute() {
        uni.navigateTo({
          url: '/pages/index/setting/biological/index'
        })
      },
      checkIsSupportSoterAuthentication() {
        this.isBiological = global.userInfo.is_finger == 1 ? true : false
        if (!this.isBiological) {
          return
        }
        this.result = ''
        const that = this
        // #ifdef APP-PLUS || MP-WEIXIN
        uni.checkIsSupportSoterAuthentication({
          success(res) {
            console.log(res);
            // 如果当前设备支持生物识别方式，且支持指纹识别方式
            if (res.supportMode && res.supportMode.includes('fingerPrint')) {
              /**
               * uni.checkIsSoterEnrolledInDevice : 获取设备内是否录入指纹信息
               *  checkAuthMode: 'fingerPrint', // 检验指纹信息
               * */
              uni.checkIsSoterEnrolledInDevice({
                checkAuthMode: 'fingerPrint', // 检验指纹信息
                success(res) {
                  if (res.isEnrolled == true) {
                    /**
                     * 开始 SOTER 生物认证
                     * 执行成功，进行后续操作
                     * */
                    uni.startSoterAuthentication({
                      requestAuthModes: ['fingerPrint'],
                      challenge: '123456',
                      // authContent: '请用指纹解锁',
                      success(res) {
                        console.log(res);
                        uni.showToast({
                          title: this.i18n["识别成功"],
                          duration: 1000,
                          icon: 'none'
                        })
                        setTimeout(function() {
                         uni.showLoading({
                             title: this.i18n['支付中...']
                         });
                        }, 1000)
                        setTimeout(function() {
                          that.$emit('submit');
                        }, 3000)
                        //指纹识别成功后，进行后续工作
                      },
                      fail(err) {
                        that.result = this.i18n['识别失败']
                      },
                    })
                  } else {
                    that.result = this.i18n['此设备未录入指纹，请到设置中开启'];
                  }
                },
                fail(err) {
                  that.result = this.i18n['此设备未录入指纹，请到设置中开启'];
                }
              })
            } else {
              that.result = this.i18n["此设备不支持指纹识别功能"]
            }
          },
          fail(err) {
            that.result =this.i18n["此设备不支持指纹识别功能"]
          }
        })
        // #endif

        // #ifndef APP-PLUS || MP-WEIXIN
        this.result = this.i18n['此平台不支持指纹识别'];
        // #endif
      },
    }
  }
</script>

<style lang="scss">
  .mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    transition: all 0.3s ease;
    background: rgba(102, 102, 102, 0.3);
    opacity: 1;
    z-index: 2;
    visibility: visible;
  }

  .content {
    width: 588rpx;
    height: 400rpx;
    border-radius: 15rpx;
    position: absolute;
    left: 50%;
    top: 55%;
    margin-left: -294rpx;
    margin-top: -285rpx;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    z-index: 2;
    opacity: 1;
    visibility: visible;
    transition: all 0.3s ease;
  }

  .errorDesc {
    font-size: 30rpx;
    margin: 0 auto;
    text-align: center;
    display: block !important;
    height: 40rpx;

    image {
      text-align: center;
      margin: 0 auto;
    }

    view {
      height: 40rpx;
      color: red;
      text-align: center;
      line-height: 40rpx;
    }

    .setting {
      color: #058dc3;
    }
  }

  .visible {
    opacity: 0;
    z-index: 2;
    visibility: hidden;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    width: 560rpx;
    font-size: 32rpx;
  }

  .center {
    color: #333;
    font-size: 32rpx;
  }

  .close {
    width: 50rpx;
    height: 50rpx;
  }

  .right {
    color: #057bad;
    text-align: right;
    width: 130rpx !important;
  }

  image {
    width: 100%;
    height: 100%;
  }

  .desc {
    width: 525rpx;
    height: 200rpx;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    image {
      width: 100rpx;
      height: 100rpx;
    }
  }

  .desc view {
    width: 100%;
    height: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
