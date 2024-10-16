<template>
	<view class="c_Box">
		<view class="titleBox">
			<text class="titleBox_text1">iPhone</text>
			<image src="https://oss.chuangliukeji.com/backstage/2024-09-03/d1e3ebb9b7f64bcebceed2e3002a0ade.png" class="titleBox_image"></image>
		</view>
		<view class="title2Box">
			0元预约 免费抽iPhone 16
		</view>
		<view class="contentBox">
			<image src="https://oss.chuangliukeji.com/backstage/2024-09-03/d08d14f7bc7549359a4bcbc0aa13a892.png" class="c_Box_img"></image>
		</view>
		<!-- <view class="title2Box" style="margin-top: 28rpx;">
			北京时间 9 月 10 日凌晨 1 点，尽情期待
		</view> -->
		<view class="butBox">
			<button class="butn" open-type="getAuthorize" scope="phoneNumber" @getAuthorize="onGetPhone">立即预约</button>
		</view>
		<view class="fixedBox">
			<view class="f_box_item" v-for="(item , index) in butList" :key="index">
				<image :src="item.image" class="item_image"></image>
				<text class="item_text">{{item.text}}</text>
				<view v-if="index < 2" class="item_line"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getZWZUserDetail,
		checkHasPhone,
		loginHandler,
		backUserUpload
	} from "@/utils/index.js";
	import { request } from "@/utils"
	export default {
		data() {
			return {
				butList: [
					{
						'image': 'https://oss.chuangliukeji.com/backstage/2024-09-03/0a3ebdc88d0144d49f26afbc0177bc63.png',
						'text': '首发库存更充足'
					},
					{
						'image': 'https://oss.chuangliukeji.com/backstage/2024-09-03/114f07a17efb4b29bb3745413c4953cb.png',
						'text': '顺丰包邮'
					},
					{
						'image': 'https://oss.chuangliukeji.com/backstage/2024-09-03/e99099858b814ae59cede1674e1a1dde.png',
						'text': '优先审核'
					},
				]
			}
		},
		onLoad() {
			
		},
		methods: {
			// 立即预约
			onGetPhone() {
				let isPhone = checkHasPhone();
				// 有手机号则调保存接口
				if (isPhone) {
					this.onSubmit();
				} else {
					my.getPhoneNumber({
						success: (res) => {
							let encryptedData = res.response;
							this.sucHandler(encryptedData);
						},
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: '若点击不授权，将会影响预约',
								cancelText: '不授权',
								cancelColor: '#999',
								confirmText: '授权',
								confirmColor: '#FFCB31',
								success(res) {
									if (res.confirm) {
										// 选择弹框内授权
										uni.openSetting({
											success(res) {
												console.log(res.authSetting)
											}
										})
									} else if (res.cancel) {
										// 选择弹框内 不授权
										console.log('用户点击不授权')
									}
								}
							})
						},
					});
				}
			},
			
			//获取到用户的手机号码
			sucHandler(encryString) {
				this.$request(
					"hzsx/api/components/decrypt", {
						content: encryString
					},
					"get",
					true
				).then((res) => {
					let resObj = JSON.parse(res.data);
					if (resObj.code === "10000") {
						let obj = {
							telephone: resObj.mobile,
						};
						loginHandler(true, obj, this.onSubmit, true);
					}
				});
			},
			
			// 保存接口
			onSubmit() {
				const Detail = getZWZUserDetail();
				const postData = {
					'telephone': Detail.telephone,
					'type': 'yuyueIphone16',
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$request(
					"hzsx/userPoint/platformActiveAdd", { ...postData },
					"get",
					true
				).then((res) => {
					uni.showToast({
						title: "预约成功",
						icon: "none",
					});
				})
			},
		}
	}
</script>

<style lang="scss">
	view {
		box-sizing: border-box;
	}
	.c_Box {
		width: 100%;
		min-height: 100vh;
		background: #000000;
		padding-top: 60rpx;
		.titleBox {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 64rpx;
			font-weight: 500;
			line-height: 80rpx;
			.titleBox_text1 {
				color: #FFFFFF;
			}
			.titleBox_image {
				width: 130rpx;
				height: 68rpx;
				margin-left: 2rpx;
			}
		}
		
		.title2Box {
			width: 100%;
			height: 48rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			text-align: center;
			font-style: normal;
			text-transform: none;
			margin-top: 16rpx;
		}
		
		.contentBox {
			width: 100%;
			margin-top: 28rpx;
			text-align: center;
			.c_Box_img {
				width: 542rpx;
				height: 542rpx;
			}
		}
		
		.butBox {
			width: 100%;
			display: flex;
			justify-content: center;
			margin-top: 32rpx;
			.butn {
				width: 344rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: linear-gradient( 90deg, #E34131 0%, #6A31F8 100%);
				border-radius: 58rpx;
				font-weight: 400;
				font-size: 32rpx;
				color: #FFDAEB;
				border: none;
			}
		}
		
		.fixedBox {
			width: calc(100% - 48rpx);
			height: 58rpx;
			margin-left: 24rpx;
			margin-top: 40rpx;
			background: #373737;
			border-radius: 16rpx;
			color: #DBD0B0;
			font-weight: 400;
			font-size: 24rpx;
			display: flex;
			// justify-content: space-around;
			align-items: center;
			padding-left: 6rpx;
			.f_box_item {
				display: flex;
				align-items: center;
				height: 34rpx;
				
				.item_image {
					width: 28rpx;
					height: 28rpx;
					line-height: 34rpx;
					margin-right: 8rpx;
					margin-left: 38rpx;
				}
				.item_text {
					// line-height: 34rpx;
				}
				.item_line {
					width: 2rpx;
					height: 16rpx;
					background-color: #B6B6B6;
					margin-left: 36rpx;
				}
			}
		}
		
	}
</style>