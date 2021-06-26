<template>
  <view class="page solid-top">
    <!-- 页面加载loading  start -->
    <fu-loading v-if="isShowLoading"></fu-loading>
    <!-- 页面加载loading end -->
    <!-- 协议内容 start -->
    <!-- <jyf-parser :html="body" v-else></jyf-parser> -->
    <view v-else>
      <rich-text :nodes="body"></rich-text>
    </view>
    <!-- 协议内容 end -->
    <!-- 网络监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 网络监测 end -->

    <!-- 测试复用页面修改情况 -->

  </view>
</template>

<script>
	import richText from '@/common/utils/richText.js';
  export default {
    data() {
      return {
        body: ' ', //协议内容
        isShowLoading: true, //页面加载loading
      };
    },
    /**
     * @param {Object} options id = 15（用户协议） 23（隐私协议）
     */
    onLoad(options) {
      // this.setNavigationBarTitle(this.i18n['隐私协议'])
      uni.setNavigationBarTitle({
        title: options.id == 15 ? this.i18n['用户协议'] : this.i18n['隐私协议']
      })
      this.getData(options.id)
    },

    methods: {
      /**
       * @description 获取协议内容
       * @param {Object} id = 15（用户协议） 23（隐私协议）
       */
      getData(id) {
        this.isShowLoading = true
        this.$api.post(global.apiUrls.postOperationGetColumn, {
          category_id: id,
        }).then(res => {
          this.isShowLoading = false
          var res = res.data
          if (res.code == 1) {
            this.body = richText.format(res.data.content);
          } else {
            this.body = ''
          }
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  // 页面内容 start
  .page {
    background: #fff;
    overflow: hidden;
    height: 100vh;
    padding: 20upx;
    overflow-y: scroll;
    line-height: 48rpx;
    font-size: 32rpx;
  }

  // 页面内容 end
</style>
