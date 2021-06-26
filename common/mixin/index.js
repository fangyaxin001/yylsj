import Vue from 'vue';
import { Router } from '@/common/utils/index.js';
import { needLoginPages } from '@/common/config.js';
const router = new Router({ needLoginPages });
Vue.mixin({
    computed: {
        colorTheme() {
            return this.$store.state.themeColor + '!important';
        },
        colorBgTheme() {
            return this.$store.state.themeBgColor + '!important';
        },
        i18n() {
            return this.$t('defVal');
        },
        _top(){
          let h = uni.upx2px(110);
          let _h = h + this.StatusBar + 'px';
          console.log(_h)
          return _h;
        }
    },
    methods: {
        // 设置自定义头部
        setNavigationBarTitle(title) {
            uni.setNavigationBarTitle({
                title: title
            })
        },
        // 设置自定义底部
        setTabBarItem() {
            uni.setTabBarItem({
                index: 0,
                text: global.i18n['首页'],
            })
            uni.setTabBarItem({
                index: 1,
                text: global.i18n['分类'],
            })
            uni.setTabBarItem({
                index: 2,
                text: global.i18n['购物车'],
            })
            uni.setTabBarItem({
                index: 3,
                text: global.i18n['我的'],
            })
        },
        // 页面跳转
        handleJump(e) {
            let target = e.currentTarget || e.target,
                url = target.dataset.url || 'back',
                type = target.dataset.type;
            if (url == '' || url == '#') return;
            switch (type) {
                case 'SWITCH':
                    router.switchTab(url);
                    break;
                case 'REDIRECT':
                    router.redirectTo(url);
                    break;
                case 'RELAUNCH':
                    router.reLaunch(url);
                    break;
                case 'BACK':
                    router.navigateBack();
                    break;
                default:
                    router.navigateTo(url);
                    break;
            }
        }
    }
})
