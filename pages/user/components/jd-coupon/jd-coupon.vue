<template>
  <view class="coupon-box">
    <view class="left solid-right">
      <text>
        <text class="text-price"></text>
        <text class="">{{ discountPrice | filterPrice }}</text>
      </text>
    </view>
    <view class="right">
      <view class="content">
        <view class="text-333 text-bold text-lg text-cut">{{ name }}</view>
        <view class="text-999 text-sm">{{i18n['使用权限: 满']}}{{ limit | filterPrice }}{{i18n['元使用']}}</view>
        <view class="text-999 text-sm">{{i18n['有效期至:']}} {{ time }}</view>
      </view>
      <view class="action" :class="[isUse ? 'disabled' : '']" @click.stop="handleClick">{{ isUse ? i18n['已领取'] : i18n['立即领取']}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    discountPrice: {
      type: [String, Number]
    },
    name: {
      type: String
    },
    time: {
      type: String
    },
    limit: {
      type: [String, Number]
    },
    isUse: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    filterPrice(price) {
      return parseFloat(price);
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-box {
  height: 200rpx;
  display: flex;
  .right {
    flex: 1;
    background-color: #ffffff;
    border-radius: 16rpx;
    display: flex;
    overflow: hidden;
    .content {
      flex: 1;
      padding: 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      overflow: hidden;
    }
    .action {
      width: 60rpx;
      min-width: 60rpx;
      max-width: 60rpx;
      height: 100%;
      background: linear-gradient(126deg, #fa2033 0%, #ff6530 100%);
      font-family: PingFang SC;
      font-size: 28rpx;
      font-weight: 400;
      color: #fef0f0;
      writing-mode: tb-rl;
      letter-spacing: 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .action.disabled {
      color: #666666;
      background: #e1e1e1;
    }
  }
  .left {
    width: 200rpx;
    min-width: 200rpx;
    max-width: 200rpx;
    height: 100%;
    border-radius: 16rpx;
    color: #fef0f0;
    font-family: Arial;
    font-size: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(126deg, #fa2033 0%, #ff6530 100%);
    .text-price {
      font-size: 40rpx;
    }
  }
}
</style>
