<template>
	<view class="page">
		<view class="per solid-top">
			<!-- 修改密码 start -->
			<view @tap="handleJump" class="per_row_box" data-url="/pages/index/setting/modify-password/index">
				<view class="per_row solid-bottom">
					<text class="text-lg text-black">{{i18n['修改密码']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view>
			<!-- 修改密码 end -->
			<!-- 修改支付密码 start -->
			<view @tap="handleJump" class="per_row_box" data-url="/pages/index/setting/modify-pay-password/index" v-if="!setPass">
				<view class="per_row solid-bottom">
					<text class="text-lg text-black">{{i18n['修改支付密码']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view>
			<!-- 修改支付密码 end -->
			<!-- 设置支付密码 start -->
			<view @tap="handleJump" class="per_row_box" data-url="/pages/index/setting/change-pay-password/index" v-else>
				<view class="per_row solid-bottom">
					<text class="text-lg text-black">{{i18n['设置支付密码']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view>
			<!-- 设置支付密码 end -->
			<!-- 更换手机号 start -->
			<view @tap="handleJump" class="per_row_box" data-url="/pages/index/setting/modify-password-verify-phone/index?type=3">
				<view class="per_row solid-bottom">

					<text class="text-lg text-black">{{i18n['修改绑定手机号']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view>
			<!-- 更换手机号 end -->
			<!-- #ifndef H5 -->
			<!-- 设置手势密码 start -->
			<!-- <view v-if="oldPhone" @click="jumpGesture">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['设置手势密码']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view> -->
			<!-- 设置手势密码 end -->
			<!-- 忘记手势密码 start -->
			<!-- 	<view v-if="oldPhone" @tap="handleJump" data-url="/pages/index/setting/reset-gesture/index">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['忘记手势密码']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view> -->
			<!-- 忘记手势密码 end -->
			<!-- 生物支付 start  1都不支持 2安卓指纹 3 苹果指纹 4 苹果人脸 5 苹果人脸加指纹-->
		<!-- 	<view @tap="handleBiological"  v-if="support != 1 && support != 4">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['生物支付']}}</text>
					<text class="flex justify-end align-center" style="width:calc(100% - 200rpx);">
						<text>
							<block v-if="support === 2 || support === 3 || support === 5">
								{{i18n['指纹']}}
							</block>
							<!~~ 刷脸支付暂时未开发 ~~>
							<!~~ <block v-if="support === 5">
								、
							</block>
							<block v-if="support === 4 || support === 5">手机刷脸</block> ~~>
							{{i18n['支付']}}
						</text>
						<text class="fu-iconfont text-bf">&#xe839;</text>
					</text>

				</view>
			</view> -->
			<!-- 生物支付 end -->
			<!-- 语言切换 start -->
			<view class="per_row_box solid-bottom" @tap="handleJump" data-url="/pages/index/setting/language/index">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['语言']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view>
			<!-- 语言切换 end -->
			<!-- #endif -->
			<!-- 用户协议 start -->
			<!-- <view @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=15">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['用户协议']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view> -->
			<!-- 用户协议 end -->
      <!-- 意见反馈 start -->
      <view @tap="handleJump" data-url="/pages/index/setting/feedback/index" class="per_row_box">
      	<view class="per_row solid-bottom">
      		<text class="text-lg text-black">{{i18n['意见反馈']}}</text>
      		<text class="fu-iconfont text-bf">&#xe839;</text>
      	</view>
      </view>
      <!-- 意见反馈 end -->
      <!-- 我的意见反馈 start -->
      <!-- <view @tap="handleJump" data-url="/pages/index/setting/my-feedback/index">
      	<view class="per_row">
      		<text class="text-lg text-black">{{i18n['我的反馈']}}</text>
      		<text class="fu-iconfont text-bf">&#xe839;</text>
      	</view>
      </view> -->
      <!-- 我的意见反馈 end -->

      <!-- 用户协议 start -->
      <!-- <view @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=15">
        <view class="per_row">
          <text class="text-lg text-black">用户协议</text>
          <text class="fu-iconfont text-bf">&#xe839;</text>
        </view>
      </view> -->
      <!-- 用户协议 end -->
			<!-- 隐私协议 start -->
			<!-- <view @tap="handleJump" data-url="/pages/user/login/user-agreement/index?id=23">
				<view class="per_row">
					<text class="text-lg text-black">{{i18n['隐私协议']}}</text>
					<text class="fu-iconfont text-bf">&#xe839;</text>
				</view>
			</view> -->
			<!-- 隐私协议 end -->
      <!-- 关于我们 start -->
      <view @tap="handleJump" data-url="/pages/index/setting/about/index?id=6" class="per_row_box">
        <view class="per_row ">
          <text class="text-lg text-black">关于我们</text>
          <text class="fu-iconfont text-bf">&#xe839;</text>
        </view>
      </view>
      <!-- 关于我们 end -->
      <!-- #ifdef APP-PLUS -->
			<!-- 清除缓存 start -->
			<view @tap="clear" class="margin-top-sm per_row_box">
				<view class="per_row solid-bottom">
					<text class="text-lg text-black">{{i18n['清除缓存']}}<text>{{fileSizeString}}</text></text>
				</view>
			</view>
			<!-- 清除缓存 end -->
				<!-- 系统版本 start -->
				<view  @tap="handleTestingVersion" class="per_row_box">
					<view class="per_row">
						<text class="text-lg text-black">{{i18n['检查更新']}}<text>v{{version}}</text></text>
						<text></text>
					</view>
				</view>
				<!-- 系统版本 end -->
			<!-- #endif -->
		</view>
		<!-- 退出登录按钮 end -->
		<view class="btn_cloce" v-if="isLogin">
			<view class="btn" @click="logout">{{i18n['退出登录']}}</view>
		</view>
		<!-- 退出登录按钮 end -->
		<!-- APP更新组件 start -->
		<app-update ref="update"></app-update>
		<!-- APP更新组件 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: '', // 版本号
				fileSizeString: '0B', // 缓存大小
				oldPhone: true, // 是否是老旧设备 true: 不支持指纹或人脸识别 false: 支持指纹或人脸识别
				setPass: false, //设置支付密码
				support:1,//1都不支持 2安卓指纹 3 苹果指纹 4 苹果人脸 5 苹果人脸加指纹
			};
		},
		computed: {
			// 是否登录状态
			isLogin() {
				return this.$store.getters.isLogin;
			}
		},
		onShow() {
			this.setNavigationBarTitle(this.i18n['设置'])
			// 判断设备是否支持指纹或者手势
			// let that = this;
			// #ifndef H5
			// uni.checkIsSupportSoterAuthentication({
			// 	success(res) {
			// 		// 如果支持人脸识别，就优先人脸识别,否则就去指纹识别(人脸识别还需要判断是否是ios设备，如果不是，直接指纹。)
			// 		if (!~res.supportMode.indexOf('facial') || !~res.supportMode.indexOf('fingerPrint')) {
			// 			that.oldPhone = false;
			// 		} else {
			// 			that.oldPhone = true;
			// 		}
			// 	},
			// 	fail(err) {
			// 		console.log('获取支持的生物监测失败==>', err);
			// 		that.oldPhone = true;
			// 	},
			// });
			// #endif

		},
		onLoad() {
			// #ifdef APP-PLUS
			// 获取App版本号
			plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
				this.version = widgetInfo.version;
			})
			this.formatSize();
			// #endif
			this.addTime()
			uni.$on('setPass', (data) => {
				this.addTime()
			})
			// this.checkIsSupportSoterAuthentication();
			this.$util.biometrics().then(res=>{
				this.support = res;
				console.log(this.support);
			})
		},
		methods: {
			// 跳转生物识别开启页面
			handleBiological(){
        this.$util.debounce(() => {
          uni.navigateTo({
          	 url: '/pages/index/setting/biological/index'
          })
        },1000,true)
			},
			/**
			 * @function
			 * @description 判断用户是否设置支付密码
			 * @property {Number} pay_money - 订单金额
			 */
			addTime() {
				this.$api.post(global.apiUrls.isSetPay).then((res) => {
					if (res.data.code == 1) {
						if(res.data.data.falg == 0){
							this.setPass = true;
						}
					}
				})
			},
			/**
			 * @description 设置手势密码
			 * */
			jumpGesture() {
				// 向服务器请求查询手势密码，如果为空则进入设置页面，如果不为空，则不让跳转
				if (this.$store.state.userInfo.hand_password == '') {
					this.$urouter.navigateTo({
						url: '/pages/index/setting/gesturePassword/index',
						params: {
							"type": 2
						}
					})
				} else {
					uni.showToast({
						title: this.i18n['您已设置手势密码'],
						duration: 2000,
						icon: 'none'
					});
				}
			},
			// 更新检测
			handleTestingVersion() {
				this.$util.debounce(
					() => {
						this.$refs.update.checkAppUpdate();
					}, 1000,
					true)
			},
			// 退出登录
			logout() {
				this.$util.showModal({
					title: this.i18n['提示'],
					content: this.i18n['确定退出当前账号？'],
					confirmColor: this.$store.state.themeColor,
					success: res => {
						if (res.confirm) {
							this.$store.commit('logout');
							uni.navigateBack();
							this.$store.dispatch('getCartList');
						}
					}
				});
			},
			// 清除本地缓存
			clear() {
				this.$util.showModal({
					title: this.i18n['提示'],
					content: this.i18n['确定要清除本地缓存？'],
					confirmColor: this.$store.state.themeColor,
					success: res => {
						if (res.confirm) {
							this.clearCache();
						}
					}
				})
			},
			// 格式化缓存大小
			formatSize() {
				let that = this;
				plus.cache.calculate(function (size) {
					let sizeCache = parseInt(size);
          console.log("重新计算",sizeCache);
					if (sizeCache == 0) {
						that.fileSizeString = '0B';
					} else if (sizeCache < 1024) {
						that.fileSizeString = sizeCache + 'B';
					} else if (sizeCache < 1048576) {
						that.fileSizeString = (sizeCache / 1024).toFixed(2) + 'KB';
					} else if (sizeCache < 1073741824) {
						that.fileSizeString = (sizeCache / 1048576).toFixed(2) + 'MB';
					} else {
						that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + 'GB';
					}
				});
			},
			// 清除本地缓存
			clearCache() {
				uni.clearStorage();
				let that = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, 'listFiles');
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
						plus.io.resolveLocalFileSystemURL(
							filePath,
							function (entry) {
								if (entry.isDirectory) {
									entry.removeRecursively(
										function (entry) {
											//递归删除其下的所有文件及子目录
											that.$message.info(that.i18n['缓存清理完成!']);
											that.formatSize(); // 重新计算缓存
										},
										function (e) {
											console.log(e.message);
										}
									);
								} else {
									entry.remove();
								}
							},
							function (e) {
								console.log('文件路径读取失败');
							}
						);
					}
				} else {
					// ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错
					plus.cache.clear(function () {
						this.$message.info(this.i18n['缓存清理完成!']);
						that.formatSize();
					});
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.page{
		min-height: 100vh;
		background: #f8f8f8;
	}
	// 列表样式 start
	.per {
		margin-bottom: 160rpx;
		font-size: 28upx;
		// background-color: #fff;
    .per_row_box{
      padding:0px 32rpx;
      background-color: #fff;
    }
		.per_row {
			padding: 30upx 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			/* border-bottom: 1px solid #ededed; */

			text {
				&:nth-child(1) {
					width: 100%;

					text {
						width: auto;
						margin-right: 10upx;
						color: #999;
						float: right;
						line-height: 36upx;
					}
				}
			}

			.row_right {
				text-align: right;

				.aa {
					color: #999999;
					display: inline-block;
					margin-right: 10upx;
				}
			}
		}
	}

	// 列表样式 end

	// 退出登录按钮 start
	.btn_cloce {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
		box-shadow: 0 0 10rpx #EEEEEE;

		.btn {
			height: 110rpx;
			text-align: center;
			line-height: 110rpx;
			color: $theme;
			font-size: 32rpx;
		}
	}

	// 退出登录按钮 end
</style>
