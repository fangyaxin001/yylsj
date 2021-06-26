export const dev_host = 'http://zbphp.zhongbenzx.com'; // 开发环境域名
export const mock_host = 'http://mock.zhongbenruanjian.com'; // MOCK环境域名
export const product_host = 'http://zbphp.zhongbenzx.com'; // 生产环境域名

export const IS_DEV = 1;                              // 0:生产环境 1:开发环境 2:mock环境
export const PAGE_SIZE = 15;                          // 分页配置 每页条数

const host = IS_DEV == 2 ? mock_host : IS_DEV == 1 ? dev_host : product_host; // 项目中接口地址host
export const WEBSOCKET = 'ws://39.98.180.37:32321';
export const SHAREURL = host + '/h5/#/'; // 分享的H5地址
export const SERIAL = '13043af190e4dfff15102b9b6d30dc0c'; // 项目序列号(千万千万千万不要修改!!!!)

export const BASE_URL = `${host}`;                    // 基础路径
export const API_BASE_URL = `${host}/api`;            // 接口请求基础路径
export const UPLOAD_IMAGE_URL = `${host}/api/v1/5d5fa8984f0c2`; // 图片上传接口路径 UploadImage方法依赖此配置
export const UPLOAD_VIDEO_URL = `${host}/api/v1/5fc615f7da92b`; // 视频上传上传接口路径

export const IMG_BASE_URL = `${host}/upload/`;        // 图片基础路径 公共filters assembleImgSrc依赖此配置
// #ifdef APP-PLUS || H5
export const LOGIN_PAGE_URL = '/pages/user/login/login-code/index'; // 登录页面路由 request.js 依赖此配置 主要用于登录失效跳转
// #endif
// #ifdef MP-WEIXIN
export const LOGIN_PAGE_URL = '/pages/user/login/auth-login/index'; // 登录页面路由 request.js 依赖此配置 主要用于登录失效跳转
// #endif

const _platform = uni.getSystemInfoSync().platform;

export const SYSTEM_CONFIG = {                       // 系统配置
  logo: '/static/logo.png',
  appName: '中犇商城',
  appVersion: '1.0.0',
  // #ifdef APP-PLUS
  platform: _platform === 'android' ? 'Android' : 'IOS',
  // #endif
  // #ifdef H5
  platform: 'Web',
  // #endif
  // #ifdef MP-WEIXIN
  platform: 'Wechat',
  // #endif
  // #ifdef MP-ALIPAY
  platform: 'Alipay',
  // #endif
  // #ifdef MP-BAIDU
  platform: 'Baidu',
  // #endif
  // #ifdef MP-TOUTIAO
  platform: 'ByteBounce',
  // #endif
  // #ifdef MP-360
  platform: '360',
  // #endif
  // #ifdef QUICKAPP-WEBVIEW
  platform: 'FastApp',
  // #endif
}

export const needProductUrl = [
  
];

export const needLoginPages = [
  "/pages/user/address/address-list/index",
  "/pages/user/address/address-add/index",
  "/pages/index/setting/change-pay-password/index",
  "/pages/index/setting/modify-pay-password/index",
  "/pages/index/setting/change-password/index",
  "/pages/service-mssage/message/message-list/index",
  "/pages/user/user/info/index",
  "/pages/user/user/avatar-cropping/index",
  "/pages/index/setting/setting/index",
  "/pages/index/setting/feedback/index",
  "/pages/index/setting/my-feedback/index",
  "/pages/index/setting/verify-oldphone/index",
  "/pages/index/setting/change-newphone/index",
  "/pages/user/wallet/my-wallet/index",
  "/pages/user/wallet/consumer-detail/index",
  "/pages/user/wallet/recharge/index",
  "/pages/user/wallet/recharge-log/index",
  "/pages/user/wallet/withdraw/index",
  "/pages/user/wallet/withdraw-success/index",
  "/pages/user/wallet/account-bind/index",
  "/pages/user/wallet/alipay-bind/index",
  "/pages/user/wallet/wechat-bind/index",
  "/pages/user/user/my-favorites/index",
  "/pages/user/user/my-footprint/index",
  "/pages/order/afterorder/afterorder-apply/index",
  "/pages/order/afterorder/afterorder-status-list/index",
  "/pages/order/afterorder/afterorder-detail/index",
  "/pages/order/afterorder/afterorder-sendback/index",
  "/pages/order/order-process/confirm-order/index",
  "/pages/order/order-process/pay-order/index",
  "/pages/order/order-process/pay-success/index",
  "/pages/order/order-process/choos_coupon/index",
  "/pages/order/order-list/all-order/index",
  "/pages/order/orderdetail/order-detail/index",
  "/pages/order/orderdetail/express-delivery/index",
  "/pages/order/evaluation/order-evaluation/index",
  "/pages/news/article/article-favoriters/index",
  "/pages/goods/ask-answer/my-ask-answer/index",
  "/pages/service-message/message/message-type/index",
  "/pages/user/coupon/my-coupon/index",
  "/pages/integral/myintegral/my-integral/index",
  "/pages/distribution/distribution/my-distribution/index",
  "/pages/service-message/service/service-detail/index",
  "/pages/user/invite/user-invite/index",
]
