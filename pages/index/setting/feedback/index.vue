<template>
  <view class="change">
    <!-- 标题栏 start -->
    <fu-custom :isBack="true" bgColor="bg-white" class="header">
      <block slot="content">{{ i18n['我要反馈'] }}</block>
      <block slot="right">
        <view @click="routeHistory" class="text-red title-right ">{{ i18n['反馈记录'] }}</view>
      </block>
    </fu-custom>

    <form @submit="formSubmit">
      <view class="warp">
        <!-- 反馈类型 start -->
        <view class="feedback">
          <view class="feedback-top padding-tb">{{ i18n['反馈类型'] }}</view>
          <view class="feedback-reason text-gray">
            <view class="margin-top-xs text-cut" v-for="(item, index) in types" :key="index" :class="item.id == active ? 'active' : ''" @click="reason(item.id)">
              {{ item.title }}
            </view>
          </view>
        </view>
        <!-- 反馈类型 end -->
        <!-- 反馈内容 start -->
        <view class="feedback-content ">
          <view class="block-box margin-top-lg"></view>
          <view class="feedback-content-top padding">{{ i18n['反馈内容'] }}</view>
          <view class="content">
            <textarea
              class="textarea"
              name="body"
              placeholder-class="text-gray"
              v-model="body"
              maxlength="200"
              :placeholder="i18n['问题描述的越详细.有助于我们更快的解决问题']"
              placeholder-style="font-size:28rpx"
            />
          </view>
        </view>
        <!-- 反馈内容 end -->
        <!-- 图片 start-->
        <view class="cu-form-group">
          <view class="grid col-4 grid-square flex-sub">
            <view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="viewImage(index)" :data-url="index">
              <view class="image"><fu-image :src="item.path" mode="aspectFill"></fu-image></view>
              <view class="cu-tag bg-red" @tap.stop="delImg" :data-index="index"><text class="cuIcon-close"></text></view>
            </view>
            <view class="solids" @tap="chooseImage" v-if="imgList.length < 6">
              <!-- <text class="cuIcon-cameraadd"></text> -->
              <image src="../../static/add-img.png" mode="" class="add-img"></image>
            </view>
          </view>
        </view>
        <view class="upload_desc">{{ i18n['请上传应用截图，最多上传'] }}{{ count }}{{ i18n['张'] }}</view>
        <!-- 图片 end -->
      </view>
      <!-- 联系方式 - 手机号码 start -->
      <view class="feedback-contact ">
        <view class="feedback-contact-top padding-top">{{ i18n['请留下您的联系方式'] }}</view>
        <view class="feedback-contact-content flex"><input name="contact" placeholder-class="text-gray" v-model="contact" :placeholder="i18n['手机号/邮箱/QQ号']" /></view>
      </view>
      <!-- 联系方式 - 手机号码 end -->

      <view class="bg-white footer-yy">
        <button class="btn-primary  round" formType="submit" type="primary">{{ i18n['提交'] }}</button>
      </view>
    </form>
    <!-- 断网检测 -->
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
// 引入规则校验文件
import { validate } from '@/common/utils/index';
// import { UploadImg } from '@/common/utils/upload-image.js'
// 引入上传图片公共方法
import { UploadImage } from '@/common/utils/index';
// 引入上传公共url
import { UPLOAD_IMAGE_URL } from '@/common/config.js';
export default {
  data() {
    return {
      // 是否必填信息 默认初始值必填
      types: [], // 反馈类型 调用接口获取
      active: 1, // 反馈类型选中  默认选中第一个
      imgList: [], // 上传图片数组
      count: 6, //做多上传几张图片
      body: '', //反馈内容
      contact: '', // 手机号码
      // 显示状态类型判断
      thumb_status: '1' // 是否显示图片上传
    };
  },
  computed: {
    /**
     * 反馈内容字数计算
     */
    bodyLen() {
      return this.body.length;
    }
  },
  onLoad() {
    // 获取反馈类型数据
    this.get_feedback_type();
  },

  methods: {
    /**
     * @description  查看历史反馈
     */
    routeHistory() {
      uni.navigateTo({
        url: '/pages/index/setting/my-feedback/index'
      });
    },
    /**
     * @description 选择反馈类型
     * @param {Object} type反馈类型id
     */
    reason(type) {
      this.active = type;
    },
    /**
     * @description 获取反馈类型数据
     */
    get_feedback_type() {
      let that = this;
      this.$api
        .post(global.apiUrls.feedbackTypes)
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            let result = res.data.data;
            that.types = result.types; //获取反馈类型数据
            that.active = result.types[0] && result.types[0].id; //默认选中第一个反馈类型
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * @description 图片上传
     */
    chooseImage() {
      let self = this;
      console.log('可以选择的图片数量', self.count - self.imgList.length);
      // 从相册中选择图片
      uni.chooseImage({
        count: self.count - self.imgList.length, // 默认3
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;

          // 开始上传
          new UploadImage(tempFilePaths, {
            complete: function(res) {
              console.log(res);
              // 上传成功 返回数据格式为数组 [ { id: '', path: '' } ]
              self.imgList.push(...res);
            }
          });
        }
      });
    },
    /**
     * @description 图片预览
     * @param {Object} inx图片预览数据
     */
    viewImage(inx) {
      let arr = this.imgList.map(item => {
        return item.path;
      });
      uni.previewImage({
        urls: arr,
        current: inx
      });
    },
    /**
     * @description 删除图片事件
     * @param {Object} e事件参数
     * e.currentTarget.dataset.index需要删除的图片下标
     */
    delImg(e) {
      this.$util.showModal({
        title: this.i18n['友情提示'],
        content: this.i18n['确定要删除图片吗？'],
        cancelText: this.i18n['取消'],
        confirmText: this.i18n['确定'],
        success: res => {
          if (res.confirm) {
            // 确定删除从数组中删除图片
            this.imgList.splice(e.currentTarget.dataset.index, 1);
          }
        }
      });
    },
    /**
     * @description 反馈提交
     * @param {Object} e事件参数
     * e.detail.value 获取表单输入值
     */
    formSubmit(e) {
      let _this = this;
      //进行表单检查
      var formData = e.detail.value;
      // 选中反馈类型赋值
      formData.type = this.active;

      // 对图片进行处理操作
      let imgarr = this.imgList.map(item => {
        return item.id;
      });
      formData.thumb = imgarr.join(',');

      // 对表单数据进行校验，
      let errMsg = this.doValidate(formData);
      if (errMsg) {
        this.$message.info(errMsg);
        return;
      }
      console.log(errMsg, formData);
      // 提交数据
      this.$api.post(global.apiUrls.feedbackAdd, formData).then(res => {
        this.$message.info(res.data.msg);
        console.log(res);
        if (res.data.code == 1) {
          // 提交成功返回上页面
          setTimeout(() => {
            uni.navigateBack();
            // _this.$urouter.redirectTo('/pages/index/setting/my-feedback');
          }, 1200);
        }
      });
    },

    /**
     * @description 进行表单校验
     * @param {Object} formData要校验的表单数据
     */
    doValidate(formData) {
      let { body, contact, qq_contact, email_contact } = formData;
      console.log(body, contact);
      if (!body || !body.trim()) {
        return this.i18n['反馈内容不能为空'];
      }
      // if ( !contact || !contact.trim()) {
      //   return  that.i18n['请留下你的联系方式'] ;
      // }

      return '';
    }
  }
};
</script>

<style lang="scss">
page {
  .header {
    border-bottom: 1px solid #f1f1f1;
    .title-right {
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ff6464;
    }
  }

  font-size: 28upx;
  color: #333;
  .change {
    min-height: 100vh;
    background-color: white;
    .warp {
      width: 100%;
      background: #fff;
      padding-bottom: 20upx;
      border-bottom: 20upx solid #f6f6f6;
      // 反馈类型 start
      .feedback {
        padding: 0 25upx;
        .feedback-top {
          margin-bottom: 24upx;
          height: 30upx;
          line-height: 30upx;

          color: $uni-text-color;
          font-size: $uni-font-size-lg;
          font-weight: bold;
        }
        .feedback-reason {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          .margin-top-xs {
            padding: 20rpx 40rpx;
            text-align: center;
            font-size: 26upx;
            border-radius: 10upx;
            border: 1px solid #d1d1d1;
            margin-right: 20rpx;
            margin-top: 20rpx;
            &.active {
              color: $uni-text-color-inverse;
              background: linear-gradient(270deg, rgba(241, 35, 19, 1) 0%, rgba(255, 187, 42, 1) 150%);
            }
          }
        }
      }
      .block-box {
        background-color: #f1f1f1;
        height: 20rpx;
        width: 100%;
      }
      // 反馈类型 end
      // 反馈内容 start
      .feedback-content {
        margin-top: 20rpx;
        padding: 0 0upx;
        .feedback-content-top {
          margin-top: 20rpx;
          margin-bottom: 16upx;
          height: 30upx;
          line-height: 30upx;
          color: $uni-text-color;
          font-size: $uni-font-size-lg;
          font-weight: bold;
        }
        .content {
          padding: 24rpx;
          .textarea {
            width: 100%;
            min-height: 200rpx;
            font-size: 32rpx;
            color: #333333;
          }
        }
        image {
          width: 164upx;
          height: 164upx;
          margin-bottom: 18upx;
        }
      }
      // 反馈内容 end
      .upload_desc {
        width: 100%;
        height: 33rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 33rpx;
        color: #bfbfbf;
        opacity: 1;
        padding: 0 25upx;
      }
    }
    .image {
      width: 164upx;
      height: 164upx;
      margin-bottom: 18upx;
    }
    // 反馈联系方式 start
    .feedback-contact {
      padding: 0 25upx;
      background: #fff;
      .feedback-contact-top {
        height: 80upx;
        color: $uni-text-color;
        font-size: $uni-font-size-lg;
        font-weight: bold;
      }
      .feedback-contact-content {
        input {
          padding-top: 30rpx;
          padding-bottom: 10rpx;
          height: 100upx;
          width: 100%;
          font-size: 30rpx;
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: center;
          border-bottom: 1upx solid #eee;
        }
      }
    }
    // 反馈练习方式 end
  }
}
// 反馈提交 start
.footer-yy {
  padding-top: 60upx;
  padding-bottom: 100upx;
  button {
    width: 95%;
    background: linear-gradient(270deg, rgba(241, 35, 19, 1) 0%, rgba(255, 187, 42, 1) 200%);
    // background-color:$fu-main-color !important;
  }
}
.btn-primary {
  width: 686rpx;
  height: 88rpx;
  background: linear-gradient(90deg, #ff6530 0%, #fa2033 100%);
  opacity: 1;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
}
// 反馈提交 end
// 是否必填 start
.no-require {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #999999;
}

// 是否必填 end
.add-img {
  width: 160rpx;
  height: 160rpx;
}
</style>
