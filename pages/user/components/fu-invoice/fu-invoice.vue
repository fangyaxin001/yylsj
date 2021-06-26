<template>
	<view>
    <!-- 发票明细 start -->
		<view class="fu-invoice-wrap">
		  <view class="flex fu-invoice-item">
		    <view class="fu-invoice-item-title text-333">
		     {{ i18n['发票类型']}}
		    </view>
        <view class="fu-invoice-item-info text-666">
          <text>{{i18n['普通发票']}}</text>
        </view>
		  </view>
      <view class="flex fu-invoice-item">
        <view class="fu-invoice-item-title text-333">
          {{i18n['抬头类型']}}
        </view>
        <view class="fu-invoice-item-info text-666 flex align-center justify-end" >
          <label class="radio flex align-center justify-end" @click="changeRise(1)">
            <radio class="radio-scale" :color="colorTheme" :checked='data.invoice_type == 1' style="transform: scale(0.7);" /><text style="margin-right: 10rpx;">{{i18n['个人或事业单位']}}</text>
          </label>
          <label class="radio flex align-center justify-end" @click="changeRise(2)">
            <radio class="radio-scale" :color="colorTheme" :checked='data.invoice_type == 2' style="transform: scale(0.7);" /><text>{{i18n['企业']}}</text>
          </label>
        </view>
      </view>
      <view class="flex fu-invoice-item">
        <view class="fu-invoice-item-title text-333">
          {{i18n['发票抬头']}}
        </view>
        <view class="fu-invoice-item-info text-666">
          <input type="text" class="" v-model="data.invoice_title" :placeholder="data.invoice_type == 1?i18n['填写需要开具发票的姓名']:i18n['填写需要开具发票的企业名称']" maxlength="30" />
        </view>
      </view>
      <view class="flex fu-invoice-item" v-show="data.invoice_type == 2">
        <view class="fu-invoice-item-title text-333">
          {{i18n['税号']}}
        </view>
        <view class="fu-invoice-item-info text-666">
          <input type="text" class="" v-model="data.invoice_company_duty_paragraph" :placeholder="i18n['纳税人识别号']"   maxlength="30" />
        </view>
      </view>
      <view style="text-align: center;height: 60rpx;line-height: 60rpx;" @click="clickArrow" v-show="data.invoice_type == 2">
        <text :class="isClick?'cuIcon-fold':'cuIcon-unfold'"></text>
      </view>
      <block v-if="data.invoice_type == 2 && isClick">
        <view class="flex fu-invoice-item" >
          <view class="fu-invoice-item-title text-333">
           {{ i18n['开户银行']}}
          </view>
          <view class="fu-invoice-item-info text-666">
            <input type="text" class="" v-model="data.invoice_company_bank" :placeholder="i18n['选填']" maxlength="30" />
          </view>
        </view>
        <view class="flex fu-invoice-item" >
          <view class="fu-invoice-item-title text-333">
           {{ i18n['银行账号']}}
          </view>
          <view class="fu-invoice-item-info text-666">
            <input type="number" class="" v-model="data.invoice_company_bank_num" :placeholder="i18n['选填']" maxlength="30" />
          </view>
        </view>
        <view class="flex fu-invoice-item" >
          <view class="fu-invoice-item-title text-333">
            {{i18n['企业地址']}}
          </view>
          <view class="fu-invoice-item-info text-666">
            <input type="text" class="" v-model="data.invoice_company_address" :placeholder="i18n['选填']" maxlength="60" />
          </view>
        </view>
        <view class="flex fu-invoice-item" >
          <view class="fu-invoice-item-title text-333">
            {{i18n['企业电话']}}
          </view>
          <view class="fu-invoice-item-info text-666">
            <input type="number" class="" v-model="data.invoice_company_phone" :placeholder="i18n['选填']" maxlength="30" />
          </view>
        </view>
      </block>
		</view>
    <!-- 发票明细 end -->

    <!-- 发票内容 start -->
    <view class="fu-invoice-wrap" style="margin-top: 20rpx;">
      <view class="flex fu-invoice-item">
        <view class="fu-invoice-item-title text-333">
          {{i18n['发票内容']}}
        </view>
        <view class="fu-invoice-item-info text-666">
          <text>{{i18n['明细']}}</text>
        </view>
      </view>
    </view>
    <!-- 发票内容 end -->

    <!-- 底部提示 start -->
    <view class="font-24 text-999" >{{i18n['发票内容将显示详细商品名称与价格信息。']}}</view>
    <view class="font-24 text-999" >{{i18n['部分商家可能开具发票内容为商品所属类别及价格信息，如有特殊需求，请向商家客服咨询。']}}</view>
    <!-- 底部提示 end -->

    <!-- 确认按钮 start -->
    <button  type="warn" class="submit-btn" @click="submitClick">
      <text>{{type == 1?i18n['确认']:i18n['提交']}}</text>
    </button>
    <!-- 确认按钮 end -->
	</view>
</template>

<script>
import {validate} from "@/common/utils/validate.js";
/**
 * @author 邓东方
 */
	export default {
    /**
     * @property {Number} type - 1确认订单页面进来：底部按钮为<确认>；2其他页面进来的：底部按钮为<提交>；
     * @property {Object} invoiceData - 发票内容详情
     * @property {Number} invoiceData.invoice_type - 1个人，2企业
     * @property {String} invoiceData.invoice_title - 发票抬头
     * @property {String} invoiceData.invoice_company_duty_paragraph - 税号
     * @property {String} invoiceData.invoice_company_bank - 开户银行
     * @property {String} invoiceData.invoice_company_bank_num - 银行账号
     * @property {String} invoiceData.invoice_company_address - 企业地址
     * @property {String} invoiceData.invoice_company_phone - 企业电话
     */
    props:{
      type:{
        type:Number,
        default:1
      },
      invoiceData:{
        type:Object,
        default:function(){
          let obj ={
            invoice_type:1,
            invoice_title:'',
            invoice_company_duty_paragraph:'',
            invoice_company_bank:'',
            invoice_company_bank_num:'',
            invoice_company_address:'',
            invoice_company_phone:'',
          }
          return obj
        }
      }
    },
		data() {
			return {
        isClick:false, // {Boolean} 是否展开企业发票明细
        data:{
          invoice_type:1,
          invoice_title:'',
          invoice_company_duty_paragraph:'',
          invoice_company_bank:'',
          invoice_company_bank_num:'',
          invoice_company_address:'',
          invoice_company_phone:'',
        }
			}
		},
    watch:{
      invoiceData:{
        handler(newVal,oldVal){
          this.data = newVal;
        },
        deep:true
      }
    },
    mounted() {
      console.log(this.invoiceData)
      this.data = this.invoiceData;
    },
    methods:{
      /**
       * @event
       * @description 选择抬头类型
       * @param {Number} type - 1：个人或事业单位；2：企业；
       */
      changeRise(type){
        this.data.invoice_type = type;
      },
      /**
       * @event
       * @description 展开企业发票明细
       */
      clickArrow(){
        this.isClick = !this.isClick;
      },
      /**
       * @event
       * @description 点击提交按钮
       */
      submitClick(){

        if(!this.data.invoice_title.trim()){
          this.$message.info(this.i18n['请输入发票抬头']);
          return;
        }
        if(this.data.invoice_type == 2){
          console.log(this.data)
          this.newObj = this.filterNull(this.data);
          if(!this.data.invoice_company_duty_paragraph.trim()){
            this.$message.info(this.i18n['请输入税号']);
            return;
          }
          if(/.*[\u4e00-\u9fa5]+.*$/.test(this.data.invoice_company_duty_paragraph)){
            this.$message.info(this.i18n['税号不能含有汉字']);
            return;
          }
          if(this.data.invoice_company_bank_num && !validate(this.data.invoice_company_bank_num,'card')){
            this.$message.info(this.i18n['银行卡号有误']);
            return;
          }
          console.log(validate(this.data.invoice_company_phone,'phone'))
          if(this.data.invoice_company_phone && !validate(this.data.invoice_company_phone,'phone')){
            this.$message.info(this.i18n['手机号有误']);
            return;
          }
        }else{
          this.data.invoice_company_duty_paragraph = '';
          this.data.invoice_company_bank = '';
          this.data.invoice_company_bank_num = '';
          this.data.invoice_company_address = '';
          this.data.invoice_company_phone = '';
        }
        this.$emit('change',this.data);
      },
      filterNull(obj){
        let newObj = obj
        if(typeof obj !== 'object' || Object.keys(obj).length === 0){
          return;
        }
        for(let attr in obj){
          if(obj[attr] === null || obj[attr] === 'null' ){
            newObj[attr] = '';
          }else{
            newObj[attr] = obj[attr];
          }
        }
        return newObj
      },
    }
	}
</script>

<style scoped lang="scss">
.fu-invoice-wrap{
  padding: 0 20rpx;
  box-sizing: border-box;
  background: #FFFFFF;
  border-radius: 24rpx;
}
.fu-invoice-item{
  height: 72rpx;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
  .fu-invoice-item-title{
    flex: 1;
  }
  .fu-invoice-item-info{
    font-size: 28rpx;
    flex: 2;
    text-align: right;
    input{
      font-size: 28rpx;
      text-align: right;

    }
  }
}
.font-24{
  font-size: 24rpx;
  margin-left: 32rpx;
}
.submit-btn{
  border-radius: 48rpx;
  margin: 50rpx 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: $bgtheme;
}
</style>
