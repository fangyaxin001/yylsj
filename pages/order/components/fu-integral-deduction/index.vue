<template>
  <fu-popup v-model="show" mode="bottom" :safe-area-inset-bottom="true" :border-radius="24">
    <view class="padding">
      <view class="flex justify-between padding-bottom">
        <view class="flex-sub text-center">{{ i18n['积分抵扣'] }}</view>
        <view class="close-box" @tap="close"><text class="cuIcon-close"></text></view>
      </view>
      <scroll-view class="container" scroll-y>
        <block>
          <view class="flex justify-between">
            <view>
              <text>{{ i18n['账户积分数'] }}：</text>
              <text class=" text-blod text-black">{{ info.score }}</text>
            </view>
            <view>
              <text class="margin-right-sm ">{{ i18n['本单'] }}</text>
              <text v-if="isSelect" class="text-df fu-cred text-bold">
                {{ i18n['已减'] }}
                <text class="text-price"></text>
                {{ info.reduce_money }}
              </text>
              <text v-else class="text-df fu-cred text-bold">
                {{ i18n['积分可减'] }}
                <text class="text-price"></text>
                {{ info.reduce_money }}
              </text>
            </view>
          </view>
          <view class="pay-type-list">
            <view class="type-item b-b" @click="radioChange">
              <view class="text-bold">
                {{ i18n['抵扣'] }}
                <text class="text-price  fu-cred">{{ info.reduce_money }}</text>
                {{ i18n['使用'] }}{{ info.integral_reduce }}{{ i18n['积分'] }}
              </view>
              <label class="radio"><radio class="radio-scale" :color="colorTheme" :checked="isSelect" /></label>
            </view>
          </view>
          <button type="warn" class="submit-btn" @click="handeSubmit">
            <text>{{ i18n['提交'] }}</text>
          </button>
        </block>
      </scroll-view>
    </view>
  </fu-popup>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      isSelect: false,
      curTab: 0
    };
  },
  watch: {
    addrs(val) {
      console.log('val', val);
      if (val.length != 0) {
        let cur = val.find(item => item.is_default == 1);
        if (cur) {
          this.curTab = cur.address_id;
          this.$emit('change', cur);
        } else {
          this.curTab = val[0].address_id;
          this.$emit('change', val[0]);
        }
      }
    }
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    radioChange() {
      this.isSelect = !this.isSelect;
    },
    handeSubmit() {
      this.$emit('hanldeSelect', this.isSelect);
      this.close();
    },
    chooseOther() {
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  /* height: 600rpx; */
}
.text-999 {
  color: #999999;
}
.radio-scale {
  transform: scale(0.7);
}
.uni-radio-input:hover {
  border: 1px solid #d1d1d1 !important;
}
uni-radio:not([disabled]) .uni-radio-input:hover {
  border-color: #d1d1d1 !important;
}
.pay-type-list {
  background-color: #fff;
  // padding-left: 20upx;
  .type-item {
    height: 120upx;
    padding: 20upx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-right: 60upx;
    font-size: 30upx;
    position: relative;
  }
}

.submit-btn {
  border-radius: 48rpx;
  margin: 20rpx 0rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: $bgtheme !important;
  font-size: 30rpx;
}
</style>
