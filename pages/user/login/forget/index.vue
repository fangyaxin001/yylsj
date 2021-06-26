<template>
  <view class="page">
    <view class="bg" :style="{height:'calc(440rpx + ' + StatusBar + 'px)'}">
      <view class="cuIcon-back back text-lg" :style="{top:'calc(28rpx + ' + StatusBar + 'px)'}" @click="back"></view>
      <image src="../../static/login-bg.png" mode="widthFix" class="bg_img"></image>
      <view class="logo-contnt">
        <view class="logo"> </view>
        <!-- <view class="desc">欢迎来到fust-UI</view> -->
      </view>
    </view>
    <!-- background pic end -->
    <!-- 表单信息 start -->
    <view class="bind-phone form-wapper ">
      <!-- 手机号码 start -->
      <view class="input-wapper solid-bottom">
        <view class="title">
          <image class="image" src="../../static/phone.png" mode="widthFix"></image>
        </view>
        <input type="number" focus v-model="phone" maxlength="11" placeholder-class="placeholderClass" :placeholder="i18n['请输入手机号']"
          name="input" />
      </view>
      <!-- 手机号码 end -->
      <!-- 获取验证码 start -->
      <view class="input-wapper solid-bottom ">
        <view class="title">
          <image class="image" src="../../static/yzm.png" mode="widthFix"></image>
        </view>
        <input type="number" v-model="vercode" placeholder-class="placeholderClass" :placeholder="i18n['请输入验证码']" name="input" />
        <text class="code" @click="getCode">{{ beginning ? time + i18n['s后重新获取'] : i18n['获取验证码'] }}</text>
      </view>
      <!-- 获取验证码 end -->
      <!-- 输入密码 start -->
      <view class="input-wapper solid-bottom">
        <view class="title">
          <image class="image" src="../../static/pwd.png" mode="widthFix"></image>
        </view>
        <view class="pwd">
          <input placeholder-class="placeholderClass" v-if="type == 'password'" type="password" v-model="password"
            :placeholder="i18n['请输入新密码(6~12位字母+数字)']" minlength="6" maxlength="12" />
          <input placeholder-class="placeholderClass" v-if="type == 'text'" type="text" v-model="password" :placeholder="i18n['请输入新密码(6~12位字母+数字)']"
            minlength="6" maxlength="12" />
          <view class="pwd-right">
            <image src="../../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'" mode="widthFix"></image>
            <image src="../../static/close.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'" mode="widthFix"></image>
          </view>
        </view>
      </view>
      <!-- 输入密码 end -->
    </view>
    <!-- 表单信息 end -->
    <!-- 提交按钮 start -->
    <view class="btn_cloce"  :loading="is_click"   @click="reg">{{i18n['确定']}}</view>
    <!-- 提交按钮 end -->
    <!-- 网络监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 网络监测 end -->
  </view>
</template>

<script>
  // 表单验证插件
  import {
    validate
  } from '@/common/utils/index.js'
  let _this;
  export default {
    data() {
      return {
        phone: '', //手机号
        vercode: '', //验证码
        password: '', //密码
        verCodeBtnLoading: false,
        time: 60, //倒计时60S
        beginning: false, //显示倒计时
        is_click: false,
        type: 'password', //密码类型
      };
    },
    onLoad() {
      _this = this;
    },
    onBackPress() {
      uni.hideKeyboard()
    },
    methods: {
      back(){
        uni.navigateBack();
      },
      //密码是否可见
      is_kejian(e) {
        let type = e.currentTarget.dataset.type;
        if (type == 'password') {
          this.type = 'text';
        } else {
          this.type = 'password';
        }
      },
      /**
       * @event 点击获取验证码
       * @description 获取验证码
       * @property {String} is_test - 是否是测试环境
       * @property {String} phone - 手机号
       * @property {String} type - 请求类型 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手几号
       */
      // 发送验证码
      getCode() {
        let { phone } = this;
        if (!phone) {
          _this.$message.info(_this.i18n['请输入手机号']);
          return false;
        }
        if (!validate(phone, 'phone')) {
          _this.$message.info(_this.i18n['请输入正确的手机号']);
          return false;
        }
        if (this.beginning) return false;
        this.verCodeBtnLoading = true;
        this.beginning = true;
        this.$api
          .post(global.apiUrls.GetVerifyCode, {
           is_test: global.IS_DEV,
           mobile: phone,
           type: '2'
          })
          .then(res => {
            this.verCodeBtnLoading = false;
            if (res.data.code == 1) {
              clearInterval(_this.timer);
              //开始倒计时
              _this.timer = setInterval(() => {
                if (_this.time == 1) {
                  //倒计时结束
                  clearInterval(_this.timer);
                  _this.time = 60;
                  _this.beginning = false;
                  return;
                }
                _this.time--;
              }, 1000);
              _this.$message.info(_this.i18n['验证码为'] + res.data.data.code + _this.i18n['请注意查收']);
            } else {
              clearInterval(_this.timer);
              _this.beginning = false;
              _this.$message.info(res.data.msg);
            }
          });
      },

      /**
       * @description 登录
       */
      reg() {
        // 登录加载动画未完成不往下执行
        if (this.is_click) {
          return;
        }
        // 从data取值 phone手机号 vercode验证码 password密码
        let { phone, vercode, password } = this;
        // 手机号不存在
        if (!phone) {
          this.$message.info(this.i18n['请输入手机号']);
          return false;
        }
        // 输入手机号错误
        if (!validate(phone, 'phone')) {
          this.$message.info('请输入正确的手机号');
          return false;
        }
        // 验证码不存在
        if (!vercode) {
          this.$message.info(this.i18n['请输入验证码']);
          return false;
        }
        // 验证码错误
        if (!validate(password, 'password')) {
          this.$message.info(this.i18n['请输入字母加数字6-12位密码']);
          return false;
        }
        // 加载动画完成
        this.is_click = true;
        // 调用重置密码接口
        this.$api
          .post(global.apiUrls.postForgetPassword, {
            password: password,
            mobile: phone,
            code: vercode
          })
          .then(res => {
            this.is_click = false;
            // 重置密码成功跳转密码登录页面进行登录
            if (res.data.code == 1 && res.data.data) {
              // 重置密码成功提示
              this.$message.info(res.data.msg);
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/user/login/login-password/index'
                });
              }, 500);
            } else {
              // 重置密码失败提示
              this.$message.info(res.data.msg);
            }
          });
      },

    }
  };
</script>
<style lang="scss">
  .top_title{
    font-size: 36rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .page {
    width: 100%;
    background: #FFFFFF;
    height: 100vh;
    overflow: hidden;
  }
  // background pic start
    .bg {
      width: 100%;
      position: relative;
      .back{
        position: absolute;
        top: 28rpx;
        left: 32rpx;
        z-index: 99;
      }
      .bg_img {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
      }
    }

    .logo-contnt {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .logo {
        width: 180rpx;
        height: 180rpx;
        background-image: url('/static/logo.png');
        background-repeat: no-repeat;
        background-size: contain;
        border-radius: 40rpx;
         overflow: hidden;
      }

      .desc {
        width: 100%;
        margin-left: -50%;
        height: 56rpx;
        line-height: 32rpx;
        margin-top: 32rpx;
        text-align: center;
        font-size: 40rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
      }

    }

    // background pic end
  .bind-phone {
    // border-top: 1rpx solid #EEEEEE;
  }

   .form-wapper {
     margin-top: -44rpx;

    width: 100%;
    padding: 0 32rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 999;
    .input-wapper {
      position: relative;
      display: flex;
      width: 100%;
      align-items: center;
      height: 124rpx;
      font-size: 32rpx;
      .title {
         margin: 0 28rpx 0 0rpx;
        width: 34rpx;
        height: 100%;
        position: relative;
        .image {
          width: 100%;
          height: 100%;
          position:absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      // 发送验证码 start
      .code {
        position: absolute;
        text-align: right;
        right: 0;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FF7F00;
      }

      .pwd {
        flex: 1;
        align-items: center;
        position: relative;
        input {
          width: 80%;
        }

        .pwd-right {
          width: 34rpx;
          height:100%;
          position:absolute;
          right:0;
          top:50%;
          transform:translateY(-50%);
          image {
            width: 100%;
            height: 100%;

          }
        }
      }
    }
  }

  .placeholderClass {
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #BFBFBF;
  }

  // 提交按钮 start
  .btn_cloce {
    margin: 88rpx 32rpx 0;
    border-radius: 88rpx;
    font-size: 32rpx;
    line-height: 88rpx;
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
    height: 88rpx;
    background: linear-gradient(90deg, #FFA133 0%, #FF5307 100%);
    opacity: 1;
    border-radius: 44rpx;
  }

  // 提交按钮 end
</style>
