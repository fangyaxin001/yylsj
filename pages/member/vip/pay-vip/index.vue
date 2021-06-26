<template>
  <view class="page">
    <!-- 订单金额支付时间 start -->
    <view class="solid-top">
      <view class="price-box" style="height: 150rpx;padding-top: 50rpx;">
        <text class="text-price icon"></text>
        <text class="price">{{orderInfo.payable_money}}</text>
      </view>
      <view class="price-box time" style="line-height:100rpx;height:130rpx;padding-bottom: 50rpx;">
        {{i18n['支付剩余时间']}}：<text v-if='downTime.day'>{{downTime.day}} {{i18n['天']}}</text>
        {{downTime.hours}}:{{downTime.minutes}}:{{downTime.seconds}}
      </view>
    </view>
    <!-- 订单金额支付时间 end -->
    <view class="line"></view>
    <!-- 支付方式 start -->
    <view class="pay-type-list">
      <view class="padding-bottom padding-top solid-bottom text-666">{{i18n['选择支付方式']}}</view>
      <view v-for="(item,index) in payWaysList" :key="item.id">
        <!-- #ifdef  APP-PLUS | H5 -->
        <view class="type-item b-b" @click="changePayType(item.pay_type)"
          v-if="canUseBalance  || item.pay_type!='balance'">
          <view class="margin-right">
            <image class="block-56" v-if="item.pay_type == 'balance'" src="../../static/ye.png"></image>
            <image class="block-56" v-if="item.pay_type == 'mix' " src="../../static/ye.png"></image>
            <image class="block-56" v-if="item.pay_type == 'wxpay'" src="../../static/wx.png"></image>
            <image class="block-56" v-if="item.pay_type == 'alipay'" src="../../static/zfb.png"></image>
          </view>
          <view class="con">
            <text class="tit">{{item.name}}</text>
            <text v-if="item.pay_type =='balance'  ||  item.pay_type =='mix'" class="text-999 text-sm">{{i18n['可用余额']}}: {{user_money}}</text>
          </view>
          <label class="radio">
            <radio class="radio-scale" :color="colorTheme" :checked='payType == item.pay_type'
              :disabled="!canUseBalance && item.pay_type=='balance'" />
          </label>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN  -->
        <block v-if="item.pay_type=='balance' || item.pay_type == 'wxpay' ">
          <view class="type-item b-b" @click="changePayType(item.pay_type)"
            v-if="canUseBalance  || item.pay_type!='balance'">
            <view class="margin-right">
              <image class="block-56" v-if="item.pay_type == 'balance'" src="../../static/ye.png"></image>
              <image class="block-56" v-if="item.pay_type == 'wxpay'" src="../../static/wx.png"></image>
            </view>
            <view class="con">
              <text class="tit">{{item.name}}</text>
              <text v-if="item.pay_type =='balance'" class="text-999 text-sm">{{i18n['可用余额']}}: {{user_money}}</text>
            </view>
            <label class="radio">
              <radio class="radio-scale" color="colorTheme" :checked='payType == item.pay_type'
                :disabled="!canUseBalance && item.pay_type=='balance'" />
            </label>
          </view>
        </block>
        <!-- #endif -->
        <block v-if="item.pay_type=='balance' && canUseMix">
          <view class="type-item b-b" @click="changePayType('mix')">
            <view class="margin-right">
              <image class="block-56" src="../../static/ye.png"></image>
            </view>
            <view class="con">
              <text class="tit">{{i18n['组合支付(余额可抵扣']}}: <text class="text-theme text-price margin-left-xs">{{user_money}}</text>)</text>
            </view>
            <label class="radio">
              <radio class="radio-scale" :color="$store.state.themeColor" :checked='payType == "mix"' :disabled="!canUseMix" >
              </radio>
            </label>
          </view>
        </block>
      </view>
    </view>
    <!-- 确认支付按钮 -->
    <button class="cu-btn bottom-btn" v-if="!fingerprintShow" @click="submit">{{i18n['立即支付']}}</button>
    <!-- 支付密码弹窗 -->
    <fu-pay-keyboard ref="passkeyborad"  :show="payShow" :money="orderInfo.payable_money"
      @handleFingerprint="handleFingerprint" @close="payClose" @callback="paymentByBalance"></fu-pay-keyboard>
    <!-- 指纹密码弹窗 -->
    <fu-pay-fingerprint ref="payfingerprint" :show="fingerprintShow" @submit="paymentByBalance" @handlePassWord="submit"
      @close="payClose"></fu-pay-fingerprint>
    <!-- 断网检测 -->
    <fu-notwork></fu-notwork>

    <!-- 密码错误弹窗 start -->
    <view class="password-error-model" v-show="isShow">
      <view class="password-error-mask"></view>
      <view class="password-error-content">
        <view class="password-error-title">
          {{i18n['支付密码错误，请重试']}}
        </view>
        <view class="password-error-btn">
          <view class="password-error-tips" @click="forgetPassword">{{i18n['忘记密码']}}</view>
          <view class="password-error-tips password-error-again" @click="again">{{i18n['重试']}}</view>
        </view>
      </view>
    </view>
    <!-- 密码错误弹窗 end -->
    <!-- 后退弹窗 start -->
    <view class="password-error-model" v-show="isContinuePay">
      <view class="password-error-mask"></view>
      <view class="password-error-content border-radio-none">
        <view class="pay-title">确认要离开收银台?</view>
        <view class="password-content-title">
           您的订单在{{_time}}内未支付将被取消,请尽快完成支付
        </view>
        <view class="password-error-btn">
          <view class="password-error-tips" @click="handleBackReturn(1)">确认离开</view>
          <view class="password-error-tips password-error-again blue-color" @click="handleBackReturn(2)">继续支付</view>
        </view>
      </view>
    </view>
    <!-- 后退弹窗 end -->


  </view>
</template>

<script>
  /**
   * @author刘畅
   */
  // @see 密码支付组件
  import fuPayKeyboard from '../../components/fu-pay-keyboard/fu-pay-keyboard.vue';
  import fuPayFingerprint from '../../components/fu-pay-fingerprint/fu-pay-fingerprint.vue';
  export default {
    components: {
      fuPayKeyboard,
      fuPayFingerprint,
    },
    data() {
      return {
        isContinuePay:false,
        imgIcon: { // {Obejct} 支付方式图标
          balance: '../../static/ye.png', // {String} 余额支付
          alipay: '../../static/zfb.png', // {String} 支付宝
          wxpay: '../../static/wx.png', // {String} 微信
        },
        payWaysList: [], // {Array.<Object>} 支付方式列表
        downTime: { // {Object} 支付剩余时间
          day: 0, // 天
          hours: 0, // {Number} 小时
          minutes: 0, // {Number} 分钟
          seconds: 0, // {Number} 秒钟
        },
        cancel_time: 0, // {Number} 支付时间
        goods_is_sale: 1, // {Number} 在支付时，判断该订单下面的商品是否已经下架 0下架 1正常
        payType: 'balance', // {String} 支付方式
        orderInfo: {}, // {Object} 订单信息
        user_money: 0, // {Number} 用户余额
        order_money: 0, // {Number} 订单金额
        order_sn: '', // {Number} 订单号
        order_type: 16, // {Number} 订单类型
        fingerprintShow: false, //指纹支付
        payShow: false, // {Boolean} 支付密码弹窗是否显示
        canUseBalance: false, // {Boolean} 余额是否可用
        canUseMix: false, // {Boolean} 是够可用混合支付
        loading: false, // {Boolean} 按钮状态
        isShow: false, // {Boolean} 忘记密码
        isFromPay:false,//是否支持指纹支付
      };
    },
    computed: {
      _time() {
        return `${Number(this.downTime.day) ? this.downTime.day + this.i18n['天'] : '' }${Number(this.downTime.hours) ? this.downTime.hours + this.i18n['时']:''}${Number(this.downTime.minutes) ? this.downTime.minutes+this.i18n['分']:''}${Number(this.downTime.seconds) ? this.downTime.seconds +this.i18n['秒']:''}`;
        // return this.downTime.day + '天' + this.downTime.hours + ':' + this.downTime.minutes + ':' + this.downTime.seconds;
      },
    },
    /**
     * @function
     * @description 页面加载生命周期函数
     * @param {Object} options - 传递过来的订单参数
     */
    onLoad(options) {
		this.setNavigationBarTitle(this.i18n['立即支付'])

      this.getPayWaysList()
      this.order_sn = options.order_sn;
      this.order_type = 16;
      this.loadData();

    },
    onShow() {
      this.isShow = false;
      this.payClose()
    },
    /**
     * @function
     * @description 监听页面返回
     * @param {Object} e - {from:backbutton、 navigateBack}
     *  backbutton 表示来源是左上角返回按钮或 android 返回键；
     *  navigateBack表示来源是 uni.navigateBack
     */
    onBackPress(e) {
      const that = this;
      if (e.from == 'backbutton') {
        let _time = this._time;
        if (!_time) {
          return true;
        }
        this.isContinuePay = true
        return true;
      } else {
        return false;
      }
    },
    methods: {
      handleBackReturn(value){
        console.log(value)
        this.isContinuePay = false
        if(value == 1){
           uni.navigateBack();
        }

      },
      /**
       * @function
       * @description 获取支付方式列表
       */
      getPayWaysList() {
        let showKid = 'balance'
        this.$api.post(global.apiUrls.postPayWaysList).then(res => {
          console.log("res: ", res);
          if (res.data.code == 1) {
           this.payWaysList = res.data.data

           if( this.user_money >= this.orderInfo.payable_money ){
                showKid = 'balance'
           } else {
                showKid = 'mix'
           }

           this.payWaysList.forEach((item,index)=>{
             if(item.pay_type== showKid){
               this.payWaysList.splice(index,1);
             }

           })

          }
        }).catch(err => {
          this.loading = false;
        })
      },
      /**
       * @event 密码输入错误点击重试
       * @description 点击重试按钮
       */
      again() {
        this.isShow = false;
        this.loading = true;
        this.callPay();
      },
      /**
       * @event 点击忘记密码
       * @description 点击忘记密码
       */
      forgetPassword() {
        uni.navigateTo({
          url: '/pages/index/setting/modify-pay-password/index'
        })
      },
      /**
       * @function
       * @description 获取订单及余额数据
       * @async request1 - 获取订单详情
       * @async request2 - 获取金额信息
       */
      loadData() {
        const that = this
        let request1 = this.$api.get(global.apiUrls.getOrderDetail, {
          order_sn: this.order_sn,
          order_type: this.order_type,
        });

        let request2 = this.$api.post(global.apiUrls.getMyMoney);
        Promise.all([request1, request2])
          .then(res => {
            that.goods_is_sale = res[0].data.data.goods_is_sale
            that.cancel_time = res[0].data.data.cancel_time
            that.initDownTime()
            console.log('promise all', res);
            if (res[0].data.code == 1) {
              this.orderInfo = res[0].data.data;
              this.order_money = Number(res[0].data.data.payable_money);
            }
            if (res[1].data.code == 1) {
              this.user_money = Number(res[1].data.data.user_money);
            }
            // 余额为零 禁止使用余额支付 禁止使用混合支付
            if (this.user_money == 0) {
              this.canUseBalance = false;
              this.canUseMix = false;
              this.payType = 'wxpay';
            }
            // 余额小于订单金额 禁止使用余额支付 可以使用组合支付
            if (this.user_money > 0 && this.user_money < this.order_money) {
              this.canUseBalance = false;
              this.canUseMix = true;
              this.payType = 'mix';
            }
            // 用户余额大于订单余额时 可使用余额支付 不能用组合支付
            if (this.user_money >= this.order_money) {
              this.canUseBalance = true;
              this.canUseMix = false;
              this.payType = 'balance';
            }
          }).catch(err => {
            console.log(err);
          })
      },
      /**
       * @event
       * @description 关闭支付密码输入框
       */
      payClose() {
        this.fingerprintShow = false
        this.payShow = false;
      },
      // 指纹支付
      handleFingerprint() {
        const that = this
        this.payShow = false;
        this.fingerprintShow = true;
        this.$nextTick(function () {
          this.$refs.payfingerprint.checkIsSupportSoterAuthentication();
        })

      },
      /**
       * @event
       * @description 选择支付方式
       * @param {String} type - 支付方式
       * @returns {Boolean}
       */
      changePayType(type) {
        this.payType = type;
        if (type == 'balance' && !this.canUseBalance) return;
        if (type == 'mix' && !this.canUseMix) return;

      },
      /**
       * @event
       * @description 确认支付
       * @returns {Boolean}
       */
      submit() {
        if (this.goods_is_sale == 0) {
          this.$message.info(this.i18n['该订单下包含有已下架商品，请重新下单']);
          setTimeout(function () {
            uni.navigateBack({})
          }, 1000)
          return
        }
        // 防止二次点击
        if (this.loading) return;
        this.loading = true;
        this.callPay();
      },
      /**
       * @function
       * @description 判断调用哪种支付方式
       */
      callPay() {
        if (this.payType == 'wxpay') {
          this.paymentByWxpay(this.order_sn);
        } else if (this.payType == 'alipay') {
          this.paymentByAlipay(this.order_sn);
        } else if (this.payType == 'mix') {
          this.paymentByMix(this.order_sn);
        } else {
          this.paymentByBalanceIsSetPass();
        }
      },
      /**
       * @function
       * @description 余额支付判断是否设置了支付密码
       */
      paymentByBalanceIsSetPass() {
        this.$api.post(global.apiUrls.isSetPay, {
          pay_money: this.orderInfo.payable_money
        }).then(res => {
          if (res.data.code == 1) {
            if (res.data.data.falg == 1) {
              this.loading = false;
              this.payShow = true;
              this.fingerprintShow = false;
            } else {
              this.$message.info(res.data.msg);
              setTimeout(() => {
                this.loading = false;
                this.$urouter.navigateTo('/pages/index/setting/change-pay-password/index');
              }, 800);
            }
          } else {
            this.loading = false;
            this.$message.info(res.data.msg);
          }
        }).catch(err => {
          this.loading = false;
        })
      },
      /**
       * @function
       * @description 余额支付
       * @param {String} pass - 用户输入的支付密码
       */
      paymentByBalance(pass) {
        let that = this
        let query = {
          order_sn: this.order_sn
        }
        if (pass) {
          query.pay_password = pass
        } else {
          query.type = 1
        }
        this.$api.post(global.apiUrls.balancepayOrder, query).then(res => {
          if (res.data.code == 1) {
            uni.hideLoading();
            // this.$message.info('支付成功');
            if (this.$refs.passkeyborad) {
              this.$refs.passkeyborad.close();
              this.$refs.passkeyborad.close();
            }
            if (this.$refs.payfingerprint) {
              this.$refs.payfingerprint.close();
            }
            this.paySuccess(this.order_sn);
          } else if(res.data.code == 2){
             this.$message.info(res.data.msg);
             if (this.$refs.passkeyborad) {
               this.$refs.passkeyborad.clear();
               this.$refs.passkeyborad.close();
             }
             if (this.$refs.payfingerprint) {
               this.$refs.payfingerprint.close();
             }
             setTimeout(function(){
               that.$urouter.switchTab('/pages/tab/home/shopindex/index');
             },1500)

		      } else {
            // this.$message.info(res.data.msg);
            if (this.$refs.passkeyborad) {
              this.$refs.passkeyborad.clear();
              this.$refs.passkeyborad.close();
            }
            if (this.$refs.payfingerprint) {
              this.$refs.payfingerprint.close();
            }

            this.isShow = true;
          }
        })
      },
      /**
       * @function
       * @description 微信支付
       * @param {Object} sn - 订单号
       */
      paymentByWxpay(sn) {
        this.$api.post(global.apiUrls.wxpayOrder, {
          order_sn: sn,
          // #ifdef APP-PLUS
          wxpaytype: 'apppay',
          // #endif
          // #ifdef MP-WEIXIN
          wxpaytype: 'minipay',
          // #endif
        }).then(res => {
          console.log("微信支付回调", res);
          if (res.data.code == 1) {
            let data = res.data.data;
            console.log('支付信息',data);
            uni.requestPayment({
              provider: 'wxpay',
              // #ifdef MP-WEIXIN
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              // #endif
              // #ifdef APP-PLUS
              orderInfo: data,
              // #endif
              success: (e) => {
                console.log('success', e)
                if (e.errMsg == 'requestPayment:ok') {
                  this.paySuccess(sn);
                }
              },
              fail: (e) => {
                console.log('fail', e);
                // #ifdef APP-PLUS
                let failMsg = 'requestPayment:fail canceled';
                // #endif
                // #ifndef APP-PLUS
                let failMsg = 'requestPayment:fail cancel';
                // #endif
                if (e.errMsg == failMsg) {
                  this.$message.info(this.i18n['取消支付']);
                } else {
                  this.$message.info(this.i18n["支付失败,请稍后重试"]);
                  // this.$message.info("支付失败,原因为: " + e.errMsg);
                }
              },
              complete: () => {
                // console.log("2212: ");
                // this.paySuccess(sn);
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
            this.$message.info(this.i18n["订单无效，支付失败!"]);
          }
        }).catch(err => {
          this.loading = false;
          console.error('微信支付失败 =>', err);
        })
      },
      /**
       * @function
       * @description 支付宝支付
       * @param {Object} sn - 订单号
       */
      // #ifndef MP-WEIXIN
      paymentByAlipay(sn) {
        this.$api.post(global.apiUrls.alipayOrder, {
          order_sn: sn,
        }).then(res => {
          console.log("支付宝支付回调", res);
          if (res.data.code == 1) {
            uni.requestPayment({
              provider: 'alipay',
              orderInfo: res.data.data,
              success: (e) => {
                if (e.errMsg == 'requestPayment:ok') {
                  this.paySuccess(sn);
                }
              },
              fail: (e) => {
                if (e.errMsg == 'requestPayment:fail canceled') {
                  this.$message.info(this.i18n['取消支付']);
                } else {
                  // this.$message.info("支付失败,原因为: " + e.errMsg);
                  this.$message.info(this.i18n["支付失败,请稍后重试"]);
                }
              },
              complete: () => {
                this.loading = false;
              }
            })
          } else {
            this.loading = false;
            this.$message.info(this.i18n["订单无效，支付失败"]);
          }
        }).catch(err => {
          this.loading = false;
          console.log("支付宝支付失败 => ", err);
        })
      },
      // #endif
      /**
       * @function
       * @description 混合支付
       * @param {Object} sn - 订单号
       */
      paymentByMix(sn) {
        console.log("执行混合支付");
        this.$api.post(global.apiUrls.mixinpayOrder, {
          order_sn: sn,
          // #ifdef APP-PLUS
          ismini: 0,
          // #endif
          // #ifdef MP-WEIXIN
          ismini: 1,
          // #endif
          balance: this.user_money,
        }).then(res => {
          console.log('混合支付', res);
          if (res.data.code == 1) {
            uni.requestPayment({
              provider: 'wxpay',
              // #ifdef MP-WEIXIN
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              // #endif
              // #ifdef APP-PLUS
              orderInfo: res.data.data,
              // #endif
              success: (e) => {
                uni.hideLoading();
                console.log(e)
                if (e.errMsg == 'requestPayment:ok') {
                  this.paySuccess(sn);
                }
              },
              fail: (e) => {
                uni.hideLoading();
                if (e.errMsg == 'requestPayment:fail canceled') {
                  this.$message.info(this.i18n['取消支付']);
                } else {
                  this.$message.info(this.i18n["支付失败,原因为: "] + e.errMsg);
                }
              },
              complete: () => {
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
            this.$message.info(res.data.msg);
          }
        }).catch(err => {
          this.loading = false;
          console.error(this.i18n['混合支付 - 微信支付失败']+' =>', err);
        })
      },
      /**
       * @function
       * @description 支付成功
       * @param {Object} sn - 支付成功
       */
      paySuccess(sn) {
          this.$urouter.redirectTo({
            url: '/pages/member/vip/pay-vip-success/index',
            params: {
              order_sn: sn,
              order_type: 16,
              pay_type: this.payType
            }
          })
      },
  
      /**
       * @function
       * @description 初始化倒计时
       */
      initDownTime() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        let endTime = this.cancel_time * 1000;
        let nowTime = new Date().getTime();
        let timeleft = endTime - nowTime;
        if (timeleft > 0) {
          let hours = parseInt((timeleft / (1000 * 60 * 60)) % 24);
          let minutes = parseInt((timeleft / (1000 * 60)) % 60);
          let seconds = parseInt(timeleft / 1000 % 60)
          let day = parseInt(timeleft / 1000 / 60 / 60 / 24); //计算剩余的天数
          this.downTime.day = day
          this.downTime.hours = hours < 10 ? '0' + hours : hours;
          this.downTime.minutes = minutes < 10 ? '0' + minutes : minutes;
          this.downTime.seconds = seconds < 10 ? '0' + seconds : seconds;
        } else {
          uni.navigateBack();
        }
        this.timer = setInterval(() => {
          let endTime = this.cancel_time * 1000;
          let nowTime = new Date().getTime();
          let timeleft = endTime - nowTime;
          if (timeleft > 0) {
            let hours = parseInt((timeleft / (1000 * 60 * 60)) % 24);
            let minutes = parseInt((timeleft / (1000 * 60)) % 60);
            let seconds = parseInt(timeleft / 1000 % 60);
            let day = parseInt(timeleft / 1000 / 60 / 60 / 24); //计算剩余的天数
            this.downTime.day = day
            this.downTime.hours = hours < 10 ? '0' + hours : hours;
            this.downTime.minutes = minutes < 10 ? '0' + minutes : minutes;
            this.downTime.seconds = seconds < 10 ? '0' + seconds : seconds;
          } else {
            clearInterval(this.timer);
            uni.navigateBack();
            this.timer = null;
          }
        }, 1000);
      },
    },
    onUnload() {
      clearInterval(this.timer);
    },
  }
</script>

<style lang='scss' scoped>
   /* 订单金额支付时间 start */
  .price-box {
    background-color: #fff;
    height: 220rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: $theme;

    .icon {
      font-size: 30rpx;
    }

    .price {
      font-size: 56rpx;
    }

  }

  .time {
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;

  }

  // 订单金额支付时间 end

  // 支付方式 start
  .pay-type-list {
    background-color: #fff;
    padding: 0 32rpx;
    box-sizing: border-box;

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

    .icon {
      width: 100upx;
      font-size: 52upx;
    }

    .icon-erjiye-yucunkuan {
      color: #fe8e2e;
    }

    .icon-weixinzhifu {
      color: #36cb59;
    }

    .icon-alipay {
      color: #01aaef;
    }

    .tit {
      font-size: 32rpx;
      color: #333333;
      margin-bottom: 4upx;
    }

    .con {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: $uni-font-size-sm;
      color: #909399;
    }
  }

  .radio-scale {
    transform: scale(0.7);
  }

  .block-56 {
    width: 56rpx;
    height: 56rpx;
  }

  // 支付方式 end

  .bottom-btn {
    position: fixed;
    bottom: 40rpx;
    bottom: calc(40rpx + constant(safe-area-inset-bottom));
    bottom: calc(40rpx + env(safe-area-inset-bottom));
    left: 32rpx;
    right: 32rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    color: #ffffff;
    background: $bgtheme;
    border-radius: 50rpx;
  }

  /* 离开弹框 start */
       .pay-title{
         line-height: 80rpx;
         padding-top:10rpx;
         text-align: center;
         font-weight: 400;
         font-size: 36rpx;
         color: #333333;

       }

      .password-content-title {
        height: 140rpx;
        padding:10rpx 50rpx;
        text-align: center;
        line-height: 40rpx;
        font-size: 30rpx;
        color: #999;
        max-height: 400px;


      }
      .blue-color{
        color:#007aff !important;
      }
      .border-radio-none{
        border-radius: 0 !important;
      }

  /* 离开弹框 end */

  // 密码错误弹窗 start
  .password-error-mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 98;
  }

  .password-error-content {
    background: #FFFFFF;
    border-radius: 24rpx;
    font-size: 32rpx;
    width: 600rpx;
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;

    .password-error-title {
      height: 160rpx;
      text-align: center;
      line-height: 160rpx;
      color: #5c5c5c;
    }

    .password-error-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      position: relative;
      color: #040404;

      &::after {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: 100%;
        height: 1rpx;
        background-color: rgb(197, 189, 189);
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .password-error-tips {
        width: 50%;
        height: 108rpx;
        line-height: 108rpx;

        &.password-error-again {
          color: rgb(92, 103, 147);
          position: relative;
          height: 100%;

          &::after {
            position: absolute;
            content: '';
            left: 0;
            top: 0;
            width: 1rpx;
            height: 100%;
            background-color: rgb(197, 189, 189);
            -webkit-transform: scaleX(.5);
            transform: scaleX(.5);
          }
        }

      }

    }
  }

  // 密码错误弹窗 end
  .line{
    width: 750rpx;
    height: 20rpx;
  }
</style>
