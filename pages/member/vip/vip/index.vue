<template>
	<fu-loading v-if="!init"></fu-loading>
	<view class="page" v-else>
		<!-- 自定义头部 start -->
		<view class="cu-custom header">
			<view class="cu-bar fixed bg act" :style="{ height: CustomBar + 'px', paddingTop: StatusBar + 'px' ,}">
				<view class="action" @tap="BackPage">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content" :style="[{ top: StatusBar + 'px' }]">{{i18n['会员权益']}}</view>
			</view>
			<view :style="{ height: CustomBar + 'px' }"></view>
		</view>
		<!-- 自定义头部 end -->

		<view class="bg-top">
			<view class="card" v-if='vipInfo.user_vip <1'>
				<view class="flex head_info">
					<view class="image">
						<fu-image :src="userInfo.head_img " mode="aspectFill" radius="50%"></fu-image>
					</view>
					<view>
						<view class="info-name">{{userInfo.user_name}}</view>
						<view class="info-content">您当前未开通会员</view>
					</view>

				</view>
				<view class="flex justify-between info-bottom">
					<view>
						开通会员享更多优惠
					</view>
				</view>
			</view>
			<view class="card-2" v-if='vipInfo.user_vip >=1'>
				<view class="flex head_info">
					<view class="image">
						<fu-image :src="userInfo.head_img " mode="aspectFill" radius="50%"></fu-image>
					</view>
					<view>
						<view class="info-name">{{userInfo.user_name}}</view>
						<view class="info-content">有效期： {{vipInfo.user_vip_last_time}}</view>
					</view>

				</view>
				<view class="flex justify-between info-bottom">
					<view>
						会员专属标识，可续费延长
					</view>
				</view>

			</view>
			<view class="bg-bottom">
				<image src="../../static/bg-bottom.png" />

			</view>

		</view>
		<view style="margin: 0 24rpx;">
			<scroll-view scroll-x class="padding-32 padding-bottom-40">
				<view class="nav  flex justify-start">
					<view class="nav-item flex flex-direction" v-for='(item,index) in gradeListvip'
						:class='index==activiteIndex? "active":""' @click='switchChange(index,item)'>
						<view class="text-333 text-lg card-name">{{item.level_name}}</view>
						<view class="  text-333 text-cut price">{{'¥'+item.price}}</view>
						<view class=" text-df text-999 text-cut line-price">{{ '¥'+item.cost}}</view>
					</view>
				</view>
			</scroll-view>
		</view>


		<view class="info">
			<view class="h4">
				会员权益
			</view>
			<view class="p">
				<!-- 1、直接充值成为会员，无时间限制
				<br>
				2、会员可享受购买商品优惠。 -->
				<view v-html='content'>
				</view>
			</view>
		</view>
		<view class="btn" @tap="openVip()">
			<text v-if='vipInfo.user_vip <1'> {{i18n['立即购买']}}</text>
			<text v-if='vipInfo.user_vip >=1'> {{i18n['立即续费']}}</text>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				activiteIndex: 0,
				init: '',
				price: '',
				userInfo: {}, // 当前登录用户的用户信息
				order_sn: '',
				level_id: '',
				vipInfo: {},
				gradeListvip: [],
			}
		},
		computed: {
			content() {
				var val = ''
				if (this.gradeListvip[this.activiteIndex]) {
					val = this.gradeListvip[this.activiteIndex].content.replace(/\n/g, '<br/>');
				}
				return val
			}
		},
		onShow() {
			this.getmemberuserInfovip()
			this.getmemberListvip() // 获取vip等级列表
		},
		onLoad() {
			// 用户信息
			let userInfo = this.$store.state.userInfo;
			this.userInfo = userInfo || {};
		},
		methods: {
			// 获取vip等级列表
			getmemberListvip() {
				this.$api.post(global.apiUrls.memberListvip, {
				}).then(res => {
					if (res.data.code == 1) {
						this.gradeListvip = res.data.data

					}
				})
			},
			switchChange(val, item) {
				this.activiteIndex = val
				this.price = item.price
				this.level_id = item.id
			},
			// 获取用户会员信息
			getmemberuserInfovip() {
				this.$api.post(global.apiUrls.memberuserInfovip, {
				}).then(res => {
					if (res.data.code == 1) {
						console.log(res.data)
						this.init = true;
						this.vipInfo = res.data.data
					}
				})
			},
			//返回上一页
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			openVip() {
				this.$util.debounce(() => {
					var data = {
						payable_money: this.price ? this.price : this.gradeListvip[0].price,
						level_id: this.level_id ? this.level_id : this.gradeListvip[0].id,
						order_type: '16',
					}
					this.$api.post(global.apiUrls.postAddOrder, data).then(res => {
						if (res.data.code == 1) {
							console.log(res)
							this.$message.info(this.i18n['请支付…']);
							setTimeout(() => {
								this.$urouter.navigateTo({
									url: "/pages/member/vip/pay-vip/index",
									params: {
										order_sn: res.data.data.order_sn,
									},
								});
							}, 800);

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					})
				}, 1500, true);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F9;
	}

	.page {
		background: url('../../static/isvipback.png') no-repeat;
		background-size: 100% 456rpx;
	}

	/deep/.cu-bar .action:first-child>uni-text[class*="cuIcon-"] {
		color: #FFF;
	}

	.header {
		color: #FFF;

		.act {
			background: url('../../static/isvipback.png') no-repeat top;
		}
	}

	.bg-top {
		height: 426rpx;
		background: url('../../static/isvipback.png') no-repeat top;
		background-size: 100% 100%;
		margin-top: -88rpx;
		position: relative;
	}

	.card {
		color: #8E5535;
		margin-top: 105rpx;
		left: 50%;
		margin-left: -351rpx;
		width: 702rpx;
		height: 300rpx;
		background: url('../../static/supervip-03-1.png') no-repeat top;
		background-size: 100% 100%;
		position: absolute;

		.head_info {
			margin: 32rpx;
		}

		.image {
			width: 88rpx;
			height: 88rpx;
			margin-right: 24rpx;
			border-radius: 50%;
		}

		.info-name {
			font-size: 32rpx;
			color: #8E5535;
		}

		.info-content {
			color: #8E5535;
			font-size: 24rpx;
			margin-top: 8rpx;
		}

		.info-bottom {
			color: #8E5535;
			position: absolute;
			bottom: 92rpx;
			width: 100%;
			padding: 0 32rpx;
			font-size: 24rpx;
		}

		.btn {
			position: absolute;
			bottom: 32rpx;
			left: 50%;
			margin-left: -160rpx;
			width: 320rpx;
			height: 72rpx;
			background-color: #fff;
			color: #4B4B55;
			line-height: 72rpx;
			border-radius: 40rpx;
			text-align: center;
		}
	}

	.card-2 {
		color: #8E5535;
		margin-top: 105rpx;
		left: 50%;
		margin-left: -351rpx;
		width: 702rpx;
		height: 300rpx;
		background: url('../../static/supervip-03-1.png') no-repeat top;
		background-size: 100% 100%;
		position: absolute;

		.head_info {
			margin: 32rpx;
		}

		.image {
			width: 88rpx;
			height: 88rpx;
			margin-right: 24rpx;
			border-radius: 50%;
		}

		.info-name {
			font-size: 32rpx;
			color: #8E5535;
		}

		.info-content {
			color: #8E5535;
			font-size: 24rpx;
			margin-top: 8rpx;
		}

		.info-bottom {
			color: #8E5535;
			position: absolute;
			bottom: 92rpx;
			width: 100%;
			padding: 0 32rpx;
			font-size: 24rpx;
		}

		.info-img {
			width: 48rpx;
			height: 26rpx;
			margin-top: 8rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.info {
		padding: 24rpx;
		margin-top: 16rpx;

		.h4 {
			font-size: 32rpx;
			color: #333333;
			margin-bottom: 24rpx;
			font-weight: 600;
		}

		.p {
			font-size: 24rpx;
			color: #333333;
			line-height: 2;
		}
	}

	.btn {
		width: 100%;
		padding: 0 32rpx;
		position: fixed;
		bottom: 48rpx;
		box-sizing: border-box;

		text {
			background: $bgtheme;
			border-radius: 44rpx;
			padding: 22rpx 279rpx;
			display: block;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}

	.bg-bottom {
		position: relative;
		width: 100%;
		height: 122rpx;
		top: 332rpx;

		image {
			width: 100%;
			height: 122rpx;
		}
	}

	.nav {
		// margin-top: 60rpx;
		// padding-top: 24rpx;

		.active {
			background: #FFF7F8;
			border: 2rpx solid #FA2033;
		}
	}

	.nav-item {
		flex-shrink: 0;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-right: 24rpx;
		width: 202rpx;
		height: 250rpx;
		text-align: center;
		padding: 40rpx 0;

		.price {
			font-size: 44rpx;
			margin-top: 24rpx;
		}

		.line-price {
			text-decoration: line-through;
		}
	}
</style>
