<template>
	<view class="overHidden" v-show="imgShow">
		<view class="flex padding-lr padding-top-xs" v-if="imgs.length == 1">
			<view class="flex-sub radius-24 height-178" v-for="(item,index) in imgs" :key="index"
				@click="navTo(item.href,item.is_login)">
				<fu-image :src="item.thumb" mode="widthFix"></fu-image>
			</view>
		</view>
		<view class="flex padding-lr padding-top-xs row-2" v-if="imgs.length == 2">
			<view class="flex-sub radius-24 height-178 margin-lr-xs" v-for="(item,index) in imgs" :key="index"
				@click="navTo(item.href,item.is_login)">
				<fu-image :src="item.thumb" mode="widthFix"></fu-image>
			</view>
		</view>
		<view class="flex padding-lr padding-top-xs row-3" v-if="imgs.length == 3">
			<view class="flex-sub" style="width: 335rpx" @click="navTo(imgs[0].href,imgs[0].is_login)">
				<fu-image radius="24" :src="imgs[0].thumb"></fu-image>
			</view>
			<view class="flex-sub flex flex-direction" style="width: 335rpx">
				<view class="flex-sub radius-24" @click="navTo(imgs[1].href,imgs[1].is_login)">
					<fu-image :src="imgs[1].thumb" mode="widthFix"></fu-image>
				</view>
				<view class="flex-sub radius-24" @click="navTo(imgs[2].href,imgs[2].is_login)">
					<fu-image :src="imgs[2].thumb" mode="widthFix"></fu-image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['typeid'],
		data() {
			return {
				imgs: [],
				imgShow: false,
			}
		},
		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				this.$api.post(global.apiUrls.postAdvert, {
					typeid: this.typeid,
				})
					.then(res => {
						console.log("广告位", res);
						if (res.data.code == 1) {
							this.imgs = res.data.data;
							this.$nextTick(() => {
								setTimeout(() => {
									this.imgShow = true;
								}, 300)
							})
						}
					}).catch(err => {
						console.log("广告图 ERROR: ", err);
					})
			},
			navTo(path, auth) {
				console.log(auth)
				if (auth) {
					this.$util.actionAuth(() => {
						if (path.includes('type=tabbar')) {
							uni.switchTab({
								url: path
							})
						} else if (path.includes('isLogin=true')) {
							this.$util.actionAuth(() => {
								uni.navigateTo({
									url: path
								});
							})
						} else {
							uni.navigateTo({
								url: path
							})
						}
					});
				} else {
					if (path.includes('type=tabbar')) {
						uni.switchTab({
							url: path
						})
					} else if (path.includes('isLogin=true')) {
						this.$util.actionAuth(() => {
							uni.navigateTo({
								url: path
							});
						})
					} else {
						uni.navigateTo({
							url: path
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.row-2 {
		image+image {
			margin-left: 20rpx;
		}
	}

	.row-3 {
		>view+view {
			margin-left: 20rpx;
		}

		image+image {
			margin-top: 20rpx;
		}
	}

	.radius-24 {
		border-radius: 24rpx;
		overflow: hidden;
		// 解决ios overflow:hidden 不生效
		-webkit-backface-visibility: hidden;
		-webkit-transform: translate3d(0, 0, 0);
	}

	.height-178 {
		height: 178rpx;
	}

	image {
		background-color: #EEEEEE;
		min-height: 100rpx;
	}
</style>
