<template>
  <view class="warp">

    <!-- background pic start -->
   <view class="bg" :style="{height:'calc(440rpx + ' + StatusBar + 'px)'}">
      <image src="../../static/login-bg.png" mode="widthFix" class="bg_img"></image>
      <view class="logo-contnt">
        <view class="logo"> </view>
        <!-- <view class="desc">欢迎来到fust-UI</view> -->
      </view>
    </view>
    <!-- background pic end -->

    <!-- 验证码login start -->
    <view class="form-wapper">
      <view class="block-box solid-bottom">
        <view class="title">
          <image class="image" src="../../static/phone.png" mode="widthFix"></image>
        </view>
        <input type="number" focus v-model="phone" maxlength="11" placeholder-class="placeholderClass" :placeholder="i18n['请输入手机号']"
          name="input" />
      </view>

      <view class="block-box  solid-bottom">
        <view class="title">
          <image class="image" src="../../static/yzm.png" mode="widthFix"></image>
        </view>
        <input type="number" v-model="vercode" placeholder-class="placeholderClass" :placeholder="i18n['请输入验证码']" name="input" />
        <text class="code" @click="handleSendVerCode">
          {{ beginning ? time + i18n["s后重新获取"] : i18n["获取验证码"] }}
        </text>
      </view>

      <view class="block-box  solid-bottom">
        <view class="title">
          <image class="image" src="../../static/pwd.png" mode="widthFix"></image>
        </view>
        <view class="pwd">
          <input placeholder-class="placeholderClass" v-if="type == 'password'" type="password" v-model="password"
            :placeholder="i18n['请输入密码(6~12位字母+数字)']" minlength="6" maxlength="12" class="ipt" />
          <input placeholder-class="placeholderClass" v-if="type == 'text'" type="text" v-model="password" :placeholder="i18n['请输入密码(6~12位字母+数字)']"
            minlength="6" maxlength="12"  class="ipt" />
          <view class="pwd-right" >
            <image src="../../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'" mode="widthFix"></image>
            <image src="../../static/close.png" class="close" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'"
              mode="widthFix"></image>
          </view>
        </view>
      </view>
    </view>
    <!-- 验证码login end -->

    <!-- 立即登录按钮 start -->
    <button type="warn" :loading="is_click" class="login-btn" shape="circle" @click="reg">
      {{i18n['注册']}}
    </button>

    <view class="reg-paw">
      {{i18n['已有账号，前去']}} <text @click="handleJump" :data-url="PAGE_BASE_URL + 'login-code/index'">{{i18n['登录']}}</text>
    </view>

    <!-- 协议同意 start -->
    <view class="box-bottom">
      <view class="agreement">
        <image class="image" @click="handle_select" v-if="is_select_agree" src="../../static/select.png"></image>
        <image class="image" @click="handle_select" v-else src="../../static/noselect.png"></image>
        <view class="text-999 text-sm"> {{i18n['点击登录即默认同意']}} <text @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=15">{{i18n['《用户注册协议》']}}</text>{{i18n['与']}}<text
            @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=4">{{i18n['《隐私政策》']}}</text> </view>
      </view>
    </view>
    <!-- 协议同意 end -->
    <!-- 断网监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网监测 end -->

  </view>
</template>
<script>
  // 引入验证方法
  import {
    validate
  } from "@/common/utils/index";
  export default {
    data() {
      return {
        is_select_agree: true,
        phone: "", // 手机号,@String
        password: '', //密码
        vercode: "", // 验证码,@String
        type: 'password', //密码类型
        is_click: false, // 立即登录按钮是否点击,@Boolean
        verCodeBtnLoading: false, // 是否显示加载图标,@Boolean
        time: 60, // 倒计时60S,@Number
        beginning: false, // 显示倒计时,@Boolean
        PAGE_BASE_URL: "/pages/user/login/", // 页面基础路径,@String
        timer: null, // 计时器,@Function
        invite_code:'',//邀请码
      };
    },
    onUnload() {
      // 页面关闭时清除计时器，优化性能
      clearInterval(this.timer);
    },
    methods: {
      /**
       * @param 是否选择同意协议
       */
      handle_select() {
        this.is_select_agree = !this.is_select_agree
      },


      /**
       * @event 发送验证码
       */
      handleSendVerCode() {
        // 保存this
        let _this = this;
        // 从this里结构出来phone
        let {
          phone
        } = this;

        // 验证手机号strat
        if (!phone) {
          this.$message.info(this.i18n["请输入手机号"]);
          return false;
        }
        if (!validate(phone, "phone")) {
          this.$message.info(this.i18n["请正确输入手机号"]);
          return false;
        }
        // 验证手机号 end

        // 如果有倒计时，return false
        if (this.beginning) return false;

        this.verCodeBtnLoading = true; // 显示加载状态

        /**
         * @desc 请求验证码接口
         * @param {Object} {} - 参数
         * @param {Boolean} {}.is_test - 是否是测试环境
         * @param {String} {}.mobile - 手机号
         * @param {String} {}.type - 类型
         */
        this.$api
          .post(global.apiUrls.GetVerifyCode, {
            is_test: global.IS_DEV,
            mobile: phone,
            type: "1",
          })
          .then((res) => {
            // 改加载状态为false
            _this.verCodeBtnLoading = false;

            // 如果后台返回的code码为1
            if (res.data.code == 1) {
              this.beginning = true; // 显示倒计时
              // 清除倒计时,防抖作用
              clearInterval(_this.timer);
              _this.timer = setInterval(() => {
                if (_this.time == 1) {
                  //倒计时结束就清楚这个倒计时
                  clearInterval(_this.timer);
                  _this.time = 60; // 倒计时60s
                  _this.beginning = false; // 是否显示倒计时改为false
                  return;
                }
                _this.time--;
              }, 1000);
              // 向用户发送提示
              _this.$message.info(this.i18n["验证码为"] + res.data.data.code + this.i18n["请注意查收"]);
            } else {
              // 如果报错，向用户提示
              _this.$message.info(res.data.msg);
            }
          })
          .catch(function(err) {
            // 接口错误打印错误
            console.log(err);
          });
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
       * @description 注册
       * */
      reg() {
        // #ifdef APP-PLUS
        plus.key.hideSoftKeybord();
        // #endif
        // 禁止重复点击
        if (this.is_click) return;

        let {
          phone,
          vercode,
          password,
          invite_code
        } = this;
        // 验证表单数据是否正确
        if (!phone) return this.$message.info(this.i18n['请输入手机号']);
        if (!validate(phone, 'phone')) return this.$message.info(this.i18n['请输入正确的手机号']);
        if(!this.is_select_agree) return this.$message.info(this.i18n['请勾选用户协议']);
        if (!vercode) return this.$message.info(this.i18n['验证码不能为空']);
        if (!validate(password, 'password')) return this.$message.info(this.i18n['请输入字母加数字6-12位密码']);
        // 请求注册接口
        this.is_click = true;
        this.$api
          .post(global.apiUrls.postRegisterByMobile, {
            mobile: phone,
            code: vercode,
            type: 1,
            password: password,
            invite_code: invite_code,
            user_source: SYSTEM_CONFIG.platform
          })
          .then(res => {
            this.is_click = false;
            if (res.data.code == 1 && res.data.data) {
              // 注册成功 返回上一页
              this.$message.info(res.data.msg);
              this.$store.commit('updateUserInfo', res.data.data.userinfo);
              setTimeout(() => {
                uni.navigateBack();
              }, 800);
            } else {
              this.$message.info(res.data.msg);
            }
          });
      }
    },
  };
</script>
<style lang="scss">
  // 头部返回键 start
  .cu-bar .action {
    position: relative;
    z-index: 5;
  }

  // 头部返回键 end
  // 主体 start
  .warp {
    background: #fff;
    min-height: 100vh;
    overflow: hidden;
    // background pic start
    .bg {
      width: 100%;
      position: relative;
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





    .form-wapper {
      margin-top: -44rpx;
      position: relative;
      z-index: 999;
      .block-box {
        position:relative;
        margin: 0 32rpx;
        height: 124rpx;
        line-height: 124rpx;
        // background: #FFFFFF;
        display: flex;
        align-items: center;
        .title {
          margin: 0 28rpx 0 0rpx;
          width: 34rpx;
          height: 100%;
          position:relative;
          .image {
            position:absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            height: 100%;
          }
        }

        .pwd {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          .ipt{
            flex:1;
          }
          .pwd-right {
            position: relative;
            right: 0rpx;
            width: 34rpx;
            height: 100%;
            .close {
              position: absolute;
              top:50%;
              transform:translateY(-50%);
            }

            image {
              width: 100%;
              height: 100%;
            }
          }
        }

        // 发送验证码 start
        .code {
          position: absolute;
          right:0;
          min-width: 200rpx;
          text-align: right;
          font-size: 28rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #FF7F00;
        }

      }
    }


    // 立即登录按钮 start
    .login-btn {
      letter-spacing: 5rpx;
      height: 88rpx;
      background: linear-gradient(90deg, #FFA133 0%, #FF5307 100%);
      opacity: 1;
      border-radius: 44px;
      margin: 88rpx 32rpx 32rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
    }

    // 立即登录end
    .reg-paw {
      margin:32rpx 0 32rpx 0;
      font-weight: 400;
      text-align: center;
      font-size: PingFangSC-Regular;
      color: #999999;
      font-size: 28rpx;

      text {
        color: #0589FB;
      }
    }

    //同意协议 start
    .box-bottom {
      position: fixed;
      bottom: 40rpx;
      bottom: calc(40rpx + constant(safe-area-inset-bottom));
      bottom: calc(40rpx + env(safe-area-inset-bottom));
      width: 100%;
      .agreement {
        display: flex;
        width: 100%;
        font-family: PingFangSC-Regular;
        font-size: 24rpx;
        color: #666666;
        align-items: center;
        justify-content: center;
        .image {
          height: 24rpx;
          width: 24rpx;
          margin-right: 12rpx;
        }

        text {
          color: #4177DD;
        }
      }

    }

    // 同意协议 end

  }

  .placeholderClass {
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #BFBFBF;
  }

  // 主体 end
</style>
