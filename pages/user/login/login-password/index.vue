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
      <view class="block-box solid-bottom" >
        <view class="title">
          <image class="image" src="../../static/pwd.png" mode="widthFix"></image>
        </view>
        <view class="pwd">
          <input placeholder-class="placeholderClass" v-if="type == 'password'" type="password" v-model="password"
            :placeholder="i18n['请输入密码(6-12位字母+数字)']" minlength="6" maxlength="12"  />
          <input placeholder-class="placeholderClass" v-if="type == 'text'" type="text" v-model="password" :placeholder="i18n['请输入密码(6-12位字母+数字)']"
            minlength="6" maxlength="12" />
          <view class="pwd-right" >
            <image src="../../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'" mode="widthFix"></image>
            <image src="../../static/close.png" class="close" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'"
              mode="widthFix"></image>
          </view>
        </view>
      </view>
      <view class="paw">
        <view @click="handleJump" data-type="REDIRECT" :data-url="PAGE_BASE_URL + 'login-code/index'">{{i18n['验证码登录']}}</view>
      </view>
    </view>
    <!-- 验证码login end -->

    <!-- 立即登录按钮 start -->
    <button type="warn" :loading="is_click" class="login-btn" shape="circle" @click="handleLogin">
      {{i18n['登录']}}
    </button>
    <!-- 立即登录按钮 end -->

    <view class="reg-paw">
      <text @tap="handleJump" data-type="REDIRECT" :data-url="PAGE_BASE_URL + 'register/index'">{{i18n['注册账号']}}</text>
      <text @click="handleJump" data-type="REDIRECT" :data-url="PAGE_BASE_URL + 'forget/index'" class="wj_mh">{{i18n['忘记密码']}}</text>
    </view>


    <view class="footer">
      <!-- 快捷登陆 start -->
      <view class="quick">
        <view class="quick-title"><text class="line"></text>
          <text class="txt">{{i18n['快捷登录']}}</text><text class="line"></text></view>
        <view class="sanfang">
          <image @click="wxLogin" src="../../static/login-quick-001.png" mode=""></image>
          <!-- <image @click="emailLogin" src="../../static/login-email.png" mode=""></image> -->
        </view>
      </view>
    <!-- 快捷登陆 end -->
    <!-- 协议同意 start -->
     <!-- <view class="box-bottom  margin-top-64">
        <view class="agreement">
          <image class="image" @click="handle_select" v-if="is_select_agree" src="../../static/select.png"></image>
          <image class="image" @click="handle_select" v-else src="../../static/noselect.png"></image>
          <view> {{i18n['点击登录即默认同意']}} <text @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=15">{{i18n['《用户注册协议》']}}</text>{{i18n['与']}}<text
              @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=4">{{i18n['《隐私政策》']}}</text> </view>
        </view>
      </view> -->
      <!-- 协议同意 end -->
    </view>
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
        phone: '', //手机号
        password: '', //密码
        is_click: false, //加载动画
        type: 'password', //密码类型
        PAGE_BASE_URL: '/pages/user/login/', // 页面基础路径

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
       * @description  立即登录
       */
     handleLogin() {
       // 选择用户协议
       if(!this.is_select_agree){
         this.$message.info(this.i18n['请勾选用户协议']);
         return false;
       }
     	// #ifdef APP-PLUS
     	plus.key.hideSoftKeybord();
     	// #endif
     	if (this.is_click) {
     		return;
     	}
     	let {
     		phone,
     		password
     	} = this;
     	// 手机号不存在
     	if (!phone) {
     		this.$message.info(this.i18n['请输入手机号']);
     		return false;
     	}
     	// 手机号不符合正则验证
     	if (!validate(phone, 'phone')) {
     		this.$message.info(this.i18n['请输入正确的手机号']);
     		return false;
     	}
     		// 密码不符合正则验证
     	if (!validate(password, 'password')) {
     		this.$message.info(this.i18n['请输入字母加数字6-12位密码']);
     		return false;
     	}
     	let clientId = 'clientId'
     	let appSystem = 'appSystem'

     	// #ifdef APP-PLUS
     	clientId = plus.push.getClientInfo().clientid || '';
     	console.log('getClientInfo', plus.push.getClientInfo())
     	appSystem = uni.getSystemInfoSync().platform == 'ios' ? 1 : 2;
     	// #endif

     	this.is_click = true;
     	// postloginByAccount 账号密码登录接口
     	this.$api.post(global.apiUrls.postloginByAccount, {
     		mobile: phone,
     		password,
     		clientId,
     		appSystem
     	}).then(res => {
     		this.is_click = false;
     		if (res.data.code == 1 && res.data.data) {
     			this.$message.info(res.data.msg); // 提示框
     			this.$store.commit('updateUserInfo', res.data.data.userinfo); // 修改vuex储存的用户信息
     			setTimeout(() => {
     				uni.navigateBack(); // 返回上一页
     			}, 800)
     		} else {
     			this.$message.info(res.data.msg);// 错误提示框
     		}
     	})
     },
      /**
       * @event 跳转到邮箱登录页面
       */
      emailLogin() {
        uni.redirectTo({
          url: "/pages/user/login/login-email-code/index",
        });
      },
      /**
       * @event 微信登陆
       */
      wxLogin() {
        let _this = this;
        // #ifdef APP-PLUS
        // 如果是app环境打开微信
        if (
          plus.runtime.isApplicationExist({
            pname: "com.tencent.mm",
            action: "weixin://",
          })
        ) {
          uni.getProvider({
            service: "oauth",
            success: function(res) {
              console.log(res);
              // 如果支持微信等，就执行 wx_login_fn 方法
              if (~res.provider.indexOf("weixin")) {
                _this.wx_login_fn();
              }
            },
            fail: function(err) {
              // api错误是打印错误
              console.log(err);
            },
          });
        } else {
          // 调起失败时提醒用户
          this.$message.info(this.i18n["请安装微信后再使用此功能"]);
        }
        // #endif
      },
      /**
       * @function 微信授权登录
       */
      wx_login_fn() {
        let _this = this;
        /**
         * @desc uniapp的登陆api
         * @param {String} provider - 登录服务提供商
         * @param {login~success} loginRes - 接口调用成功时的回调函数
         */
        uni.login({
          provider: "weixin",
          /**
           * @callback login~success
           * @param {Object} loginRes - api返回来的信息
           */
          success: function(loginRes) {
            /**
             * @desc 获取用户信息
             * @param {String} provider - 登录服务提供商
             * @param {Funtion} success - 接口调用成功时的回调函数
             */
            uni.getUserInfo({
              provider: "weixin",
              /**
               * @callback success
               * @param {Object} infoRes - api返回来的信息
               */
              success: function(infoRes) {
                // 显示加载状态
                uni.showLoading({
                  title: this.i18n["加载中..."],
                });
                /**
                 * @let {String} nickName - 结构出来的变量昵称
                 * @let {String} avatarUrl - 解构出来的头像链接
                 * @let {String} gender - 结构出来的性别
                 */
                let {
                  nickName,
                  avatarUrl,
                  gender
                } = infoRes.userInfo;
                // #ifdef APP-PLUS
                let clientId = plus.push.getClientInfo().clientid || "";
                console.log("clientId", clientId);
                //  @const {Number} appSystem - 判断设备类型 1：ios；2：安卓；
                let appSystem = uni.getSystemInfoSync().platform == "ios" ? 1 : 2;
                // #endif
                console.log(infoRes.userInfo.unionId, "app微信登录");
                /**
                 * @description 第三方登录请求接口
                 */
                _this.$api
                  .post(global.apiUrls.postUserSocialLogin, {
                    type: 1,
                    wx_unionid: infoRes.userInfo.unionId,
                    qq_unionid: "",
                    wb_unionid: "",
                    clientId: clientId || "",
                    appSystem: appSystem || "",
                    nickname: nickName,
                    avatar: avatarUrl,
                    gender: gender,
                  })
                  .then((res) => {
                    // 保存用户信息
                    global.tempUserLoginInfo = infoRes.userInfo;
                    // 关闭加载效果
                    uni.hideLoading();
                    if (res.data.code == 1) {
                      _this.$message.info(res.data.msg);
                      /**
                       * @description 向Vux发送用户信息保存
                       * @param {String} updateUserInfo - 调用的方法名称
                       * @param {Object} res.data.data.userinfo - 用户信息
                       */
                      _this.$store.commit(
                        "updateUserInfo",
                        res.data.data.userinfo
                      );
                      setTimeout(() => {
                        uni.navigateBack();
                      }, 800);
                    } else if (res.data.code == -999) {
                      /**
                       * @description 清除当前页面，跳转到绑定手机页面
                       */
                      _this.$urouter.redirectTo({
                        url: _this.PAGE_BASE_URL + "bind-phone/index",
                        params: {
                          unionId: infoRes.userInfo.unionId,
                          openId: infoRes.userInfo.openId,
                          sex: infoRes.userInfo.gender,
                          nickName: infoRes.userInfo.nickName,
                          avatarUrl: infoRes.userInfo.avatarUrl,
                          authType: "wx_unionid",
                        },
                      });
                      // 点击手机号账号登录按钮
                    } else if (res.code == -1) {
                      _this.$message.info(res.data.msg);
                      return;
                    }
                  })
                  .catch((err) => {
                    uni.hideLoading();
                    console.log(err);
                  });
              },
            });
          },
          error: function(err) {
            uni.hideLoading();
            console.log(err);
          },
        });
      },
      
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
        margin: 0 32rpx;
        height: 124rpx;
        line-height: 124rpx;
        // background: #FFFFFF;
        display: flex;
        align-items: center;
        position: relative;
        .title {
          margin: 0 28rpx 0 0rpx;
          width: 34rpx;
          height: 100%;
           position: relative;
           flex-shrink: 0;
          .image {
            width: 100%;
            height: 100%;
            position:absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .pwd {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          input{
            flex: 1;
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
      }

      .paw {
        width: 140px;
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 34rpx;
        color: #333333;
        width: 100%;
        text-align: right;
        padding-right: 32rpx;
        margin: 32rpx 0 0;
      }
    }

    // 验证码login end

    // 立即登录按钮 start
    // 立即登录按钮 start
    .login-btn {
      position: relative;
      // top: -14rpx;
      height: 88rpx;
      background: linear-gradient(90deg, #FFA133 0%, #FF5307 100%);
      opacity: 1;
      border-radius: 44px;
      margin: 48rpx 32rpx 0;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
    }

    // 立即登录end

    .reg-paw {
      margin: 32rpx 0;
      text-align: center;

      text {
        font-family: PingFang SC;
        font-weight: Regular;
        color: #999999;
        font-size: 28rpx;
        display: inline-block;
        min-width: 25%;
        position: relative;
      }

      .wj_mh:before {
        position: absolute;
        height: 26rpx;
        width: 1px;
        background: #999;
        content: '';
        left: 0rpx;
        top: 8rpx;
      }

    }

    // 快捷登录 start
    .quick {
      text-align: center;

      .quick-title {
        margin: 100rpx 0 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .txt {
          padding: 0 20rpx;
          font-size: 24rpx;
          font-family: PingFang-SC-Regular;
          color: #999999;
        }

        .line {
          display: block;
          width: 160rpx;
          position: relative;

          &:after {
            content: "";
            position: absolute;
            z-index: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            border-bottom: 1px solid #EEEEEE;
            transform: scaleY(0.5);
            transform-origin: 0 0;
          }
        }
      }

      image {
        width: 80rpx;
        height: 80rpx;
        margin: 0 35rpx;
      }
    }
    // 快捷登录 end
    .box-bottom {


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

  }

  .placeholderClass {
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #BFBFBF;
  }

  // 主体 end
  .footer{
      position: fixed;
      bottom: 116rpx;
      bottom: calc(116rpx + constant(safe-area-inset-bottom));
      bottom: calc(116rpx + env(safe-area-inset-bottom));
      width: 100%;
    }
    .margin-top-64{
      margin-top: 64rpx;
    }
</style>
