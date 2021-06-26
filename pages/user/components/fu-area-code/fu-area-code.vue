<template>
  <view class="page"  v-if="show">
      <view class="mask" @click="close" :class="isOpen?'open':'close'"></view>
      <view class="page-content flex flex-direction" :class="isOpen?'open':'close'">
        <view class="page-top">
          <view class="cuIcon-roundclose close" @click="close"></view>
          <view class="text-333 text-lg text-bold text-center" >{{i18n['请选择国际电话区号']}}</view>
          <view class="text-333 text-lg margin-top-lg margin-bottom-sm">{{i18n['常用区号']}}</view>
          <view class="commonly-used-code text-333 text-df flex justify-between flex-wrap">
            <view class="commonly-code" @click="chooseCode(86)">{{i18n['中国大陆 +86']}}</view>
            <view class="commonly-code" @click="chooseCode(852)">{{i18n['中国香港 +852']}}</view>
            <view class="commonly-code" @click="chooseCode(853)">{{i18n['中国澳门 +853']}}</view>
            <view class="commonly-code" @click="chooseCode(886)">{{i18n['中国台湾 +886']}}</view>
          </view>
        </view>
        <scroll-view scroll-y="true"  class="all-code-wrap" style="height:calc(100% - 342rpx);" :scroll-into-view="codeId" :scroll-with-animation="true">
          <view class="area-code">
            <block  v-for="(item,index) in objList" :key="index">
              <view class="code-title" :id="index">{{index}}</view>
              <block v-for="(oItem,oIndex) in item" :key="oItem.country">
                <view class="code-title" @click="chooseCode(oItem.prefix)">{{oItem.country}}</view>
              </block>
            </block>
          </view>
        </scroll-view>
        <view class="letter text-333 flex flex-direction justify-around align-center"  >
          <block v-for="(item,index) in letterList" :key="index">
            <view class="" @click="chooseCodeId(item)">{{item}}</view>
          </block>
        </view>
      </view>
  </view>
</template>

<script>
  export default{
    data(){
      return{
        isOpen:false,
        letterList:[],//右侧字母数组
        objList:{},//国际区号数据
        codeId:'A',// scroll-view 楼层跳转
        show:false,
      }
    },
    watch:{
      isOpen(newVal,oldVal){
        if(!newVal){
          setTimeout(()=>{
            this.show = false;
          },300)
        }else{
          this.show = true;
        }
      }
    },

    mounted() {
      this.getAreaCode();
      console.log(this._style)
    },
    methods:{
      /**
       * @description 关闭弹窗
       */
      close(){
        this.codeId = 'A';
        this.isOpen = false;
      },
      /**
       * @description 打开弹窗
       */
      open(){
        this.isOpen = true;
      },
      /**
       * @param {String} codeId A B C D ....
       */
      chooseCodeId(codeId){
        if(codeId == '↑'){
          this.codeId = 'A';
          return;
        }
        this.codeId = codeId;
      },
      /**
       * @description 国际区号返回
       * @param {String,Number} code 国际区号
       */
      chooseCode(code){
        this.close();
        this.$emit('change',code);

      },
      /**
       * @description 获取国际区号数据
       */
      getAreaCode(){
        this.$api.post(global.apiUrls.getAreaCode,{}).then(res=>{
          console.log(res);
          if(res.data.code == 1){
            let obj = res.data.data;
            let letterList = [];
            for(let attr in obj){
              letterList.push(attr);
            }
            letterList.unshift('↑');
            this.letterList = letterList;
            this.objList = obj;
          }else{
            this.isOpen = false;
            this.$message.info(res.data.msg);
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page{

    .mask{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0);
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 9998;
      &.open{
        animation: light 0.3s ease;
        background: rgba(0,0,0,.3);
      }
      &.close{
        animation: dark 0.3s ease;
        background: rgba(0,0,0,0);
      }
    }

  }
  @keyframes light{
    0%{
      background: rgba(0,0,0,0);
    }
    100%{
      background: rgba(0,0,0,.3);
    }
  }
   @keyframes dark{
    0%{
      background: rgba(0,0,0,.3);
    }
    100%{
      background: rgba(0,0,0,0);
    }
  }
  @keyframes open{
    0%{
      height: 0%;
    }
    100%{
      height: 78%;
    }
  }
   @keyframes down{
    0%{
      height: 78%;
    }
    100%{
      height: 0%;
    }
  }
.page-content{
  position: fixed;
  bottom: 0;
  height:0%;
  width: 100%;
  background: #FFFFFF;
  z-index: 9999;
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  &.open{
    animation: open 0.3s ease;
    height:78%;
  }
  &.close{
    animation: down 0.3s ease;
    height:0%;
  }
  .page-top{
    padding: 34rpx 32rpx 0;
    box-sizing: border-box;
  }
  .close{
    position: absolute;
    top: 32rpx;
    right: 32rpx;
    font-size: 40rpx;
  }
}
.commonly-used-code{
  padding-bottom: 8rpx;
  .commonly-code{
    width: 210rpx;
    height: 64rpx;
    line-height: 64rpx;
    background: #F2F3F4;
    border-radius: 8rpx;
    font-weight: 400;
    text-align: center;
    margin-bottom: 12rpx;
  }
}
.all-code-wrap{
  flex: 1;
  position: relative;
  padding-left: 32rpx;

  .code-title{
    height: 72rpx;
    line-height: 72rpx;

  }
}
.letter{
    width: 60rpx;
    height:calc(78% - 342rpx - 30rpx);
    height:calc(78% - 342rpx - 30rpx - constant(safe-area-inset-bottom));
    height:calc(78% - 342rpx - 30rpx - env(safe-area-inset-bottom));
    font-size: 22rpx;
    text-align: center;
    position: fixed;
    right: 0;
    bottom: 30rpx;
    bottom: calc(30rpx + constant(safe-area-inset-bottom));
    bottom: calc(30rpx + env(safe-area-inset-bottom));
  }

</style>
