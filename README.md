# Fast-UI

## 使用说明
拉取项目后请首先 `npm install` 一下;
本项目集成colorUI框架(不强制使用);
本项目内置了苹方字体,不需要使用的可以删掉,可有效减小包体积
```js
1. 删除字体文件目录 /static/font
2. 删除引用代码 App.vue `48~52` 行
```
本项目内置了多语言切换,不需要使用可删除
```js
1. 删除 /lang 文件夹
2. 删除 main.js 第10行
```

## 项目目录结构
+ common
  + api
    + index.js `http请求入口`
    + request.js `http请求封装`
    + url.js `api统一管理文件`
  + filter
    + index.js `全局过滤器`
      + assembleImgSrc `图片路径补全`
      + formatDate `日期格式转换`
      + formatNumber `格式化数字,大于10000时转为1.0w`
      + formatTagNumber `格式化角标数字,大于99时显示99+`
  + function
    + debounce `防抖函数`
    + deepClone `深度克隆`
    + throttle `节流函数`
    + timeFormat `日期格式化`
    + timeFrom `计算多久以前`
  + mixin
    + index `全局混入`
    + paging_list `上拉加载,下拉刷新,有需要的地方单独混入`
  + utils
    + index.js `公共方法入口文件`
    + message.js `toast弹窗封装`
    + richText.js `富文本解析`
    + router.js `路由跳转方法封装`
    + upload-file-to-oss.js `上传文件到阿里云OSS`
    + upload-file-to-qiniu.js `上传文件到七牛云`
    + upload-image.js `上传图片到服务器`
    + utils.js `常用工具函数`
    + validate.js `常用正则验证`
  + config.js `APP配置文件`
+ components
  + app-update `升级弹窗组件,内置升级逻辑`
  + fu-activity-label `活动标签`
  + fu-advert `广告位组件,接受 typeid 参数,与后台配置的广告位对应,支持接受一,二,三张广告图,高度自适应`
  + fu-button `框架内置组件 按钮`
  + fu-custom `自定义头部组件(用法同colorUI自定义头部)`
  + fu-empty `框架内置组件 空布局 需搭配全局混淆的下拉刷新插件使用`
  + fu-empty-ui `空布局组件 纯UI样式`
  + fu-evaluate `商品评价组件 UI样式`
  + fu-filter-dropdown `商品列表 仿京东搜索组件,移到了 goods 分包 内`
  + fu-goods-address `商品详情地址选择组件`
  + fu-goods-block `商品列表双排排布局组件`
  + fu-goods-inline `商品列表单排布局组件`
  + fu-goods-label `商品标签`
  + fu-grid `首页金刚区组件 滑动布局`
  + fu-grid-2 `首页金刚区组件 双排布局`
  + fu-mall-list `积分商城列表 移入了 integral 分包内`
  + fu-loading `loading组件`
  + fu-mask `框架内置组件 遮罩`
  + fu-nologin `首页未登录提示组件`
  + fu-notwork `框架内置组件 断网检测`
  + fu-parse `富文本解析组件 不太好用`
  + fu-pay-keyboard `余额支付输入密码组件`
  + fu-payment-password `密码输入组件`
  + fu-pop-unfinished `返回顶部组件`
  + fu-popup `框架内置组件 弹窗`
  + fu-seckill-count-down `秒杀倒计时组件`
  + fu-share `分享组件`
  + fu-specs-popup `商品详情规格弹窗组件`
  + fu-star `五星好评`
  + fu-swiper `首页轮播图组件`
  + fu-tab `很赞的tab组件`
  + fu-tab-nav `首页分类导航组件`
  + fu-upload `多图上传组件`
  + fu-upload-video `视频上传组件`
  + fu-waterflow `商品推荐组件`
  + jyf-parser `富文本解析组件`
  + keyboard `支付密码组件`
  + uni-badge `数字角标`
  + uni-countdown `倒计时组件`
  + uni-icons `字体图标组件`
  + uni-load-more `加载更多状态组件`
  + uni-number-box `数字输入框`
  + uni-popup `弹窗组件`
  + uni-steps `步骤条`
  + w-picker `地址,时间,日期,选择器`
+ libs `依赖项`
  + day.js `时间格式化插件`
+ nativeplugins `原生插件`
  + BenBen-AliLogin ``
  + BenBen-AliLoginPush ``
  + BenBen-FaceRecognition ``
  + DCloud-RichAlert `快捷方式 当前版本会引起APP闪退,不建议使用`
  + DcloudFaceRecognition ``
+ static `静态资源`
  + empty `空布局组件用到的图片`
  + goods
    + goodsdetail `商品详情页用到的图片`
  + share `分享组件用到的图片`
  + tab `底部Tabbar用到的图片`
  + user `个人中心用到的图片`
+ store
  + index.js ``
+ style
  + animation.css `colorUI的动画样式`
  + common.scss `自定义样式`
  + icon.css `colorUI的图标`
  + iconfont.css `自定义图标`
  + main.css `colorUI的主样式文件`
+ .editorconfig `编辑器配置文件`
+ .gitignore `git忽略文件`
+ App.vue `项目入口文件`
+ main.js `项目启动文件`
+ manifest.json `项目配置文件`
+ pages.json `页面配置文件`
+ uni.scss `内置样式`



## 页面开发规范
+ 页面统一放入`pages`文件夹下
+ 页面路径与命名要和中台系统中工作台展示的的分类路径保持一致
  + 例如: 用户模块(一级分类(user)) -> 登录模块(二级分类(loin)) -> 手机号密码登录(login-password)
  + /pages/user/login/login-password.vue
+ 一级分类下的页面,用到的私有组件(非公共组件),统一放入页面所属一级分类下的components文件夹下
  + 例如: 手机号密码登录页面用到的第三方登录组件
  + /pages/user/components/wx-auth.vue
+ 一级分类下的页面,用到的静态资源(非通用资源),统一放入页面所属一级分类下的static文件夹下,同样static内的目录结构需要和分类下的路径一一对应
  + 例如: 手机号密码登录页用到的logo图标,属于通用资源,其他页面也会用到,所以放入项目根目录下的 static/images 文件下,而背景图是私有的,其他页面用不到,就需要放在 pages/user/static/login/login-password文件夹下
  + 页面内的data定义的变量,props传递的参数,methods内的方法需要写明注释
  + 开发完页面至少要保证APP端和小程序端的兼容性
    + 小程序胶囊按钮适配
    + iphoneX底部适配
    + ...

## 组件开发规范
+ 公共组件统一放入`components`文件夹下
+ 组件中使用的静态资源统一放入`static`文件夹下
+ 组件中一定要写说明文档,包含作者,说明,接收参数,使用示例等,具体参考`fu-button`组件

## 编码规范
+ 变量
	+ 使用驼峰命名法
	+ 所有变量都应有注释,多态变量要有详细说明
	+ example
```js
data(){
  return {
    id: '896', // 商品ID,数据从哪来,数据类型
    type: 0, // 0: 普通商品 1: 秒杀商品 2: 拼团商品
  }
}
```
+ 常量
	+ 全部大写
	+ 使用下划线链接
+ 方法
	+ 使用驼峰命名
	+ 每个方法都应有注释,使用文档注释类型,复杂函数内部须有逻辑判断注释,详细说明处理步骤
	+ example
```js
methods: {
	/**
	 * @description 测试函数,演示代码注释规范
	 * @param {string} type = 测试类型
	 * @param {string} id = 测试ID
   *
	 * */
	test(type,id){
    /**
     * @description 根据类型做不同操作
     * @param {string} type = 测试类型
     * */
    switch(type){
      case 0:
        // 未付款状态
        // 允许 取消订单操作
        // 允许 去支付操作
        // 修改支付按钮显示状态
        this.showBtn = true;
      break;
      case 1:
        // 已付款状态
        // 允许 申请售后操作
        // 允许 提醒发货操作
      break;
      case 2:
        // 已发货状态
        // 允许 申请售后操作
        // 允许 确认售后操作
      break;
    }
	},
}
```

[文档地址](http://wendang.zhongbenzx.com/guide/)
[原型地址](https://org.modao.cc/app/4306f0216652a701962410465e71492f5d7ec5b3#screen=skie5b61q7g0h08)
[蓝湖地址](https://lanhuapp.com/web/#/item/project/board?pid=3462f9c7-ea88-49b1-a461-b77f42b021a3)

目的:
补充模板页面,
统一代码规范,
统一页面开发标准

工作台使用:
贡献页面
下载页面
下载代码包

代码规范:
见上方

验收标准:
1. 页面还原度 95% 以上
2. template模板 结构清晰合理,可扩展,可自适应布局,删除其中一个模块,不影响整体样式布局
3. css代码同模板结构一一对应,可整块删除不影响其他模块
4. js代码注释清晰明了,定义的每一个变量要有注释,有多种状态的变量要详细说明每种状态代表的是什么意思,函数采用文档注释,写明函数功能,入参,出参,包含复杂逻辑的函数要写明逻辑判断流程,目标是谁拿到代码一看就能明白,就能修改.


## 基础包内置的组件包含
1. fu-button 按钮
2. fu-custom 自定义导航栏
3. fu-empty 内容为空
4. fu-empty-ui 内容为空(纯样式)
5. fu-modal 模态框(APP专属)
6. fu-mask 遮罩层
7. fu-notwork 无网络提示
8. fu-popup 弹出层
9. fu-tab Tab标签
10. fu-loading 加载动画
11. uni-icon ICON图标
12. uni-load-more 加载更多
13. uni-badge 数字角标
14. uni-countdown 倒计时
15. w-picker 选择器

## 新版打包模式改动
1. 以页面为单位进行资源管理,一个文件夹下包含页面文件,组件文件,资源文件,例如:
```js
pages
  tab
    home
      home
        index.vue // 页面文件 (名称固定为index.vue) (必选)
        // api.js // 接口文件 (暂不修改)
        // lang.js // 语言包文件 (暂不修改)
        components // 页面依赖组件(基础包内置的不需要放在这里) (非必选)
          advert
            advert.vue // 广告位组件
        static // 页面依赖的静态资源文件,没有可不创建此文件夹(非必选)
          a.png
```
2. 跳转路径的改变,原有的跳转路径 `pages/tab/home/home` 改为 `pages/tab/home/home/index`
3. 图片资源路径的改变 `@/static/home/home/a.png` 改为 `./static/a.png`
4. 由于组件挪到了页面下单独管理,因此页面需要手动引入依赖的组件,之前的自动引入只对公共组件生效,例如
```html
<template>
  <view>
    <navigator url="/pages/tab/home/home/index" type="switchTab"></navigator>
    <image src="./static/a.png"></image>
    <fu-advert></fu-advert>
  </view>
</template>
```
```js
import FuAdvert from './components/fu-advert/fu-advert.vue';
export default {
  components: {
    FuAdvert,
  },
}
```
### 快速更新技巧
1. 字符搜索(当前文件) `/pages/` 看当前页面是否有跳转路径,有则统一在原路径后面加上 `/index`
2. 字符搜索(当前文件) `.png` 看当前页面是否有静态资源,有则把静态资源移动到页面下的`static`文件夹下,并替换引用路径
3. 查看模板中是否引用了内置组件之外的组件,有则移动到页面下的`components`文件夹下,同时在页面手动引入组件
4. 将文件夹打包成zip文件,即可上传到工作台中
5. 举个例子:
```html
  common
  pages
    goods
      goodsdetail
        goods-detail   <----- 打包此文件夹,生成goods-detail.zip文件
          index.vue
          components
            fu-share.vue
          static
            left.png
```

+ pages/user/login/login-password 密码登录01-1
+ pages/user/login/login-code 验证码登录01-1
+ pages/user/login/forget 忘记密码01-1
+ pages/user/login/register 注册01-1
+ pages/user/login/bind-phone 第三方登录绑定手机号01-1
+ pages/user/address/address-list 地址管理 01-1
+ pages/user/address/address-add 添加/编辑地址页 01-1
+ pages/index/setting/change-pay-password 设置和修改支付密码 01-1
+ pages/index/setting/change-password 修改密码-旧密验证01-1
+ pages/tab/my/my 个人中心 01-1
+ pages/user/user/info 我的资料01-1
+ pages/user/user/avatar-cropping 裁剪图片01-1
+ pages/user/login/user-agreement 通用协议01-1
+ pages/index/setting/feedback 提交反馈 01-1
+ pages/index/launch/launch-page 商城引导页 01-1
+ pages/user/user/my-favorites 我的收藏01-1
+ pages/user/user/my-footprint 我的足迹01-1
+ pages/user/coupon/my-coupon 我的优惠券01-1
+ pages/user/signin/signin-page 每日签到01-1
+ pages/user/signin/signin-history 签到历史
+ pages/integral/myintegral/my-integral 我的积分01-1
+ pages/integral/myintegral/integral-points-rules 积分规则01-1
+ pages/integral/myintegral/integral-exchange-record 积分兑换记录01-1
+ pages/integral/integralgoods/integral-goods-list 积分商城01-1
+ pages/integral/integralgoods/integral-goods-detail 积分商品详情01-1
+ pages/integral/integralgoods/exchange-success 兑换成功01-1
+ pages/integral/integralgoods/integral-order-detail 积分订单详情01-1
+ pages/activity/advance/advance-list 预售活动列表页01-1
+ pages/activity/advance/advance-detail 预售商品详情01-1
+ pages/activity/seckill/seckill-list 秒杀活动列表01-1
+ pages/activity/seckill/seckill-detail 秒杀商品详情页01-1
+ pages/tab/home/shopindex 商城首页 01-1
+ pages/tab/cate/cate-three 商品三级分类 01-1
+ pages/tab/cart/cart-page 单商户商城购物车 01-1
+ pages/service-message/service/service-detail 平台客服 01-1
+ pages/activity/assemble/assemble-list 拼团活动列表01-1
+ pages/activity/assemble/assemble-detail 拼团活动商品详情01-1
+ pages/activity/assemble/my-assemble 我的拼团列表01-1
+ pages/service-message/message/message-system 系统消息 01-1
+ pages/index/help/help 帮助与反馈 01-1
+ pages/index/help/help-detail 帮助详情 01-1
+ pages/index/search/search 搜索 01-1
+ pages/goods/goodslist/goods-search 商品搜索结果 01-1
+ pages/index/setting/modify-password-verify-phone 修改绑定手机号 01-1
+ pages/index/setting/about 关于我们 01-1
+ pages/index/setting/modify-password 修改密码方式01-1
+ pages/index/setting/modify-change-password 修改密码-密码确认01-1
+ pages/order/order-list/all-order 我的订单01-1
+ pages/service-message/message/message-type 消息 01-1
+ pages/index/setting/my-feedback 历史反馈01-2
+ pages/index/setting/modify-pay-password 修改支付密码列表01-1
+ pages/order/orderdetail/order-detail 订单详情01-1
+ pages/service-message/message/message-list 订单消息 01-1
+ pages/service-message/message/message-detail 消息详情 01-1
+ pages/order/order-process/pay-order 立即支付01-1
+ pages/order/order-process/pay-success 支付成功
+ pages/index/setting/setting 系统设置 01-1
+ pages/index/setting/change-newphone 绑定新手机号 01-1
+ pages/user/signin/signin-rule 签到规则01-1
+ pages/index/setting/modify-password-verify-phone 修改密码-手机验证码验证01-1
+ pages/order/order-process/confirm-order 确认订单01
+ pages/order/order-process/choose_invoice 申请发票
+ pages/goods/goodsdetail/goods-comment 商品全部评价01-1
+ pages/goods/goodsdetail/goods-detail 商品详情 01-1
+ pages/goods/goodslist/goods-search 商品列表 01-1
+ pages/goods/ask-answer/ask-answer-list 问答
+ pages/goods/ask-answer/go-answer 我来回答
+ pages/goods/ask-answer/my-ask-answer 我的问答
+ pages/goods/ask-answer/problem-detail 问题详情
+ pages/goods/ask-answer/publish-ask-answer 发布问题
+ pages/activity/bargain/bargain-list 砍价商品列表01-1
+ pages/activity/bargain/bargain-detail 砍价商品详情01-1
+ pages/activity/bargain/bargain-log 砍价记录01-1
+ pages/activity/bargain/start-bargain 开始砍价01-1
+ pages/activity/bargain/help-bargain 帮好友砍价01-1
+ pages/news/article/article-comment 文章评论
+ pages/news/article/article-detail 文章详情
+ pages/news/article/article-favoriters 文章收藏
+ pages/news/article/article-list 文章列表
+ pages/news/article/article-search 文章搜索
+ pages//distribution/my-distribution 我的分销01-1
+ pages//distribution/promotersOrder 我的分销订单统计01-1
+ pages//distribution/promoters 我的分销推广人统计01-1
+ pages//distribution/incomeStatistics 分销收益统计01-1
+ pages/user/user/authentication 实名认证
+ pages/user/wallet/my-wallet 我的钱包01-1
+ pages/user/wallet/account-bind 绑定账户01-1
+ pages/user/wallet/withdraw-detail 提现明细01-1
+ pages/user/wallet/withdraw 余额提现 01-1
+ pages/user/wallet/alipay-bind 支付宝绑定01-1
+ pages/user/wallet/wechat-bind 微信绑定01-1
+ pages/user/wallet/consumer-detail 余额明细01-1
+ pages/index/advert/ad 广告页 01-1
+ pages/user/wallet/withdraw-success 提交提现成功
+ pages/order/afterorder/afterorder-apply 售后申请01-1
+ pages/order/afterorder/afterorder-status-list 售后处理中列表01-1
+ pages/order/afterorder/afterorder-detail 售后详情01-1
+ pages/order/afterorder/afterorder-sendback 填写寄回信息01-1
+ pages/order/evaluation/order-evaluation 查看订单评价 01-1
+ pages/user/coupon/get_coupon 领券中心 01-1
+ pages/integral/integral-order-process/confirm-order 积分确认下单
+ pages/integral/integral-order-process/pay-order 积分支付订单
+ pages/user/invite/user-invite 邀请好友海报
+ pages/user/invoice/invoice-list 发票列表01-1
+ pages/user/invoice/order-invoice 订单发票01-1
+ pages/user/invoice/invoice-info 发票详情01-1
+ pages/order/orderdetail/express-delivery 物流详情
+ pages/tab/my/my 我的-01-1
+ pages/user/user/info 我的资料 -01-1
+ pages/user/user/avatar-cropping 裁剪图片01-1
+ pages/index/setting/feedback 意见反馈
+ pages/index/setting/about 关于我们 01-1
+ pages/index/setting/my-feedback 反馈记录
+ pages/order/order-process/pay-success 支付结果 -01-1
+ pages/index/setting/setting 系统设置
+ pages/user/login/login-password 登录-01-3
+ pages/user/login/register 注册-01-3
+ pages/user/login/forget 忘记密码-01-3
+ pages/user/login/user-agreement 用户注册协议-01-3
+ pages/user/login/user-agreement 隐私政策-01-3
+ pages/member/vip/vip 会员-时长 -01-3
+ pages/member/vip/pay-vip 立即支付-购买会员 -01-3
+ pages/member/vip/pay-vip-success 支付结果-购买会员 -01-3