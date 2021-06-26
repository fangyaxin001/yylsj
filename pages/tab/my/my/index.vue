<template>
  <view class="my">
    <!-- 自定义头部 start -->
    <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
      <view class="cu-bar fixed" :style="{height: CustomBar + 'px',paddingTop: StatusBar + 'px',overflow: 'hidden'}">
        <image class="img-height" src="../../../../static/my/my-background.png" mode="widthFix" style="position:absolute;top:0;width:100%;" />
        <view class="action"></view>
        <view v-if="showBarTitle" class="content text-white" :style="[{ top: StatusBar + 'px' }]">{{ i18n['个人中心'] }}</view>
        <!-- #ifndef MP-WEIXIN -->
        <view class="margin-right fu-top-action">
          <view class="fu-top-pic">
            <image class="fu-top-pic" src="../../../../static/my/top-1.png" mode="aspectFill" @click="handleJump" data-url="/pages/index/setting/setting/index" />
          </view>
          <view class="margin-left-sm fu-top-pic fu-message">
            <image class="fu-top-pic" src="../../../../static/my/top-2.png" mode="aspectFill" @click="handleJump" data-url="/pages/service-message/message/message-type/index" />
            <view class="fu-top-tag" v-if="messageNum != 0">{{ messageNum }}</view>
          </view>
        </view>
        <!-- #endif -->
      </view>
    </view>
    <!-- 自定义头部 end -->

    <!-- 背景图 start -->
    <view class="fu-my-background">
      <image src="../../../../static/my/my-background.png" mode="widthFix" />
    </view>
    <!--背景图 end -->

    <!-- 用户信息 - 已登录 start -->
    <view class="userInfo" id="userInfo" v-if="userInfo" @click="handleJump" data-url="/pages/user/user/info/index">
      <view class="tui-msg-box">
        <view class="flex flex-sub align-center">
          <view class="block-108 round"><fu-image :src="userInfo.head_img" errorImg="/static/logo.png" mode="aspectFill" radius="50%"></fu-image></view>
          <view class="margin-left fu-headpic-text">
            <view class="text-xl text-white">{{ userInfo.user_nickname }}</view>
            <view class="flex">
              <text class="text-sm text-white fu-line-height">{{ i18n['邀请码'] }}：{{ invite_code }}</text>
              <text class="text-xs text-white margin-left-sm fu-copy-invite" @click.stop="copyingInvite_code">{{ i18n['复制'] }}</text>
            </view>
          </view>
        </view>
        <view @click.stop="goSignin" class="text-df text-bold fu-signin">{{ i18n['每日签到'] }}</view>
      </view>
    </view>
    <!-- 用户信息 - 已登录 end -->

    <!-- 用户信息 - 未登录 start -->
    <view class="userInfo" v-else @click="handleJump" data-url="/pages/user/user/info/index">
      <view class="tui-msg-box">
        <view class="flex flex-sub align-center">
          <image src="/static/logo.png" class="block-108 round" mode="aspectFill"></image>
          <view class="margin-left">
            <view class="text-black text-xl text-white">{{ i18n['登录/注册'] }}</view>
          </view>
        </view>
        <view class="tui-msg-right"><text class="lg cuIcon-right"></text></view>
      </view>
    </view>
    <!-- 用户信息 - 未登录 end -->
    <!-- 快捷功能入口 start -->
    <!-- <view class="margin-lr margin-top bg-white radius-16 fu-month-in">
      <view class="flex my-order">
        <view class="item flex-sub text-center padding-sm fu-in-item" @click="handleJump" data-url="/pages/user/user/my-favorites/index">
          <image src="../../../../static/my/query-1.png" mode="aspectFit"></image>
          <view class="text-df text-black">{{ i18n['我的收藏'] }}</view>
        </view>
        <view class="item flex-sub text-center padding-sm fu-in-item" @click="handleJump" data-url="/pages/user/user/my-footprint/index">
          <image src="../../../../static/my/query-2.png" mode="aspectFit"></image>
          <view class="text-df text-black">{{ i18n['我的足迹'] }}</view>
        </view>
        <view class="item flex-sub text-center padding-sm fu-in-item" @click="handleJump" data-url="/pages/user/coupon/my-coupon/index">
          <image src="../../../../static/my/query-3.png" mode="aspectFit"></image>
          <view class="text-df text-black" style="white-space: nowrap;">{{ i18n['我的优惠券'] }}</view>
        </view>
        <view class="item flex-sub text-center padding-sm fu-in-item" @click="handleJump" data-url="/pages/user/wallet/my-wallet/index">
          <image src="../../../../static/my/query-4.png" mode="aspectFit"></image>
          <view class="text-df text-black">{{ i18n['我的钱包'] }}</view>
        </view>
      </view>
    </view> -->
    <!-- 快捷功能入口 end -->
    <!-- 我的订单 start -->
    <view class="margin-lr margin-top bg-white radius-16 fu-order-box">
      <view class="flex justify-between align-center padding-sm margin-top-sm">
        <view class="text-df text-black text-bold">{{ i18n['我的订单'] }}</view>
        <view class="text-sm text-gray" @click="handleJump" data-url="/pages/order/order-list/all-order/index">
          {{ i18n['查看全部'] }}
          <text class="cuIcon-right"></text>
        </view>
      </view>
      <view class="flex my-order padding-tb-sm">
        <view class="item flex-sub text-center" @click="handleJump" data-url="/pages/order/order-list/all-order/index?type=unpay">
          <image src="../../../../static/my/order-pic-1.png" mode="aspectFit"></image>
          <view class="txt">{{ i18n['待付款'] }}</view>
          <view class="jiaobiao" v-if="ordernum.no_pay != 0">{{ ordernum.no_pay }}</view>
        </view>
        <view class="item flex-sub text-center" @click="handleJump" data-url="/pages/order/order-list/all-order/index?type=unship">
          <image src="../../../../static/my/order-pic-2.png" mode="aspectFit"></image>
          <view class="txt">{{ i18n['待发货'] }}</view>
          <view class="jiaobiao" v-if="ordernum.deliver != 0">{{ ordernum.deliver }}</view>
        </view>
        <view class="item flex-sub text-center" @click="handleJump" data-url="/pages/order/order-list/all-order/index?type=unreceive">
          <image src="../../../../static/my/order-pic-3.png" mode="aspectFit"></image>
          <view class="txt">{{ i18n['待收货'] }}</view>
          <view class="jiaobiao" v-if="ordernum.receiv != 0">{{ ordernum.receiv }}</view>
        </view>
        <view class="item flex-sub text-center" @click="handleJump" data-url="/pages/order/order-list/all-order/index?type=finish">
          <image src="../../../../static/my/order-pic-4.png" mode="aspectFit"></image>
          <view class="txt">{{ i18n['待评价'] }}</view>
          <view class="jiaobiao" v-if="ordernum.evaluate != 0">{{ ordernum.evaluate }}</view>
        </view>
        <view class="item flex-sub text-center" @click="handleJump" data-url="/pages/order/order-list/all-order/index?type=refund">
          <image src="../../../../static/my/order-pic-5.png" mode="aspectFit"></image>
          <view class="txt">{{ i18n['退换/售后'] }}</view>
          <view class="jiaobiao" v-if="ordernum.refund != 0">{{ ordernum.refund }}</view>
        </view>
      </view>
    </view>
    <!-- 我的订单 end -->

    <!-- 列表导航 start -->
    <view class="margin-top-sm margin-lr bg-white radius-16">
      <view class="cu-list menu">
        <!-- #ifdef MP-WEIXIN -->
        <!-- <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/service-message/message/message-type/index">
          <view class="fu-iconfont ml-30"><image class="fu-list-pic" src="../../../../static/my/list-6.png" mode="aspectFit" /></view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['我的消息'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view> -->
        <!-- #endif -->
        <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/user/coupon/my-coupon/index">
          <view class="fu-iconfont ml-30"><image class="fu-list-pic" src="../../../../static/my/001.png" mode="aspectFit" /></view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['我的优惠券'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view>

        <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/user/user/my-favorites/index">
          <view class="fu-iconfont ml-30"><image class="fu-list-pic" src="../../../../static/my/002.png" mode="aspectFit" /></view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['我的收藏'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view>

        <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/user/user/my-footprint/index">
          <view class="fu-iconfont ml-30"><image class="fu-list-pic" src="../../../../static/my/003.png" mode="aspectFit" /></view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['我的足迹'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view>
        <!-- 帮助中心 -->
        <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/user/address/address-list/index">
          <view class="fu-iconfont ml-30">
            <image class="fu-list-pic" src="../../../../static/my/004.png" mode="aspectFit" />
          </view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['地址管理'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- <view class="flex align-center fu-list-item" @click="handleJump"
          data-url="/pages/distribution/my-distribution/index">
          <view class="fu-iconfont ml-30">
            <image class="fu-list-pic" src="../../../../static/my/list-3.png" mode="aspectFit" />
          </view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">分销中心</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view> -->

        <!-- <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/user/user/authentication/index">
          <view class="fu-iconfont ml-30">
            <image class="fu-list-pic" src="../../../../static/my/list-3.png" mode="aspectFit" />
          </view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">实名认证</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view> -->
       <!-- <view class="flex align-center fu-list-item" @click="handleJump" data-url="/pages/index/setting/setting/index">
          <view class="fu-iconfont ml-30"><image class="fu-list-pic" src="../../../../static/my/list-4.png" mode="aspectFit" /></view>
          <view class="solid-bottom fu-item-main">
            <text class="text-block text-df">{{ i18n['设置'] }}</text>
            <image class="list-arrow" src="../../../../static/my/right-arrow.png" mode="aspectFit"></image>
          </view>
        </view> -->
      </view>
    </view>
    <!-- 列表导航 end -->

    <!-- 断网检测 -->
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
/**
 * @author 刘畅
 */
export default {
  data() {
    return {
      ordernum: {
        deliver: 0, // {Number} 代发货
        evaluate: 0, // {Number} 待评价
        no_pay: 0, // {Number} 待付款
        receiv: 0, // {Number} 待收货
        refund: 0, // {Number} 售后
        msg_num: 0 // {Number} 订单角标
      },
      opacity: 0, // {Number} topBar的透明度
      messageNum: 0, // {Number} 右上角消息角标
      invite_code: null, // {String} 邀请码
      autograph: null, // {String} 个性签名
      user_signature: '', // {String} 用户输入的个性签名
      modalName: '', // {String} 等级规则弹框
      showBarTitle: false // {Boolean} 是否显示barTitle
    };
  },
  onShow() {
    if (global.token) {
      this.getInfo();
      this.getMessageNum();
      this.$store.dispatch('getCartList');
      this.getOrderTag();
    } else {
      this.ordernum = {
        deliver: 0,
        evaluate: 0,
        no_pay: 0,
        receiv: 0,
        refund: 0,
        msg_num: 0
      };
      this.$store.commit('setBadge', 0);
    }
  },
  computed: {
    // 用户信息
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  onReachBottom(e) {
    // 触底触发加载数据
    this.$refs.guess && this.$refs.guess.loadData();
  },
  onPageScroll(e) {},
  methods: {
    /**
     * @function
     * @description 获取未读消息数量
     */
    getMessageNum() {
      this.$api.post(global.apiUrls.postMessageNum).then(res => {
        if (res.data.code == 1) {
          this.messageNum = res.data.data;
        }
      });
    },
    /**
     * @event 点击实名认证
     * @description 去实名认证
     * @property {Number} this.$store.state.userInfo.certified - -1:未申请; 0:待审核;1:已通过;2:已拒绝;
     */
    goingAuthentication() {
      // 需要判断该用户是否认证通过，如果认证通过过就不需要进入了
      switch (this.$store.state.userInfo.certified) {
        case -1:
          this.$urouter.navigateTo('/pages/user/user/authentication/index');
          break;
        case 0:
          this.$message.info(this.i18n['您的申请正在审核中']);
          break;
        case 1:
          this.$message.info(this.i18n['您已认证通过']);
          break;
        case 2:
          this.$urouter.navigateTo('/pages/user/user/authentication/index');
          break;
        default:
          break;
      }
    },
    /**
     * @function
     * @description 获取订单角标+
     */
    getOrderTag() {
      this.$api
        .post(global.apiUrls.postOrderNum)
        .then(res => {
          console.log('订单数据', res);
          if (res.data.code == 1) {
            this.ordernum = res.data.data;
            if (this.ordernum.msg_num > 99) {
              this.ordernum.msg_num = '99+';
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * @function
     * @description 获取用户信息
     */
    getInfo() {
      this.$api
        .post(global.apiUrls.postGetUserInfo, {
          user_id: (global.userInfo && global.userInfo.id) || 0
        })
        .then(res => {
          console.log(res);
          res = res.data;
          if (res.code == 1) {
            this.invite_code = res.data.invite_code;
            this.autograph = res.data.autograph;
            this.$store.commit('updateUserInfo', res.data);
            this.$forceUpdate();
          }
          uni.stopPullDownRefresh();
        });
    },
    /**
     * @event 点击会员中心
     * @description 跳转到会员中心
     * @property {Boolean} this.$store.getters.isLogin - 用户是否登录
     * @property {Number} this.$store.state.userInfo.user_level - 用户的会员等级,大于等于1才是会员
     */
    memberJump() {
      this.$util.actionAuth(() => {
        this.$urouter.navigateTo('/pages/member/vip/orVip/index');
      });
    },
    /**
     * @event
     * @description 在弹窗里显示个性签名
     */
    onShowModel() {
      this.modalName = 'signature';
      this.user_signature = this.$store.state.userInfo.autograph;
    },
    /**
     * @event
     * @description 修改个性签名
     */
    editSignature() {
      this.$api
        .post(global.apiUrls.postEditSignature, {
          autograph: this.user_signature
        })
        .then(res => {
          console.log(res);
          res = res.data;
          if (res.code == 1) {
            this.modalName = '';
            this.userInfo.autograph = this.user_signature;
            uni.showToast({
              title: this.i18n['修改成功'],
              icon: 'none',
              duration: 2000
            });
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            });
          }
        });
    },
    /**
     * @event
     * @description 复制邀请码
     */
    copyingInvite_code() {
      const that = this;
      uni.setClipboardData({
        data: this.invite_code,
        success: function() {
          that.$message.info(that.i18n['复制成功']);
        }
      });
    },
    /**
     * @event
     * @description 去签到页面
     */
    goSignin() {
      this.$urouter.navigateTo('/pages/user/signin/signin-page/index');
    },
  }
};
</script>

<style lang="scss" scoped>
.my {
  padding-bottom: 32rpx;
  position: relative;
  // background-image: url(../../../../stati);
}

.radius-16 {
  border-radius: 16rpx;
  overflow: hidden;
}

.block-50 {
  width: 50rpx;
  min-width: 50rpx;
  height: 50rpx;
  min-height: 50rpx;
}

.block-32 {
  width: 32rpx;
  min-width: 32rpx;
  height: 32rpx;
  min-height: 32rpx;
}

.block-108 {
  width: 132rpx;
  min-width: 132rpx;
  height: 132rpx;
  min-height: 132rpx;
  border: 4rpx solid #ffffff;
}

.userInfo {
  margin-bottom: 20rpx;
  padding: 20rpx 0 0 30rpx;
  position: relative;
  z-index: 2;
}

.tui-msg-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 我的订单 start
.my-order {
  image {
    width: 50rpx;
    height: 50rpx;
  }

  .item {
    position: relative;
    .jiaobiao {
      position: absolute;
      top: -20rpx;
      right: 30rpx;
      color: #FFFFFF;
      font-size: 24rpx;
      background-color: #FF6464;
      border-radius: 100rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 38rpx;
      text-align: center;
      z-index: 9;
      transform: scale(0.65);
    }
  }
}

// 我的订单 end

.ml-30 {
  margin-right: 20rpx;
  margin-left: 10rpx;
  height: 40rpx;
}

// 头像旁边名字
.fu-headpic-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 128rpx;

  .fu-line-height {
    line-height: 34rpx;
  }
}

// 背景图片
.fu-my-background {
  position: absolute;
  top: 0;
  // z-index: -1;
  width: 100%;

  image {
    width: 100%;
  }
}

.fu-list-item {
  height: 110rpx;
  width: 100%;
  padding: 0 32rpx 0 32rpx;

  .fu-list-pic {
    width: 40rpx;
    height: 40rpx;
  }

  .list-arrow {
    width: 14rpx;
    height: 30rpx;
  }

  .fu-item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 110rpx;
    width: 100%;
  }
}

// 头像
.fu-top-pic {
  width: 40rpx;
  height: 40rpx;
}

// 复制标签
.fu-copy-invite {
  display: inline-block;
  width: 60rpx;
  height: 34rpx;
  text-align: center;
  line-height: 34rpx;
  border-radius: 6rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

// topBar功能入口
.fu-top-action {
  display: flex;

  .fu-top-pic {
    width: 40rpx;
    height: 40rpx;
  }

  .fu-message {
    position: relative;

    .fu-top-tag {
      position: absolute;
      top: -12rpx;
      right: -12rpx;
      /* width: 25rpx; */
      /* height: 25rpx; */
      /* padding:3rpx; */
      text-align: center;
      line-height: 25rpx;
      font-size: 24rpx;
      color: #ff6464;
      background-color: #fff;
      border: 1rpx solid #ff6464;
      width: auto;
      height: 32rpx;
      line-height: 32rpx;
      border-radius: 32rpx;
      min-width: 32rpx;
      padding: 0 4rpx;
    }
  }
}

// 修改签名弹窗
.cu-dialog2 {
  width: 560rpx;
  border-radius: 22rpx;
  background: #fff;

  .con_text {
    padding: 60rpx 0;
    color: #666;
    font-size: 30rpx;
    line-height: 44rpx;

    input {
      height: 60rpx;
      border-radius: 10rpx;
      padding-left: 10rpx;
    }
  }

  .cu-bar.flex {
    min-height: 80rpx;
    border-top: 2rpx solid #eee;

    view {
      flex: 1;
      text-align: center;
      line-height: 80rpx;
    }

    view:first-child {
      color: #999;
    }

    view:last-child {
      border-left: 2rpx solid #eee;
      color: #ee2633;
    }
  }
}
// 快捷功能入口
.fu-month-in {
  height: 158rpx;
  margin-top: 60rpx;
  position: relative;
  z-index: 2;
  .fu-in-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 158rpx;
  }
}
.fu-order-box{
  position: relative;
  z-index: 2;
}

// 签到
.fu-signin {
  width: 160rpx;
  height: 72rpx;
  text-align: center;
  line-height: 72rpx;
  background-color: #ffe36c;
  color: $theme;
  border-radius: 36rpx 0 0 36rpx;
}
.tui-msg-right{
  margin-right: 24rpx;
  color: #fff;
}
</style>
