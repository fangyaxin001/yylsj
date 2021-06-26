<template>
  <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" @change="swiperChange">
    <swiper-item v-for="(item, index) in lists" :key="index" @click="navTo(item.href)">
      <!-- <image :src="item.thumb" mode="aspectFill" ></image> -->
      <fu-image :src="item.thumb" mode="aspectFill"></fu-image>
      <!-- <video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video> -->
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  props: {
    lists: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted(){
    console.log('this.lists',this.lists)
  },
  methods: {
    navTo(path) {
      if (path) {
        this.$urouter.navigateTo(path);
      }
    },
    swiperChange(e) {
      let rgb = this.lists[e.detail.current].rgb;
      if (rgb) {
        this.$emit('change', rgb);
      }
    }
  }
};
</script>

<style lang="scss">
.swiper-box {
  overflow: hidden;
  border-radius: 16rpx;
  /* 兼容IOS，否则在swiper组件内的布局都不受border-radius和overflow的约束 */
  // transform: translateY(0);
}

.swiper-item-img {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  // border-radius: 8rpx;
  //   	overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8rpx;
  /* 兼容IOS，否则在swiper组件内的布局都不受border-radius和overflow的约束 */
  transform: translateY(0);
}
.screen-swiper {
  min-height: initial;
  height: 100%;
  border-radius: 8rpx;
  overflow: hidden;
  /* 兼容IOS，否则在swiper组件内的布局都不受border-radius和overflow的约束 */
  transform: translateY(0);
}
</style>
