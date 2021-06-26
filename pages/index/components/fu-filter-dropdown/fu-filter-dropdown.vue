<template>
  <view id="wrapper" class="wrapper bg-white solid-bottom" :style="[{top: top+'px'}]">
    <view id="content1" class="padding-lr flex content1 " style="height: 108rpx;">
      <view class="flex-sub flex align-center justify-center text-666" :class="[{'active': curFilter == 0}]"
        @click="filterClick(0)">
        <text class="text-df margin-right-xs">{{selects[curSelected].title}}</text>
        <view class="flex flex-direction">
          <!-- <view v-if="showTopPop && (curFilter == 0)" class="cuIcon-fold" style="font-size: 20rpx;"></view> -->
          <!-- <view v-else class="cuIcon-unfold" style="font-size: 20rpx;"></view> -->
        </view>
      </view>
      <view class="flex-sub flex justify-center align-center text-666" :class="[{'active': curFilter == 1}]"
        @click="filterClick(1)">
        <text class="text-df">{{i18n['销量']}}</text>
      </view>
      <view class="flex-sub flex justify-center align-center text-666" 
        @click="filterClick(2)">
        <text class="text-df margin-right-xs" :class="[{'active': curFilter == 2}]">{{i18n['价格']}}</text>
        <view class="flex flex-direction align-center justify-center price-icon">
          <view  :class="[{'active': curFilter == 2 && order == 'asc' }]" class="scale cuIcon-triangleupfill" ></view>
          <view :class="[{'active': curFilter == 2 && order == 'desc'}]" class="scale cuIcon-triangledownfill" ></view>
        </view>
      </view>
      <view class="flex right justify-between">
        <view class="flex justify-center align-center" @tap="changeLayout">
          <text v-if="model == 'block'" class="cuIcon-apps text-666" style="font-size: 36rpx;"></text>
          <text v-else class="cuIcon-list text-666" style="font-size: 36rpx;"></text>
        </view>
        <!-- <view class="flex justify-center align-center text-333" :class="[{'active': curFilter == 3}]" @tap="filterClick(3)">
          <text class="text-df">商铺</text>
        </view> -->

      </view>
    <!-- <view class=" flex align-center justify-end" @click="drawerhandle">
        <text class="text-999 text-sm">{{i18n['筛选']}}</text>
        <text class="cuIcon-filter text-333"></text>
      </view> -->
    </view>
      <fu-popup v-model="showDrawer" mode="right"  :safe-area-inset-bottom="true" :border-radius="0" width='70%'>
      <view class="container "  :style="[{paddingTop: StatusBar+'px'}]">
        <scroll-view class="pop-content" scroll-y>
          <view class="title" style="font-size: 32rpx;margin-bottom: 30rpx;">
            {{i18n['筛选']}}
          </view >

          <view class="brand title"  v-if='brandList.length != 0'>
            {{i18n['品牌']}}
          </view>
          <view class='service serviceItem' v-if='brandList.length !=0'>
            <text v-for='item in brandList' class="list-item ml-4 padding-tb-xs padding-lr text-sm text-333 radius" :class="[{'active2': item.selected}]" @click='Choice(item)'>{{item.brand_name}}</text>
            <text></text>
          </view>
		  <view class="title">
		    {{i18n['价格']}}
		  </view>
		  <view class='price-round flex align-center'>

		    <view  class="round list-item"> <input  :placeholder="i18n['最低价']" type="number" v-model='minVal' maxlength="10"    @confirm="getGoodNumber" >  </view>
		    <view class="border-center">-</view>
		    <view  class="round list-item ml-4"> <input  :placeholder="i18n['最高价']" type="number" v-model='maxVal' maxlength="10"  @confirm="getGoodNumber" >  </view>
		  </view>

        </scroll-view>
        <view class="action-box pop-btn">
          <view class="action reset" @tap.stop="resetPop">{{i18n['重置']}}</view>
          <!-- <view class="action confirm" @tap.stop="confirmPop">确定<text v-if='num || num ==0'>({{num | formatNumber('w+')}}件商品)</text></view> -->
          <view class="action confirm" @tap.stop="confirmPop">{{i18n['确定']}}</view>
        </view>
      </view>
  </fu-popup>
  </view>
</template>

<script>
  export default {
    props: {
      top: {
        type: [String, Number],
        default: 0,
      },
      filterKeyword:{
        type:[String]
      },
      cid:{
        type:[String,Number]
      }
    },
    data() {
      return {
        num:0, // 高级搜索结束商品数量显示
        minVal:'',// 最小价格
        maxVal:'', // 最大价格
        goodsSkuList:[], // 高级筛选商品sku列表
        goodsServiceLabel:[], // 服务
        brandList:[], // 品牌
        typeList:[], // 分类
        allTypeList:[], // 总分类
        typeVal:'', // 高级搜索cid 商品id
        selects: [
          {
            title: global.i18n['综合'],
            type: 'multiple'
          }
        ],  // 综合
        curSelected: 0, // 综合排序初始值
        curFilter: 0, // 价格排序方式
        filterType: 'multiple', // 排序类型
        order: 'asc', // 升序:asc 倒序:desc
        model: 'block', // inline block
        windowWidth: 0, // 页面宽
        windowHeight: 0, // 页面高
        showDrawer: false, // 侧边遮罩
      };
    },
    watch:{
      // filterKeyword(newVal,oldVal){
      //   console.log('filterKeyword',newVal)
      //   this.resetPop();
      // },
      'filterKeyword':{
        handler(newVal,oldVal){
          console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX')
          this.resetPop();
        },
        immediate:true,
      }
    },
    mounted(){
      this.getListData()
      this.getGoodNumber()
    },
    methods: {
      // sku筛选
      selectSkuListChoice(item){
        this.$set(item, 'selected', !item.selected);
        this.getGoodNumber()
      },
      // 获取商品数量
      getGoodNumber(){
          // 获取已选中的服务
          let goodsServiceLabel =[];
        this.goodsServiceLabel.forEach(item=>{
          if(item.selected){
            goodsServiceLabel.push(item.label_id)
          }
        })
        // 获取已选中的品牌
        let brandList =[];
        this.brandList.forEach(item=>{
          if(item.selected){
            brandList.push(item.brand_id)
          }
        })
            // 获取已选择的sku内容
            let skuList =[];
        console.log(this.goodsSkuList )
        for(let obj in this.goodsSkuList ){
          this.goodsSkuList[obj].forEach(j=>{
            if(j.selected){
              skuList.push(j.id)
            }
          })
        }
        skuList =skuList.join(',')
        brandList= brandList.join(',')
        goodsServiceLabel= goodsServiceLabel.join(',')
        // console.log(this.typeVal,this.minVal,this.maxVal,brandList,goodsServiceLabel)
        if(this.minVal &&  this.maxVal){
          if(Number(this.minVal) >  Number(this.maxVal)){
            [this.minVal,this.maxVal] =[this.maxVal,this.minVal]
          }
        }
        // 判断cid存在（分类页过来的时候直接使用）
        if(this.cid){
          this.typeVal = this.cid
        }
        let filterObj={
          sku_id:skuList,
          brand_id:brandList,
          goods_cid:this.typeVal,
          service_lable_id:goodsServiceLabel,
          min_price: Number(this.minVal).toFixed(2),
          max_price: Number(this.maxVal).toFixed(2),
          keyword:this.filterKeyword
        }
        this.$api.post(global.apiUrls.getGoodNumber, filterObj)
          .then(res => {
            console.log('搜索商品数量', res.data)
            if (res.data.code == '1') {
                this.num = res.data.data
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      // 品牌筛选
      Choice(item){
        this.$set(item, 'selected', !item.selected);
        this.goodsSkuList =[]
        if(this.allTypeList.allType.length >0){
          this.getNewTypeListData()
        }
        this.getGoodNumber()
      },
      //分类重置 去重
      getNewTypeListData(){
        this.typeVal =''
        let newTypeData=[];
        let deWeightData =[];
        this.typeList =[]
        this.brandList.forEach((item,index)=>{
          if(item.selected){
            newTypeData = newTypeData.concat(this.allTypeList[item.brand_id])
            newTypeData.forEach(item=>{
            let flag =false;
              deWeightData.forEach(j=>{
                if(j.cid == item.cid){
                  flag =true
                }
              })
              if(!flag){
                deWeightData.push(item)
              }
            })
          }
        })
        // console.log(deWeightData)
        this.typeList = deWeightData
        // 获取已选中的品牌
        let brandList =[];
        this.brandList.forEach(item=>{
          if(item.selected){
            brandList.push(item.brand_id)
          }
        })
        // 未选中品牌，显示所有分类
        if(brandList.length ==0){
          this.typeList = this.allTypeList.allType
        }
      },
      // 服务筛选
      selectServeChoice(item){
        this.$set(item, 'selected', !item.selected);
        this.getGoodNumber()
      },
      // 分类筛选
      selectTypeChoice(item){
        this.goodsSkuList =[]
        if(this.typeVal == item.cid){
          this.typeVal =''
        }else{
          this.typeVal = item.cid
          this.getGoodsSkuList(item.cid)
        }
        this.getGoodNumber()
      },
      // 分类获取不同的sku信息
      getGoodsSkuList(val){
        console.log(1111111111,val)
        let data ={
          goods_cid:val
        }
        this.$api.post(global.apiUrls.getGoodsSkuList, data)
          .then(res => {
            console.log('sku列表结果', res.data)
            if (res.data.code == '1') {
              console.log(res.data.data)
                this.goodsSkuList =res.data.data
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      // 获取高级搜索得索引列表
      getListData(){
        let data ={
          keyword: this.filterKeyword,
          goods_cid:this.cid
        }
        this.$api.post(global.apiUrls.advancedSearch, data)
          .then(res => {
            if (res.data.code == 1) {
              data = res.data.data;
              this.goodsServiceLabel =data.goodsServiceLabel;
              this.brandList =data.brandList;
              this.typeList =data.typeList.allType;
              this.allTypeList =data.typeList
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      // 重置筛选条件
      resetPop() {
        this.typeVal = ''
        this.minVal = ''
        this.maxVal = ''
        this.goodsSkuList =[]
        this.brandList =[]
        this.goodsServiceLabel =[]
        // setTimeout(()=>{
           this.getListData()
          this.getGoodNumber()
          this.confirmPop(false)
        // },200)
      },
      // 提交确认高级筛选
      confirmPop(val) {
          // 获取已选中的服务
        let goodsServiceLabel =[];
        this.goodsServiceLabel.forEach(item=>{
          if(item.selected){
            goodsServiceLabel.push(item.label_id)
          }
        })
        // 获取已选中的品牌
        let brandList =[];
        this.brandList.forEach(item=>{
          if(item.selected){
            brandList.push(item.brand_id)
          }
        })
        // 获取已选择的sku内容
        let skuList =[];
        console.log(this.goodsSkuList )
        for(let obj in this.goodsSkuList ){
          this.goodsSkuList[obj].forEach(j=>{
            if(j.selected){
              skuList.push(j.id)
            }
          })
        }
        skuList =skuList.join(',')
        brandList= brandList.join(',')
        goodsServiceLabel= goodsServiceLabel.join(',')
        if(this.minVal &&  this.maxVal){
          if(Number(this.minVal) >  Number(this.maxVal)){
            [this.minVal,this.maxVal] =[this.maxVal,this.minVal]
          }
        }
        let filterObj={
          sku_id:skuList,
          brand_id:brandList,
          goods_cid:this.typeVal,
          service_lable_id:goodsServiceLabel,
          min_price: Number(this.minVal).toFixed(2),
          max_price: Number(this.maxVal).toFixed(2),
        }

        this.curFilter = 0;
        this.isSearchShop = false;
        this.$emit('changeFilter', this.curFilter, this.order,filterObj);
        console.log(filterObj)
        if(!val) return ;
        console.log(val);
        this.showDrawer = false;

		// if(skuList!='' || brandList!='' || goodsServiceLabel!='' || Number(this.minVal).toFixed(2) !='0.00' || Number(this.maxVal).toFixed(2)!='0.00' || this.filterKeyword!=''){
		// 	this.$emit('changeFilter', this.curFilter, this.order,filterObj);
		// 	if(!val) return ;
		// 	this.showDrawer = false;
		// }else{
		// 	// this.$message.info('请选择或输入内容')
		// 	return
		// }

      },
      // 上层筛选条件
      async filterClick(type) {
        let oldType = this.curFilter;
        switch (type) {
          case 0:
            if (oldType != 0) {
              this.curFilter = 0;
            }
            this.order = 'asc';
            break;
          case 1:
            this.curFilter = 1;
            this.order = 'desc';
            break;
          case 2:
            if (oldType == 2) {
              if (this.order == 'asc') {
                this.order = 'desc';
              } else {
                this.order = 'asc';
              }
            } else {
              this.order = 'asc';
              this.curFilter = 2;
            }
            break;
          case 3:
            this.curFilter = 3;
            this.order = 'asc';
            break;
        }
        this.$emit('changeFilter', this.curFilter, this.order);
      },
      // 打开筛选侧边弹窗
      drawerhandle() {
        this.showDrawer = true;
      },
      // 综合排序切换
      selectHandle(index) {
        this.curSelected = index;
        this.filterType = this.selects[index].type;
        this.showTopPop = false;
      },
      // 排列布局切换
      changeLayout() {
        if (this.model == 'inline') {
          this.model = 'block';
        } else {
          this.model = 'inline';
        }
        this.$emit('changeFilter', this.curFilter, this.order);
        this.$emit('changeLayout', this.model);
      },
    },
    created() {
      let info = uni.getSystemInfoSync();
      this.windowWidth = info.windowWidth;
      this.windowHeight = info.windowHeight;
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    position: sticky;
    z-index: 9999;

    .content1 {
      .right {
        width: 80rpx;
        position: relative;
        padding-left: 20rpx;
      }

      // .right::after {
      //   content: "";
      //   width: 2rpx;
      //   height: 26rpx;
      //   background-color: #999999;
      //   position: absolute;
      //   top: 50%;
      //   left: 50%;
      //   transform: translateX(-50%) translateY(-50%);
      // }
    }

    .content2 {
      padding: 0 30rpx 20rpx 30rpx;

      .left {
        width: calc(100% - 100rpx);
        white-space: nowrap;

      }

      .right {
        width: 100rpx;
      }
    }

    .masks {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: transparent;
      display: flex;
      flex-direction: column;

      .top {
        background-color: rgba(0, 0, 0, 0);
      }

      .bot {
        flex: 1;
        background-color: rgba(0, 0, 0, 0.7);

        .container {
          border-radius: 0 0 16rpx 16rpx;
          background-color: #F5F5F5;
          padding: 30rpx;

          .scroll-view {
            max-height: 300rpx;
          }
        }
      }
    }

    .active {
      color: $theme !important;
    }

    .active2 {
      box-shadow: inset 0 0 2rpx 2rpx $theme;
      background-color: rgba(240, 35, 37, 0.1) !important;
      color: $theme;
    }

    .active3 {}

    .masks2 {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: flex-end;

      .container {
        width: 70%;
        height: 100%;
        border-radius: 16rpx 0 0 16rpx;
        background-color: #FFFFFF;
      }
    }
  }



  .action-box {
    display: flex;
    margin-top: 30rpx;

    .action {
      flex: 1;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 62rpx 0px 0px 62rpx;;
      font-size: 24rpx;
      text-align: center;
    }

    .action+.action {
      margin-left: 4rpx;
	  border-radius: 0px 62px 62px 0px;
    }

    .reset {
      color: #fff;
      background-color: #FFA264;
    }

    .confirm {
      color: #FFFFFF;
	  background: $bgtheme;
    }
  }

  .block-28 {
    width: 28rpx;
    height: 28rpx;
  }
  .scale {
    font-size: 32rpx !important;
   
    &.cuIcon-triangleupfill{
      line-height: 20rpx;
    }
    &.cuIcon-triangledownfill{
      line-height: 20rpx;
    }
  }

  .translateTop {
    // transform: translateY(5rpx);
    /*  */
  }

  .translateBot {
    // transform: translateY(-5rpx);
  }

  .pop-btn {
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: 20rpx;
    background: #fff;
    border-top: 1rpx solid #f1f1f1;
    margin-top: 0;
  }

  .pop-content {
    height: 92%;
    padding: 20rpx;
    padding-bottom: 120rpx;
  }

  .title {
    font-weight: 500;
    color: #000;
	margin-top: 20rpx;
  }

  .list-item {
    background-color: #F5F5F5;
    display: inline-block;
    margin-bottom: 20rpx;
  }
  .serviceItem{
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-between;
	  width: 100%;
	  text{
		  width: 31%;
		  margin: 0 0 16rpx 0;
		  padding: 20rpx 0;
		  text-align: center;
		  border-radius: 20rpx;
	  }
  }
  .ml-20 {
    margin-left: 20rpx;
  }
  .ml-4 {
    margin-left: 4rpx;
  }

  .service {
    margin-top: 20rpx;
  }
  .price-round{
    padding: 20rpx 10rpx;
	.round{
		padding: 10rpx 0;
		text-align: center;
		background: #fff;
		border: 1px solid #ccc;
	}
  }
  .price-round input{
    font-size: 24rpx;
    height: 50rpx;
    padding: 0 60rpx;
  }
  .border-center{
    height: 50rpx;
    margin: 0 15rpx ;
  }
  .scale.cuIcon-triangledownfill{
line-height: 12rpx;
}
.scale.cuIcon-triangleupfill{
  line-height: 12rpx;
}
</style>
