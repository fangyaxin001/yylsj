<template>
  <view class="padding-lr padding-top">
    <swiper class="swiper" @change="swiperChange">
      <block v-for="(item, i) in navs" :key="i">
        <swiper-item>
			<view class="grid text-center col-5">
			  <block v-for="(ele, j) in item" :key="j">
			    <view class="sub-item flex flex-direction justify-center align-center" @click="navTo(ele.href, ele.is_login)">
            <view class="block-48">
              <fu-image :src="ele.thumb" mode="aspectFit" ></fu-image>
            </view>
			      <!-- <image class="block-48" :src="ele.thumb" mode="aspectFit" lazy-load></image> -->
			      <text class="text-sm text-333 margin-top-xs">{{ ele.name }}</text>
			    </view>
			  </block>
			</view>
        </swiper-item>
      </block>
    </swiper>
    <view class="padding-tb-xs flex justify-center">
      <view class="bar flex round overflow">
        <block v-for="(item, index) in navs" :key="index"><view class="bar_item bg-gray" :class="{ active: current == index }"></view></block>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @author
 * @description 金刚区布局
 * @property {Array.Object} navs - 导航信息
 * @property {Number} current - 当前是那个导航块
 */
export default {
  name: 'fu-grid',
  data() {
    return {
      navs: [],
      current: 0
    };
  },
  created() {
    this.getNavs();
  },
  methods: {
    /**
     * @function
     * @description 获取导航信息
     */
    getNavs() {
      this.$api
        .post(global.apiUrls.postHomeGrid, {
          typeid: 1
        })
        .then(res => {
          console.log('金刚区',res);
          if (res.data.code == 1) {
            let list = res.data.data;
            for (let i = 0, l = list.length; i < l; i += 5) {
              this.navs.push(list.slice(i, i + 5));
            }
          }
        });
    },
    /**
     * @event
     * @description 跳转到导航指向的页面
     * @param {String} path - 页面路径
     * @param {Number} auth - 用户是否登录
     */
    navTo(path, auth) {
      if (auth) {
        this.$util.actionAuth(() => {
          uni.navigateTo({
            url: path
          });
        });
      } else {
        uni.navigateTo({
          url: path
        });
      }
    },
    /**
     * @event
     * @description swiper滚动的时候
     * @param {Object} e - 原生事件
     */
    swiperChange(e) {
      this.current = e.detail.current;
    }
  },
  
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 160rpx;
}
.block-48 {
  width: 90rpx;
  min-width: 90rpx;
  height: 90rpx;
  min-height: 90rpx;
  image {
    width: 100%;
    height: 100%;
  }
}

.sub-item {
  position: relative;
  .jiaobiao {
    position: absolute;
    top: 10rpx;
    right: 20rpx;
    width: 35rpx;
    height: 35rpx;
    color: #fff;
    background: $fu-main-color;
    border-radius: 50% 50% 0 50%;
    font-size: 20rpx;
    text-align: center;
    line-height: 35rpx;
    z-index: 999;
  }
  .scale-up {
    width: 54rpx;
    height: 30rpx;
    line-height: 30rpx;
    right: 0;
    border-radius: 15rpx 15rpx 15rpx 0;
  }
}

.bar {
  .bar_item {
    width: 30rpx;
    height: 6rpx;
    background: #f2f3f5;
    border-radius: 6rpx;
  }
  .bar_item + .bar_item {
    margin-left: 10rpx;
  }
  .bar_item.active {
    background: $theme;
  }
}
.text-333 {
  color: #333333;
}

.fade {
  animation: fade 1.5s infinite;
}
@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.scale-up {
  animation: scale-up 1.5s infinite;
}
@keyframes scale-up {
  0% {
    transform: scale(0.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
