<template>
  <view class="third-login-box" v-if="providers.length != 0">
    <view class=""><view class="login-box-title">{{i18n['快捷登录']}}</view></view>
    <view class="login-box-list">
      <view class="flex">
        <view class="block-80" v-for="item in providers" :key="item.type" @click.stop="handleClick(item.type)"><image :src="item.icon" mode="aspectFill"></image></view>
      </view>
    </view>
  </view>
</template>

<script>
const providers = [
  {
    type: 'weixin',
    icon: require('./static/wx.png'),
  },
  {
    type: 'qq',
    icon: require('./static/qq.png'),
  },
  {
    type: 'zfb',
    icon: require('./static/zfb.png'),
  },
  {
    type: 'apple',
    icon: require('./static/apple.png'),
  }
];
export default {
  props: {
    delta: {
      type: [Number,String],
      default(){
        return -1;
      }
    }
  },
  data() {
    return {
      providers: [
        {
          type: 'weixin',
          icon: require('./static/wx.png'),
        }
      ],
    };
  },
  methods: {
    handleClick(type) {
      uni.login({
        provider: type,
        success: (loginRes) => {
          uni.getUserInfo({
            provider: type,
            success: (infoRes) => {
              console.log('login',loginRes);
              console.log('getUserInfo',infoRes);
              let { nickName, avatarUrl, gender,unionId } = infoRes.userInfo;
              let clientId = plus.push.getClientInfo().clientid || '';
              console.log('clientId', clientId);
              let appSystem = uni.getSystemInfoSync().platform == 'ios' ? 1 : 2;
              console.log('appSystem',appSystem)
              console.log('unionId',unionId);
              let data = {
                type: type == 'weixin' ? 1 : 2,
                clientId: clientId || '',
                appSystem: appSystem || '',
                nickname: nickName,
                avatar: avatarUrl,
                gender: gender
              }
              if(type == 'weixin'){
                data.wx_unionid = unionId;
              }else if(type == 'qq'){
                data.qq_unionid = unionId;
              }
              this.$api
                .post(global.apiUrls.postUserSocialLogin, data)
                .then(res => {
                  // 保存用户信息
                  res = res.data;
                  console.log('??????',res);
                  if (res.code == 1) {
                    this.$message.info(res.msg);
                    this.$store.commit('updateUserInfo', res.data.userinfo);
                    setTimeout(() => {
                      uni.navigateBack({delta: this.delta});
                    }, 800);
                  } else if (res.code == -999) {
                    // 未注册过的用户
                    this.$urouter.redirectTo({
                      url: '/pages/user/login/bind-phone/index',
                      params: {
                        unionId: unionId,
                        sex: gender,
                        nickName: nickName,
                        avatarUrl: avatarUrl,
                        authType: type == 'weixin' ? 'wx_unionid' : type == 'qq' ? 'qq_unionid': '',
                      }
                    });
                    // 点击手机号账号登录按钮
                  } else if (res.code == -1) {
                    this.$message.info(res.msg);
                  }
                })
                .catch(err => {
                  uni.hideLoading();
                  console.log(err);
                });
            }
          });
        },
        error: function(err) {
          uni.hideLoading();
          console.log(err);
        }
      });
    },
    getProvider() {
      uni.getProvider({
        service: 'oauth',
        success: res => {
          const _provider = providers.filter(item => res.provider.includes(item.type));
          this.providers = _provider;
        }
      });
    }
  },
  created() {
    // this.getProvider();
  }
};
</script>

<style lang="scss" scoped>
.third-login-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .login-box-title {
    font-size: 24rpx;
    color: #999999;
    position: relative;
  }
  .login-box-title::before {
    content: '';
    width: 200rpx;
    height: 1rpx;
    background-color: #eeeeee;
    position: absolute;
    top: 50%;
    left: -230rpx;
  }
  .login-box-title::after {
    content: '';
    width: 200rpx;
    height: 1rpx;
    background-color: #eeeeee;
    position: absolute;
    top: 50%;
    right: -230rpx;
  }
  .login-box-list {
    margin-top: 40rpx;
    .block-80 {
      width: 80rpx;
      height: 80rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .block-80 + .block-80 {
      margin-left: 40rpx;
    }
  }
}
</style>
