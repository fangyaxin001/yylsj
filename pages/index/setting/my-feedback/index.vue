<template>
  <view class="page">

    <!-- 数据加载动画 start -->
    <fu-loading v-if="isShowLoading"></fu-loading>
    <!-- 数据加载动画 end -->
    <block v-else>
      <!-- 反馈列表 start -->
      <view class="feedback-list">
        <view class="feedback-list-item" v-for="(item, index) in list" :key="index">
          <view class="flex item-list">
            <view class="avatar overHidden">
              <fu-image :src="thumb" mode="aspectFill"></fu-image>
            </view>
            <view class="item-desc" >
              <view   class="margin-bottom content-body flex">
                <view  class="write-content"  :class="[ (item.isMoreLine &&  item.isOpent) ? '' : 'text-cut-2']" :id="'content-desc-' + item.id ">{{item.body}}</view>
               <view  class="direction-position open_close flex flex-direction "  v-if="item.isMoreLine"  @click="hanldeOpenOrClose(item)">
                  <text v-if="item.isOpent"  class=" orange_desc  cuIcon-fold lg text-gray"></text>
                  <text  v-else  class=" orange_desc cuIcon-unfold lg text-gray"></text>
                </view>
              </view>
              <view class="img-list " v-if="item.thumb.length">
                <block v-for="(imgItem, imgIndex) in item.thumb" :key="imgIndex">
                  <view class="img-list-item " @tap="ViewImage(item.thumb, imgIndex)">
                    <fu-image radius='12rpx' :src="imgItem" mode="aspectFill"></fu-image>
                  </view>
                </block>
              </view>
              <view class="concart"> {{i18n['联系方式']}}:<text class="margin-left-sm">{{item.contact}}</text></view>
              <view class="text-gray feedback-type"> {{i18n['反馈类型']}}:<text class="margin-left-sm">{{item.type || '无'}}</text></view>
              <view class="text-gray feedback-type">{{i18n['反馈时间']}}:<text class="margin-left-sm">{{item.create_time | formatDate('YYYY-MM-DD')}}
                </text></view>
              <view class="flex replay-content" v-if="item.replay">
                <view class="replay-desc"> {{i18n['平台回复']}}: </view>
                <view class="replay-text">{{item.replay}}</view>
              </view>

            </view>
          </view>
        </view>
      </view>
      <!-- 反馈列表 end -->
      <!-- 无数据 start -->
      <view v-if="isInitEnd" class="text-xl text-center text-gray flex flex-direction align-center justify-center">
        <image src="/static/empty/message.png" mode="widthFix" style="width:400rpx;"></image>
        <text class="margin-top text-df">{{i18n['暂无反馈内容']}}</text>
      </view>
      <!-- 无数据 end -->
    </block>
    <!-- 断网监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网监测 end -->

  </view>
</template>

<script>
  export default {
    data() {
      return {
        isShowLoading: false, //数据加载动画
        isInitEnd: false, //  数据为空true
        list: [], //列表数据
        thumb: '',
        isOpent:true,
      }
    },
    onLoad() {
      this.setNavigationBarTitle(this.i18n['历史反馈']);
      this.thumb = global.userInfo.head_img
      // 获取反馈数据
      this.get_list();
    },
    methods: {
      hanldeOpenOrClose(item){
         item.isOpent = !item.isOpent
         this.$forceUpdate()
      },

      // 计算位置
      computedPos() {
        const query = uni.createSelectorQuery().in(this);

        this.list.forEach((item, index) => {
          query.select('#content-desc-' + item.id).boundingClientRect(data => {
            console.log(data,'.content-desc-' + item.id)
             item.height = data.height
             if(data.height > 60){
                item.isMoreLine = true //是否为多行
                item.isOpent = false  //是否显示更多

             }else{
                 item.isMoreLine = false
                 item.isOpent = true

             }
this.$forceUpdate();
            // this.$set(this.tabs[index], 'top', data.top);
          }).exec();
        })
        // this.$forceUpdate()
        console.log( this.list,8888)
      },


      /**
       * @description 获取反馈数据
       */
      get_list() {
        let that = this
        // 开启数据加载动画
        this.isShowLoading = true;
        this.$api.get(global.apiUrls.myFeedback).then(res => {
          if (res.data.code == 1) {
            this.list = JSON.parse(JSON.stringify(res.data.data));
            // 数据为空时显示空状态
            if (res.data.data.length == 0) {
              this.isInitEnd = true;
            }else{
              this.list.forEach(item =>{
                item.isMoreLine = true
                item.isOpent = true
              })
              setTimeout(function(){
              that.$nextTick(() => {
                that.computedPos();
              });

            },0)
            }

     


          } else {
            // 数据为空
            this.isInitEnd = true;
            // 数据加载失败提示
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
          // 关闭数据加载动画
          this.isShowLoading = false;
        }).catch(err => {
          // 数据加载失败
          this.isInitEnd = true;
          // 关闭数据加载动画
          this.isShowLoading = false;
        });
      },

      /**
       * @description 预览图片
       * @param {Object} list 图片数组
       * @param {String} index 当前图片链接
       */
      ViewImage(list, index) {
        uni.previewImage({
          urls: list,
          current: index
        });
      },
    }
  }
</script>

<style lang="scss">
  .page {
    // height: 100%;
    min-height: 100vh;
    background: white !important;
  }

  .feedback-list {
    border-top: 1rpx solid #F1F1F1;
    padding: 0 32rpx;
  }

  .feedback-list .feedback-list-item:last-child {
    padding-bottom: 40rpx !important;
  }

  .item-list {
    padding-bottom: 30rpx;
    border-top: 1rpx solid #F1F1F1;
    padding-top: 20rpx;

    .avatar {
      height: 80rpx;
      width: 80rpx;
      min-width: 80rpx;
      min-height: 80rpx;
      border-radius: 50%;

      image {
        height: 80rpx;
        width: 80rpx;
        border-radius: 50%;
      }
    }

    .item-desc {
      padding-left: 16rpx;
      .content-body{
        position: relative;
      }

      .write-content {
        width: calc(100% - 32);
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 46rpx;
        color: #333333;
        opacity: 1;

      }
      .open_close{
         height: 32rpx;
         width: 32rpx;
         border:1rpx solid #FF6464 ;
         text-align: text;
         line-height: 32rpx;
         background: white;
         font-size: 26rpx;
         background-color: #FFF6F6;
         border-radius: 4rpx;
      }
      .orange_desc{
          color: #FF6464 !important;
      }
      .direction-position{
          position: absolute;
          right:4rpx;
          bottom: 6rpx;
      }

      // 反馈图片 start
      .img-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        .img-list-item {
          width: 180rpx;
          height: 180rpx;
          min-width: 180rpx;
          min-height: 180rpx;
          border-radius: 20rpx;
          margin-right: 16rpx;
          margin-bottom: 16rpx;
        }
      }

      // 反馈图片 end
      .concart {
        padding-bottom: 20rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 46rpx;
        color: #333333;
        opacity: 1;
      }

      .feedback-type {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 46rpx;
        color: #999999;
      }

      // 客服回复 start
      .replay-content {
        margin-top: 32rpx;
        padding: 24rpx 16rpx;
        border-radius: 10rpx;
        background: #F8F8F8;
        opacity: 1;
        font-size:  28rpx ;

        .replay-desc {
          width: 190rpx;
          white-space:nowrap;
          color: #496A9D !important;
        }

        .replay-text {
          width: 100%;
          line-height: 40rpx;
        }
      }

      // 客服回复 end
    }
  }

  .feedback-list .feedback-list-item:first-child {
    padding-top: 0rpx !important;
  }

  .text-cut-2 {

  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  /*! autoprefixer: off */

  -webkit-box-orient: vertical;
  }
  // 反馈列表 end
</style>
