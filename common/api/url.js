const publicApi = {
  publicUpdateAPP: '/v1/5f3de8d284639', // 静默更新
  postRecommentGoods: '/v1/5fd9a32379116', // 智能推荐
}
const modulesFiles = require.context('../../pages/',true,/\api.js$/);
const modules = modulesFiles.keys().reduce((modules,modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/,'$1');
  const value = modulesFiles(modulePath);
  Object.assign(modules,value.default);
  return modules;
},publicApi);
export default modules;

/**
 * 如果是第一套代码,删掉下面的对象即可
 * 如果不是第一套代码,导出下面的对象即可
 * 如果哪一套的代码都有,下面的对象合并到上面的对象即可
 * */

const del = {
  editUserinfo: '/v1/5cb54af125f1c', // 编辑用户信息
  postOperationGetColumn: '/v1/5d63befcb25d9', // 获取指定的文章单页信息
  myFeedback: '/v1/5cb97ad30ea88', //我提交的意见反馈
  postWinningList: '/v1/5fdc61683cd1b', // 中奖列表
  getSendGift: '/v1/5fdc7f57b1357', // 领取奖品
  getPaySuccessCoupon: '/v1/5fe2f74b38a06 ',//支付成功后的领取优惠卷
  postReceiveCoupon: '/v1/5d8f00ee67072', // 领取优惠券
  isSetPay: '/v1/5f64a4d364b44', // 判断用户是否设置支付密码
  postloginByAccount: '/v1/5c78dbfd977cf', // 账号密码登录
  postUserSocialLogin: '/v1/5d7660a421e69', //第三方登录
  GetVerifyCode: '/v1/5b5bdc44796e8', // 发送验证码
  postRegisterByMobile: '/v1/5cad9f63e4f94', //注册
  GetVerifyCode: '/v1/5b5bdc44796e8', // 发送验证码
  GetVerifyCode: '/v1/5b5bdc44796e8', // 发送验证码
  postForgetPassword: '/v1/5caeeba9866aa', // 忘记密码
  postOperationGetColumn: '/v1/5d63befcb25d9', // 获取指定的文章单页信息
  postOperationGetColumn: '/v1/5d63befcb25d9', // 获取指定的文章单页信息
  postOperationGetColumn: '/v1/5d63befcb25d9', // 获取指定的文章单页信息
  postOperationGetColumn: '/v1/5d63befcb25d9', // 获取指定的文章单页信息
  postAddOrder: '/v1/5d784b976769e',   //下单
  memberListvip: '/v1/5ff6bd4eaf508',//用户会员等级列表
  membergradevip: '/v1/5ff6c11f5f947',//用户会员等级详情
  memberuserInfovip: '/v1/5ff6db648ac68',//用户会员信息
  postDelOrder: '/v1/5dd6330bae65c',// 删除订单
  postPayWaysList: '/v1/5fd081091c411',//支付方式
  getOrderDetail: "/v1/5d88ab98cbb1f", //统一查询订单
  getMyMoney: '/v1/5cc45274d6be9', // 获取金额信息
  isSetPay: '/v1/5f64a4d364b44', // 判断用户是否设置支付密码
  isSetPay: '/v1/5f64a4d364b44', // 判断用户是否设置支付密码
  balancepayOrder: '/v1/5e489f45a051d', // 余额支付
  wxpayOrder: "/v1/5d7868c138418", // 发起微信支付
  alipayOrder: "/v1/5d7a088403825", // 发起支付宝支付
  mixinpayOrder: '/v1/5ee9c2e931ee0', // 混合支付 余额+微信
  postWinningList: '/v1/5fdc61683cd1b', // 中奖列表
  postWinningList: '/v1/5fdc61683cd1b', // 中奖列表
  getSendGift: '/v1/5fdc7f57b1357', // 领取奖品
  getSendGift: '/v1/5fdc7f57b1357', // 领取奖品
  postReceiveCoupon: '/v1/5d8f00ee67072', // 领取优惠券
  postReceiveCoupon: '/v1/5d8f00ee67072', // 领取优惠券
  getPaySuccessCoupon: '/v1/5fe2f74b38a06 ', //支付成功后的领取优惠卷
  getOrderInfo: '/v1/60a37e45bcec8', //获取支付时间，支付方式
}