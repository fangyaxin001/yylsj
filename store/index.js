import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '../common/api/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cartList: [], // 购物车数据
    userInfo: null, // 用户信息
    shareCode: null, // 邀请人邀请码
    themeColor: '#FF6464', // 主题色
    themeBgColor: 'linear-gradient(126deg, #FA2033 0%, #FF6530 100%);',
    gestureAgain: true, // 是否需要二次验证
    location: {},
    phone: '', //用户登录时多页面共享手机号信息
  },
  mutations: {
    init(state, list) {
      state.cartList = list;
    },
    setBadge(state, num) {
      // #ifdef MP-WEIXIN
      let _index = 2;
      // #endif
      // #ifndef MP-WEIXIN
      let _index = 2;
      // #endif
      if (num) {
        if (Number(num) > 99) {
          uni.setTabBarBadge({
            index: _index,
            text: '99+'
          })
        } else {
          uni.setTabBarBadge({
            index: _index,
            text: num + ''
          })
        }
      } else {
        uni.removeTabBarBadge({
          index: _index
        })
      }
    },
    // 初始化APP,获取缓存的token,用户信息等其他缓存内容
    initApp(state) {
      const _userInfo = uni.getStorageSync('USER_INFO');
      if (_userInfo) {
        state.userInfo = _userInfo;
        global.userInfo = _userInfo;
        global.token = _userInfo.user_token;
      }
    },
    // 更新用户信息
    updateUserInfo(state, data) {
      if (state.userInfo) {
        state.userInfo = {
          ...state.userInfo,
          ...data,
        };
      } else {
        state.userInfo = data;
      }
      uni.setStorageSync('USER_INFO', state.userInfo);
      global.userInfo = state.userInfo;
      if (state.userInfo.user_token) {
        global.token = state.userInfo.user_token;
      }
    },
    // 切换主题
    switchThemeColor(state, color) {
      state.themeColor = color;
    },
    // 退出登录
    logout(state) {
      state.userInfo = null;
      state.cartList = [];
      global.userInfo = null;
      global.token = null;
      state.verifyAgain = false; // 用户退出时二次验证为false，感觉没必要
      state.phone = '';
      uni.removeStorageSync('USER_INFO');
    },
    // 二次验证
    setGestureAgain(state, data) {
      state.gestureAgain = data;
    },
    updataLocation(state, data) {
      state.location = data;
    },
    sharePhone(state, data) {
      state.phone = data;
    }
  },
  // 从基本数据(state)派生的数据，相当于state的计算属性
  getters: {
    allNum(state) {
      let list = state.cartList;
      let total = 0;
      list.forEach((item) => {
        total += Number(item.num);
      });
      return total > 99 ? '99+' : total;
    },
    isLogin(state) {
      if (state.userInfo == null) {
        return false;
      } else {
        return true;
      }
    },
    // 是否会员
    isMember(state) {
      if (state.userInfo && state.userInfo.user_level) {
        return true;
      } else {
        return false;
      }
    },
    // 用户ID
    uid(state) {
      if (state.userInfo && state.userInfo.id) {
        return state.userInfo.id;
      } else {
        return 0;
      }
    },
    // 用户Token
    token(state) {
      if (state.userInfo && state.userInfo.user_token) {
        return state.userInfo.user_token;
      } else {
        return null;
      }
    },
    // 用户信息
    userInfo(state) {
      if (state.userInfo) {
        return state.userInfo;
      } else {
        return null;
      }
    },
  },
  // 和mutation的功能大致相同，不同之处在于 ==》1. Action 提交的是 mutation，而不是直接变更状态。 2. Action 可以包含任意异步操作。
  actions: {
    getCartList({
      dispatch,
      commit,
      getters,
      state
    }) {
      if (state.userInfo) {
        http.post(global.apiUrls.getCartList).then((res) => {
          if (res.data.code == 1) {
            let data = res.data.data;
            commit('init', data);
            commit('setBadge', getters.allNum);
          }
        });
      } else {
        commit('setBadge', 0)
      }
    }
  },
})
export default store;
