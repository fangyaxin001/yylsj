<template>
  <fu-popup v-model="visible" mode="center" :maskClick="true">
    <view class="wrap" :style="{ 'background-image': 'url(' + bgImg + ')' }">
      <view class="coupon_content">
        <view class="flex coupon_title">
          <view class="flex-sub text-center text-white">{{i18n['领取优惠券']}}</view>
        </view>
        <view
          class="items"
          :style="{ 'background-image': 'url(' + itemImg + ')' }"
          v-for="(item, index) in lists"
          :key="index"
        >
          <view class="left">
            <text>{{ parseInt(item.money) }}</text>
          </view>
          <view class="center">
            <text>{{ item.name }}</text>
            <view>{{i18n['请']}}{{ item.end_time | parseTime }}{{i18n['前领取']}}</view>
          </view>
          <view class="right">
            <view class="buttons" @click.stop.prevent="receive(item)">
             {{i18n['立即领取']}}
            </view>
          </view>
        </view>
      </view>
    </view>
  </fu-popup>
</template>

<script>
export default {
  data() {
    return {
      bgImg: require("./static/index-coupon.png"),
      itemImg: require("./static/coupon-item.png"),
      lists: [],
      visible: false,
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  filters: {
    parseTime(val) {
      return val.split(" ")[0];
    },
  },
  methods: {
    // 获取首页优惠券弹窗列表
    getCoupon() {
      this.$api
        .get(global.apiUrls.getCouponList, {
          method: 1,
          user_id: this.$store.getters.uid,
        })
        .then((res) => {
          console.log("优惠券弹窗数据", res);
          res = res.data;
          if (res.code == 1) {
            let list = res.data.filter(item => item.is_receive == 0);
            this.lists = list.splice(0,4);
            if (this.lists.length == 0) {
              this.closePopup();
            } else {
              this.openPopup();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 展示优惠券弹窗
    openPopup() {
      this.visible = true;
    },
    // 关闭优惠券弹窗
    closePopup() {
      this.visible = false;
    },
    async receive(item) {
      this.$util.actionAuth(() => {
        this.$api
          .post(global.apiUrls.postReceiveCoupon, {
            cid: item.id,
          })
          .then((res) => {
            if (res.code == 1) {
              this.closePopup();
              this.$message.info(this.i18n["领取成功"]);
            } else if (res.code == 0) {
              this.closePopup();
              this.$message.info(res.msg);
            } else {
              this.$message.info(res.msg);
            }
          })
          .catch((err) => {
            this.closePopup();
          });
      });
    },
  },
  created() {
    this.getCoupon();
  },
};
</script>

<style lang="scss" scoped>
.block-85 {
  width: 85upx;
  height: 85upx;
}

.block-60 {
  width: 60rpx;
  min-width: 60rpx;
  height: 60rpx;
  min-height: 60rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

.action-close {
  position: fixed;
  bottom: 280rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.height-200 {
  height: 200upx;
}

.wrap {
  width: 604rpx;
  overflow: hidden;
  background-size: 100%;
  background-repeat: no-repeat;

  .close_Popup {
    position: fixed;
    right: 30rpx;
    top: 30rpx;
    font-size: 48rpx;
  }

  .coupon_content {
    width: 604rpx;
    font-size: 48rpx;
    padding: 190rpx 40rpx 20rpx 20rpx;

    .coupon_title {
      padding-bottom: 40rpx;
    }

    .items {
      width: 100%;
      height: 120rpx;
      background-size: 100% 100%;
      display: flex;
      margin-bottom: 16rpx;

      .left {
        width: 150rpx;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 42rpx;
        color: $theme;
      }

      .center {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 32rpx 0;

        text {
          font-size: 28rpx;
          color: #333333;
        }

        view {
          font-size: 20rpx;
          color: #999999;
        }
      }

      .right {
        width: 120rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .buttons {
          width: 80rpx;
          color: $theme;
          font-size: 30rpx;
          line-height: 46rpx;
          text-align: center;
        }

        .disabled {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
