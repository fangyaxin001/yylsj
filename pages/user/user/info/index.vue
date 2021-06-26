<template>
  <view class="grace-body">
    <fu-custom bgColor="bg-white" :isBack="true" :isBottom="true">
      <block slot="content">{{i18n['我的资料']}}</block>
    </fu-custom>
    <!-- 个人资料表单 start -->
    <form @submit="formSubmit" class="grace-form grace-margin-top">
      <!-- 顶部头像模块 start -->
      <view class="head_list cu-list menu">
        <view class="cu-item">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">{{i18n['头像']}}</text>
            <view class="demo-face grace-relative grace-img-in">
              <image :src="head_img || '../../../../static/logo.png'" mode="widthFix" @tap="openImg()"></image>
            </view>
          </view>
        </view>
      </view>
      <!-- 顶部头像模块 end -->
      <view class="cu-list menu ">
        <view class="cu-item">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">ID</text>
            <text class=" text-lg text-666 text-right">{{user_id}}</text>
          </view>
        </view>
        <!-- 昵称 start -->
        <view class="cu-item ">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">{{i18n['昵称']}}</text>
            <input type="text"  :selection-start="user_name.length" :selection-end="user_name.length"
              :cursor="user_name.length" class="input text-lg text-666" name="user_nickname" maxlength="10"
              :auto-blur="true" v-model="user_nickname" :placeholder="i18n['请输入昵称']" style="text-align: right" />
          </view>
        </view>
        <!-- 昵称 end -->

        <!-- 性别 start -->
        <view class="cu-item">
          <view class="content flex justify-between align-center" @click="toggleTab('selector')">
            <text class="title text-lg text-333">{{i18n['性别']}}</text>
            <text class="text-666">{{ sexName }}</text>
          </view>
        </view>
        <!-- 性别 end -->

        <!-- 生日 start -->
        <view class="cu-item">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">{{i18n['生日']}}</text>
            <view class="text-lg text-666 text-cut-2 text-align-right" @tap="toggleTab('date')">
              <view :class="name == i18n['点击选择'] ? '' : 'address-select'">{{
                dateValue
                }}</view>
            </view>
          </view>
        </view>
        <!-- 生日 end -->

        <!-- 手机号 statr -->
        <!-- <view class="cu-item" @tap="handleJump" data-url="/pages/index/setting/verify-oldphone/index?isChange=1">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">{{i18n['手机号']}}</text>
            <input type="text" class="input text-666 text-lg" name="mobile" maxlength="11" v-model="mobile"
              disabled="" :placeholder="i18n['请输入昵称']" style="text-align: right" />
          </view>
        </view> -->
        <!-- 手机号 end -->

        <!-- 邮箱 start -->
        <!-- <view class="cu-item">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333">{{i18n['邮箱']}}</text>
            <input type="text" class="input text-666 text-lg" name="user_email" v-model="user_email"
              :placeholder="i18n['请绑定邮箱']" style="text-align: right" />
          </view>
        </view> -->
        <!-- 邮箱 end -->

        <!-- 所在地 start -->
        <!-- <view class="cu-item">
          <view class="content flex justify-between align-center">
            <text class="title text-lg text-333 address">{{i18n['所在地']}}</text>
            <view class="text-lg text-666 text-cut-2 text-align-right" @tap="toggleTab('region')">
              <view :class="name == i18n['点击选择'] ? '' : 'address-select'">{{
                name
                }}</view>
            </view>
          </view>
        </view> -->
        <!-- 所在地 end -->
      </view>
    </form>
    <!-- 个人资料表单 end -->
    <!-- 选择城市 start -->
    <w-picker :visible.sync="cityVisible" mode="region" :value="defaultVal" themeColor="#FF6464" default-type="value"
      :hide-area="false" @confirm="onConfirm($event, 'region')" ref="region"></w-picker>
    <!-- 选择城市 end -->
    <!-- 选择生日 start -->
    <view class="birthday-wrap">
      <w-picker :visible.sync="timeVisible" mode="date" fields="day" :value="dateValue" themeColor="#FF6464" :disabled-after="true" @confirm="onConfirm($event, 'date')" ref="date">选择生日</w-picker>
    </view>
    <!-- 选择生日 end -->
    <!-- 选择性别 start -->
    <view class="sex-wrap">
      <w-picker :visible.sync="visible" mode="selector" :value="sexName" default-type="name" themeColor="#FF6464" :default-props="defaultProps" :options="sex" @confirm="onConfirm($event,'selector')" ref="selector" >选择性别</w-picker>
    </view>
      <!-- 选择性别 end -->
      <!-- 头像start -->
      <fu-popup v-model="headerShow" borderRadius="16"  :safeAreaInsetBottom="true" mode="bottom">
        <view class="header-popup text-333 text-weight-400 text-lg text-center">
          <view class="header-100" @click="chooseImage(0)">
            修改头像
          </view>
          <view class="header-100 solid-top"  @click="chooseImage(1)">
            拍照
          </view>
          <view class="header-100 solid-top"  @click="chooseImage(2)">
            从手机相册选择
          </view>
          <view class="height-20"></view>
          <view class="header-100 text-red" @click="headerShow = false">
            取消
          </view>
        </view>
      </fu-popup>
      <!-- 头像end -->
    <view class="footer">
      <button class="bottom-action" @click="saveUserInfo()">{{i18n['保存']}}</button>
    </view>
    <!-- 断网检测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网检测 end -->
  </view>
</template>

<script>
  // @see 引入组件wPicker
  import wPicker from "../../components/w-picker/w-picker.vue";
  // @see 引入验证，上传图片
  import { UploadImage, validate } from "@/common/utils/index";
  // @let {?Fuction} timer - 保存定时器
  let timer = null;
  export default {
    components: {
      wPicker,
    },
    data() {
      return {
        isLoading: false, // {Boolean} 是否加载中
        userInfo: {}, // {Objcet} 用户信息
        head_img: "", // {String} 用户头像
        user_name: "", // {String} 用户姓名
        user_id:'',
        user_nickname: "", // {String} 用户昵称
        user_email: "", // {String} 用户邮箱
        sexIndex: 1, // {Number} 性别选项 1：男；2：女；
        sex: [ {name: global.i18n["男"],id: 1}, {name: global.i18n["女"],id: 2}], // {Array} 性别数组
        defaultProps: {"label":"name","value":"id"},
        dateValue: global.i18n["请选择生日"], // {String} 生日默认显示
        mobile: "", // {String} 手机号码
        name: global.i18n["点击选择"], // {String} 所在地默认选择
        mode: "region", // {String} 组件wPicker的类型
        defaultVal: [1, 0, 0], // {Array} 城市编码
        city1: [], // {Array} 对应的省市区
        thumb: global.SYSTEM_CONFIG.logo, // {String} 默认图片
        cityVisible: false, // {Boolean} 组件wPicker是否显示
        // canLeave: true, // 是否有聚焦的输入框,有则提示保存
        isCanSave: false, // 是否可以保存
        form: {
          user_nickname: "",
          user_name: "",
          user_email: "",
          sexIndex: "",
          dateValue: "",
          defaultVal: "",
        }, // 旧数据，用来判断是否修改
        timeVisible:false,//时间组件
        visible:false,//性别组件
        headerShow:false,
      };
    },
    computed:{
      sexName(){
        let name = this.sex[this.sexIndex - 1].name;
        console.log('this.sexIndex',name);
        return name;
      }
    },
    watch: {
      user_nickname(val) {
        console.log(val, this.form.user_nickname, this.form.user_nickname == val);
        if (val != this.form.user_nickname) {
          this.isCanSave = true;
        }
      },
      user_email(val) {
        console.log(val, this.form);
        if (val != this.form.user_email) {
          this.isCanSave = true;
        }
      },
      sexIndex(val) {
        console.log(val, this.form);
        if (val != this.form.sexIndex) {
          this.isCanSave = true;
        }
      },
      dateValue(val) {
        console.log(val, this.form);
        if (val != this.form.dateValue) {
          this.isCanSave = true;
        }
      },
      defaultVal(val) {
        console.log(val, this.form);
        if (String(val) != String(this.form.defaultVal)) {
          this.isCanSave = true;
        }
      },
    },
    onLoad(option) {
      // 创建一个变量 userInfo ，把全局的用户信息浅拷贝到 userInfo
      let userInfo = Object.assign({}, global.userInfo);
      this.userInfo = userInfo;
      console.log(userInfo)
      this.head_img = userInfo.head_img ? userInfo.head_img : "";
      this.user_nickname = userInfo.user_nickname;
      this.user_name = userInfo.user_name;
      this.user_email = userInfo.user_email;
      this.user_id = userInfo.id
      this.sexIndex = userInfo.sex ? userInfo.sex : 0;
      // 用户的生日信息，有的话就放到全局方法里过滤一下，没有显示默认
      this.dateValue = userInfo.birthday
        ? this.$util.timeFormat(userInfo.birthday * 1000, "yyyy-mm-dd")
        : this.i18n["请选择生日"];
      this.mobile = userInfo.mobile;
      this.name = userInfo.address ? userInfo.address : this.i18n["点击选择"];
      this.defaultVal = userInfo.address
        ? userInfo.address_code.split(",")
        : [1, 0, 0];

      // 保存旧数据
      this.form.user_nickname = this.user_nickname;
      this.form.user_email = this.user_email;
      this.form.sexIndex = this.sexIndex;
      this.form.dateValue = this.dateValue;
      this.form.defaultVal = this.defaultVal;
      /**
       * @description 监听手机号修改事件
       */
      uni.$on("changeMobile", (data) => {
        // console.log(data);
        var mobile = data.substr(0, 3) + "****" + data.substr(7);
        this.mobile = mobile;
      });
      /**
       * @description 监听监听上传头像事件
       */
      uni.$on("uPicCropper", (path) => {
        this.uploadUserImg(path);
      });
      // 监听键盘
      // uni.onKeyboardHeightChange((e) => {
      //   console.log(e, "eee");
      //   if (e.height == 0) {
      //     this.canLeave = true;
      //   } else {
      //     this.canLeave = false;
      //   }
      // });
    },
    onUnload() {
      // 关闭当前页面的监听事件
      uni.$off("uPicCropper");
      uni.$off("changeMobile");
    },
    // 返回拦截,如果有未保存的数据,弹出提示框
    // onBackPress() {
    //   if (this.canLeave) {
    //     return false;
    //   } else {
    //     this.$util.showModal({
    //       title: "提示",
    //       content: "还有未保存的数据哦,是否离开?",
    //       success: (res) => {
    //         if (res.confirm) {
    //           uni.hideKeyboard();
    //           setTimeout(() => {
    //             uni.navigateBack();
    //           }, 100);
    //         }
    //       },
    //     });
    //     return true;
    //   }
    // },
    methods: {
      /**
       * @description 页面返回
       * @param {delta} delta = 返回的页面数，如果 delta 大于现有页面数，则返回到首页
       */
      back(delta) {
        if (this.isCanSave) {
          this.$util.showModal({
            title: this.i18n["提示"],
            content: this.i18n["你有修改未保存，是否确认保存?"],
            success: (res) => {
              if (res.confirm) {
                this.saveUserInfo();
                uni.hideKeyboard();
              } else if (res.cancel) {
                uni.navigateBack();
              }
            },
          });
          return false;
        }
        console.log("页面返回");
        uni.navigateBack({
          delta: delta || 1,
        });
      },
      /**
       * @event
       * @description 所在地的选择弹窗显示
       */
      toggleTab(ref) {
        this.$refs[ref].show();
      },
      // 保存用户信息
      saveUserInfo() {

        // 校验
        // 如果不为空的情况下使用验证方法去验证邮箱号
        if(this.user_email){
          if (!validate(this.user_email, "email")) {
          this.$message.info(this.i18n["请输入正确的邮箱账号"]);
          return;
        }
        }


        if(!this.user_nickname.trim()){
          this.$message.info(this.i18n["请输入昵称"]);
          return;
        }

        let data = {
          user_nickname: this.user_nickname,
          sex: this.sexIndex,
          user_email: this.user_email,
          birthday: this.dateValue,
          address: this.name,
          address_code: this.defaultVal,
        };
        this.upload(data);
      },
      /**
       * @event
       * @description 表单上传事件
       * @param {Object} val - 用户单独保存某一项时传进来的参数
       */
      upload(val) {
        this.$api.post(global.apiUrls.editUserinfo, val).then((res) => {
          if (res.data.code == 1) {
            // 更新本地缓存
            uni.setStorageSync("USER_INFO", res.data.data.userinfo);
            // 更新用户信息
            this.userInfo = Object.assign({}, uni.getStorageSync("USER_INFO"));
            // 更新global的用户信息
            global.userInfo = res.data.data.userinfo;
            uni.showToast({
              title: res.data.msg,
              duration: 1000,
              icon: "none",
            });
            // 保存旧数据
            this.form.user_nickname = this.user_nickname;
            this.form.user_email = this.user_email;
            this.form.sexIndex = this.sexIndex;
            this.form.dateValue = this.dateValue;
            this.form.defaultVal = this.defaultVal;
            // 更新保存状态
            this.isCanSave = false;
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          } else {
            this.$message.info(res.data.msg);
          }
        });
      },
      /**
       * @event
       * @description 保存用户姓名事件
       */
      saveUsername() {
        if (
          this.userInfo.user_name == this.user_name ||
          this.user_name == "" ||
          this.user_name.length > 10
        )
          return;
        // this.upload({ user_name: this.user_name });
      },
      /**
       * @event
       * @description 性别选择事件
       */
      bindPickerChange: function (e) {
        this.sexIndex = e.detail.value;
        if (this.userInfo.sex == this.sexIndex) return;
        // this.upload({ sex: this.sexIndex });
      },
      /**
       * @description 选择性别
       */
      chooseSex() {
        let that = this;
        uni.showActionSheet({
          itemList: that.sex,
          success: function (res) {
            console.log(["选中了第"] + (res.tapIndex + 1) + ["个按钮"]);
            that.sexIndex = res.tapIndex;
            if (that.userInfo.sex == that.sexIndex) return;
            // that.upload({ sex: that.sexIndex });
          },
          fail: function (res) {
            console.log(res.errMsg);
          },
        });
      },
      /**
       * @event
       * @description 生日选择事件
       * @param {!Object} e - 用户生日弹窗选择的值
       */
      bindDateChange: function (e) {
        let selectTime = new Date(e.detail.value);
        let nowTime = new Date();
        if (selectTime > nowTime) {
          this.$message.info(this.i18n["请选择正确的时间"]);
          return;
        }
        this.dateValue = e.detail.value;
        if (this.userInfo.birthday == this.dateValue || !this.dateValue) return;
        // this.upload({ birthday: this.dateValue });
      },

      /**
       * @event
       * @description 所在地选择事件
       * @param {Object} result - 用户所在地弹窗选择的值
       */
      onConfirm(result,type) {
        console.log(result,type);
        if(type == 'date'){
          this.dateValue = result.value;
        }
        if(type == 'region'){
          let { province, city, area } = result.obj;
          let text = [province.label, city.label, area.label];
          let code = [province.value, city.value, area.value];
          this.name = text.join("-");
          this.city1 = text;
          this.defaultVal = code;
          if (this.userInfo.address_code == this.defaultVal ||this.userInfo.address == this.name) return;
        }
         if(type == 'selector'){
           this.sexIndex = result.value;
         }
        // this.upload({
        //   address: this.name,
        //   address_code: this.defaultVal,
        // });
      },
      openImg(){
        this.headerShow = true;
      },
      /**
       * @event
       * @description 选择头像事件
       */
      chooseImage(tapIndex) {
        let that = this;
        if (tapIndex == 0) {
              let img = that.head_img || that.thumb;
              uni.navigateTo({
                url:
                  '/pages/user/user/avatar-cropping/index?rectHeight=200&rectWidth=200&fileType=jpg&myImgUrl=' +
                  img,
                animationDuration: 0,
              });
            } else if (tapIndex == 1) {
              uni.chooseImage({
                count: 1,
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["camera"], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                  // 跳转到图片裁切页面
                  uni.navigateTo({
                    url:
                      '/pages/user/user/avatar-cropping/index?rectHeight=200&rectWidth=200&fileType=jpg&myImgUrl=' +
                      res.tempFilePaths[0],
                    animationDuration: 0,
                  });
                },
              });
            } else {
              uni.chooseImage({
                count: 1,
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                  // 跳转到图片裁切页面
                  uni.navigateTo({
                    url: `/pages/user/user/avatar-cropping/index?rectHeight=200&rectWidth=200&fileType=jpg&myImgUrl=${res.tempFilePaths[0]}`,
                    animationDuration: 0,
                  });
                },
              });
            }
            this.headerShow = false;
      },
      // 表单提交
      formSubmit: function (e) {
        if (this.isLoading) return;

        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          var formData = e.detail.value;

          // 添加头像
          formData.head_img = this.head_img;

          // 处理生日字段
          formData.birthday =
            formData.birthday.indexOf(this.i18n["选择"]) != -1 ? "" : formData.birthday;

          // 所在地
          formData.address = this.name.indexOf(this.i18n["选择"]) != -1 ? "" : this.name;
          formData.address_code = this.defaultVal;

          // 添加用户ID
          formData.user_id = this.userInfo.id ? this.userInfo.id : "";

          // 进行表单验证操作
          let validateRes = this.doValidate(formData);
          if (validateRes) {
            this.$message.info(validateRes);
            return;
          }
          console.log('birthday', formData.birthday);

          this.isLoading = true;
          this.$api
            .post(global.apiUrls.editUserinfo, formData)
            .then((res) => {
              // setTimeout(() => {
              //   this.isLoading = false;
              // }, 500)
              if (res.data.code == 1) {
                this.isLoading = false;
                // 更新本地缓存
                uni.setStorageSync("USER_INFO", res.data.data.userinfo);

                // 更新global
                global.userInfo = res.data.data.userinfo;
                this.$message.info(this.i18n["修改成功"]);
                setTimeout(() => {
                  uni.navigateBack();
                }, 500);
              }
            })
            .catch((err) => {
              this.isLoading = false;
              console.log(err);
            });
        }, 300);
      },

      // 进行表单字段值校验
      doValidate(formData) {
        console.log(formData);

        // 昵称
        if (!formData.user_nickname) {
          return this.i18n["请输入您的用户昵称"];
        }

        if (formData.user_nickname.length > 10) {
          return this.i18n["请检查您的昵称(最多10个字符)"];
        }

        // 生日
        if (!formData.birthday) {
          return this.i18n["请选择您的生日"];
        }

        return "";
      },

      /**
       * @description 上传用户头像
       */
      uploadUserImg(blob) {
        uni.showLoading();
        let _this = this;
        // 开始上传
        new UploadImage([blob], {
          complete: function (res) {
            console.log(res);
            uni.hideLoading();
            if (res.length) {
              _this.head_img = res[0].path;
              var formData = {
                head_img: res[0].id,
              };
              _this.$api
                .post(global.apiUrls.editUserinfo, formData)
                .then((res) => {
                  if (res.data.code == 1) {
                    // 更新本地缓存
                    uni.setStorageSync("USER_INFO", res.data.data.userinfo);
                    // 更新global
                    global.userInfo = res.data.data.userinfo;
                  }
                });
            }
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cu-list.menu {
    margin-top: 0;
  }

  .demo text {
    margin: 10upx;
  }

  .demo-face {
    width: 100rpx;
    height: 100rpx;
  }

  .demo-face image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 60rpx;
  }

  .picker {
    background: #00b26a;
    width: 100%;
    line-height: 40px;
  }

  .head_list {
    background: #fff;
    padding: 20rpx 0;
    height: 152rpx;
    position: relative;

     &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 32rpx;
      width: 100%;
      height: 1px;
      background: #ddd;
      transform: scaleY(0.5);
    }
  }

  .other {
    width: 500rpx;
    text-align: right;
  }

  .address {
    display: inline-block;
    width: 110rpx;
  }

  .cu-item.arrow::before {
    color: #bfbfbf !important;
  }

  .cu-list.menu>.cu-item {
    height: 110rpx;
  }

  .address-select {
    // display: inline-block;
    width: 400rpx;
    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }

  .content .title {
    display: inline-block;
    width: 160rpx;
    min-width: 160rpx;
  }

  .text-align-right {
    text-align: right;
  }
  .footer{
    position: fixed;
    left: 0rpx;
    bottom: 0rpx;
    width: 100%;
    height: 110rpx;;
    height: calc(110rpx + constant(safe-area-inset-bottom));
    height: calc(110rpx + env(safe-area-inset-bottom));
    background: #FFFFFF;
    .bottom-action {
      height: 110rpx;
      line-height: 110rpx;
      background: #FFFFFF;
      padding: 0;
      border-radius: 0;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FF6464;
      &::after{
        border: 0;
        border-radius: 0;
      }
    }
  }

.cu-list.menu-avatar>.cu-item:after, .cu-list.menu>.cu-item:after{
  left: 32rpx;
}
.header-popup{
  .height-20{
    height:20rpx;
    background: #f8f8f8;
  }
  .header-100{
    height:100rpx;
    line-height: 100rpx;
  }
}
/deep/ .sex-wrap .w-picker-view{
  height:228rpx;
}
/deep/ .birthday-wrap uni-picker-view .uni-picker-view-wrapper{
  padding:0 80rpx;
}
</style>
