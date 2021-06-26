<template>
  <view class="page solid-top">
    <!-- header start -->
    <view class="bg-white">
      <view class="header">
        <view class="icon-success"><image src="../../static/success.png" mode="widthFix"></image></view>
        <view class="margin-top text-bold text-000 text-lg">{{ i18n['支付成功'] }}</view>
      </view>
      <!-- header end -->
      <view class="margin-top margin-bottom-90 text-center text-666 text-df">
        <view>支付方式 {{ pay_type }}</view>
        <view class="margin-top-xs">支付时间 {{ pay_time | formatDate }}</view>
      </view>
      <!-- btn start -->
      <view class="bottom-action">
        <navigator open-type="redirect" hover-class="“none”" url="/pages/order/order-list/all-order/index">
          <button class="cu-btn round  bg-red fu-bgcred">{{ i18n['查看订单'] }}</button>
        </navigator>
        <navigator open-type="reLaunch" hover-class="“none”" url="/pages/tab/home/shopindex/index">
          <button class="cu-btn round lines-red ">{{ i18n['返回首页'] }}</button>
        </navigator>
      </view>
      <!-- btn end -->
    </view>
    <!-- 断网监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网监测 end -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      couponModel: false, //抽奖弹框是否显示
      myCoupon: {}, //领取优惠券信息
      submit: global.i18n['请领取'], //领取优惠券提示
      order_sn: '', //订单号
      list: [], //抽奖数据
      winning: {
        //中奖id
        id: 0
      },
      selectItem: {}, //抽奖选中数据
      pay_type: '', //支付方式
      pay_time: '' //支付时间
    };
  },
  /**
   * @description 为你推荐上拉加载更多数据
   * @param {Object} e 事件对象
   */
  onReachBottom(e) {
    // this.$refs.guess && this.$refs.guess.loadData();
  },
  /**
   * @param {Object} options 入参
   */
  onLoad(options) {
    this.setNavigationBarTitle(this.i18n['支付结果']);
    // 订单号
    this.order_sn = options.order_sn;
    this.getOrderInfo(options.order_sn);
  },
  methods: {
    /**
     * @author dengdongfang
     * @date 2021-5-180
     * @description 获取支付方式，支付时间
     * @param {String} 订单号
     */
    getOrderInfo(order_sn) {
      this.$api
        .post(global.apiUrls.getOrderInfo, {
          order_sn: order_sn
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.pay_type = res.data.data.pay_type;
            this.pay_time = res.data.data.pay_time * 1000;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * @description 获取抽奖数据
     */
    getWinningList() {
      this.$api.post(global.apiUrls.postWinningList).then(res => {
        console.log('获取数组', res);
        if (res.data.code == 1) {
          // slice(0,9)
          this.list = res.data.data.list || [];
          this.winning = res.data.data.win || {
            id: 0
          };
        }
      });
    },
    /**
     * @description 领取优惠券跳转
     */
    handleReceive() {
      const that = this;
      this.$api
        .post(global.apiUrls.getSendGift, {
          user_id: global.userInfo.id,
          id: this.winning.id,
          type: this.winning.type
        })
        .then(res => {
          console.log('领取跳转', res);
          that.couponModel = false;
          if (res.data.code == 1) {
            that.$message.success(this.i18n['领取成功']);
            setTimeout(function() {
              uni.reLaunch({
                url: '/pages/tab/home/shopindex'
              });
            }, 2000);
          } else {
            uni.showToast({
              title: res.data.msg || this.i18n['领取失败，请重新操作'],
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.showToast({
            title: this.i18n['领取失败，请重新操作'],
            icon: 'none'
          });
        });
    },
    /**
     * @description 关闭抽奖弹窗
     */
    handleClose() {
      this.couponModel = false;
    },
    /**
     * @description 领取优惠券
     */
    receive() {
      if (this.submit == this.i18n['已领取']) {
        this.$message.info(this.i18n['你已经成功领取，请勿重复领取']);
        return false;
      }
      this.$api
        .post(global.apiUrls.postReceiveCoupon, {
          user_id: global.userInfo.id,
          cid: this.myCoupon.id
        })
        .then(res => {
          console.log('?????', res);
          if (res.data.code == 1) {
            this.submit = this.i18n['已领取'];
            this.$message.info(this.i18n['领取成功']);
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        });
    },
    /**
     * @description 获取优惠券
     */
    getCoupon() {
      this.$api
        .post(global.apiUrls.getPaySuccessCoupon, {
          user_id: global.userInfo.id
        })
        .then(res => {
          console.log('可用优惠卷', res);
          if (res.data.code == 1) {
            this.myCoupon = res.data.data;
            console.log(this.myCoupon, 888888);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * @param {Object} item 抽奖抽中后的数据返回
     */
    handleSelect(item) {
      this.selectItem = item;
      this.couponModel = true;
    }
  }
};
</script>

<style lang="scss" scoped>
// 付款成功 start
.icon-success {
  width: 250rpx;
  height: 180rpx;
  margin-top: 88rpx;
  image {
    width: 250rpx;
    height: 180rpx;
  }
}
// 付款成功 end
.page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.buttom {
  margin-left: 10rpx;
  border: 1px solid $theme;
  color: $theme;
  border-radius: 15rpx;
  padding: 5rpx 10rpx;
}
// btn start
.bottom-action {
  // padding-top: 100rpx;
  // padding-left: 32rpx;
  // padding-right: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin: 0 auto;
    width: 320rpx;
    height: 72rpx;
    background-color: #fff;
    line-height: 72rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
  }

  .fu-bgcred {
    background-color: $fu-type-error;
    margin-bottom: 32rpx;
  }
}
// btn end
// 抽奖弹框 start
.model-notice-box {
  min-width: 500rpx;
  background-color: #fdf7e9;

  .title {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(206, 133, 45, 1);
  }

  .content {
    padding: 0 32rpx 20rpx;
    color: #666666;
    font-size: 28rpx;
    margin: 0 auto;
    text-align: center;

    image {
      width: 200rpx;
      height: 150rpx;
      margin: 0 auto;
    }

    .desc {
      display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
      -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
      text-overflow: ellipsis; /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
      -webkit-line-clamp: 1;
      overflow: hidden;
      min-height: 40rpx;
      width: 400rpx;
      text-align: center;
      margin: 0 auto;
      line-height: 40rpx;
      color: $theme;
    }
  }

  .bottom {
    text-align: center;
    font-size: 24rpx;
    width: 150rpx;
    margin: 0 auto;
    margin-left: 175rpx;
    margin-bottom: 30rpx;
  }
}
// 抽奖弹框 end
.margin-bottom-90 {
  margin-bottom: 90rpx;
}
</style>
