import Vue from 'vue';
import Dayjs from '@/libs/day.js';
import store from '@/store/index.js';

// 识别图片路径是否为全路径 若不是则进行拼接
Vue.filter('assembleImgSrc', src => {
    src = src || ''
    if (src.indexOf('http://') != -1 || src.indexOf('https://') != -1) {
        return src
    }
    if (src.indexOf('/uploads/') != -1 || src.indexOf('/uploads/') != -1) {
        return BASE_URL + src
    } else {
        return IMG_BASE_URL + src
    }
});

// 日期格式转换
Vue.filter('formatDate', (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return Dayjs(date).format(format)
});

// 格式化数字
Vue.filter('formatNumber', (number, tag = 'w') => {
    number = Number(number);
    if (number >= 10000) {
        return (Math.floor(number / 1000) / 10).toFixed(1) + tag;
    } else {
        return number;
    }
});

// 格式化角标数字
Vue.filter('formatTagNumber', number => {
    if (number >= 100) {
        return "99+";
    } else {
        return number;
    }
});

// 过滤商品价格
Vue.filter('filterGoodsPrice', function(value, isActive) {
    // console.log('filterGoodsPrice',value)
    if (!value) return '';
    let isMember = store.getters.isMember; // 是否是会员
    let isActivity = value.activity_type == undefined || value.activity_type == 0 ? false : true; // 是否是活动
    // 拼团时，是点击单独购买value.isActive == false还是发起拼团value.isActive == true,单独购买就不属于活动了
    if (value.isActive == false) {
        isActivity = false;
        // console.log('是否活动1', value.isActive);
    }
    // 过滤价格时，若是传入第二参数isActive == false，则说明页面显示正常商品价格，就不属于活动了
    if (isActive == false) {
        isActivity = false;
        // console.log('是否活动2', isActivity);
    }
    // console.log('是否会员',isMember);
    // console.log('是否活动',isActivity);
    let member_activity_price = value.member_activity_price ? value.member_activity_price : value.activity_price; //会员活动价
    let activity_price = value.activity_price; // 活动价
    let member_price = value.member_price ? value.member_price : value.shop_price; // 会员价
    let shop_price = value.shop_price; // 售卖价
    if (isActivity && isMember) {
        // console.log("会员活动价",member_activity_price);
        return member_activity_price;
    } else if (isActivity && !isMember) {
        // console.log("活动价",activity_price);
        return activity_price;
    } else if (!isActivity && isMember) {
        // console.log("会员价",member_price);
        return member_price;
    } else if (!isActivity && !isMember) {
        // console.log("普通价",shop_price);
        return shop_price;
    }
    return '';
})

// 手机号脱敏
Vue.filter('filterMobile', function(val) {
    if (!val) return "";
    return val.substr(0, 3) + "****" + val.substr(-4);
})
