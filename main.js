import Vue from 'vue';
import App from './App';
import store from './store/index';
import apiUrls from '@/common/api/url.js'
import zh from '@/lang/zh.js';
import { http } from '@/common/api/index.js';
import { message, Router,validate } from '@/common/utils/index.js';
import { BASE_URL, IMG_BASE_URL, SYSTEM_CONFIG, PAGE_SIZE, VERSION_CODE, IS_DEV, needLoginPages } from '@/common/config.js';
import utils from '@/common/utils/utils';
import VueI18n from 'vue-i18n';
import './common/filter/index.js';
import './common/mixin/index.js';
const router = new Router({ needLoginPages });
// #ifdef APP-PLUS || MP-WEIXIN
import fs from '@/common/utils/fs.js';
// #endif
// #ifdef APP-PLUS
import FuModal from '@/components/fu-modal/fu-modal.js';
Vue.use(FuModal);
// #endif

Vue.use(VueI18n);

Vue.config.productionTip = false;

// 加载缓存语言包 START
let messages = {
  'zh-cn': zh, // 中文
}
let locale = 'zh-cn';
// #ifdef APP-PLUS || MP-WEIXIN
let cacheLocal = uni.getStorageSync('language');
if(cacheLocal != locale){
  let cachePackages = uni.getStorageSync('CACHELANGUAGEPACKAGE');
  if(cachePackages){
    let pack = cachePackages.find(item => item.type == cacheLocal);
    if(pack){
      fs.getFileContext(pack.path).then(content => {
        i18n.setLocaleMessage(cacheLocal,JSON.parse(content));
        i18n.locale = cacheLocal;
        global.i18n = i18n._vm.i18n;
        global.locale = i18n.locale;
      })
    }
  }
}
// #endif
const i18n = new VueI18n({ locale, messages });
// 加载语言包 END

Vue.prototype.$urouter = router;
Vue.prototype.$api = http;
Vue.prototype.$message = message;
Vue.prototype.$util = utils;
Vue.prototype.$store = store;
Vue.prototype.$validate = validate;
Vue.prototype._i18n = i18n;

global.apiUrls = apiUrls;
global.IS_DEV = IS_DEV == 0 ? 0 : 1;
global.PAGE_SIZE = PAGE_SIZE;
global.VERSION_CODE = VERSION_CODE;
global.SYSTEM_CONFIG = SYSTEM_CONFIG;
global.i18n = i18n._vm.i18n;
global.locale = i18n.locale;

App.mpType = 'app';

const app = new Vue({
    ...App,
    store,
    i18n,
});

app.$mount();

global.$showModal = app.$showModal;
