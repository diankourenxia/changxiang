<template>
	<view class="page">
		<view class="banner_box">
			<view class="banner">
				<view class="banner_left">
					<view>
						<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/1860537bc60144129053d50bd2f8857e.png" mode="widthFix" class="left_img1"></image>
					</view>
					<view class="left_title">通 过 率 高 | 随 租 随 还</view>
					<view>
						<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/2a69ef91ccd24880846103a1e54f5cde.png" mode="widthFix" class="left_img2"></image>
					</view>
				</view>
				<view class="banner_right">
					<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/6615b8cd76024eaea7f4de120db5a29c.png" mode="widthFix" class="right_img1"></image>
				</view>
			</view>
			<!-- 爆款 -->
			<view class="long_box positionA">
				<view class="long_box_title">
					<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/2160f487d3f84220b73734192dd2e22f.png" class="long_box_img1"></image>
				</view>
				<view class="long_box_center" @click="gotoProduct(fashListOne.productId)">
					<view class="long_left">
						<image :src="fashListOne.src" class="long_logo"></image>
					</view>
					<view class="long_right">
						<view class="long_title">
							{{fashListOne.name.substring(0,10) || ''}}
						</view>
						<view class="long_describe">
							{{fashListOne.name.substring(10) || ''}}
						</view>
						<view class="long_btn">
							<view class="btn_text">租金只需{{fashListOne.sale}}/天</view>
							<view style="width: 64rpx;"></view>
							<view class="btn_radio">抢</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="short">
			<view class="short_box" v-for="(item,index) in fashList" :key="index" v-if="index > 0" @click="gotoProduct(item.productId)">
				<view class="short_box_center">
					<view class="short_left">
						<image :src="item.src" class="short_logo"></image>
					</view>
					<view class="short_right">
						<view class="short_title">
							{{item.name.substring(0,7) || ''}}
						</view>
						<view class="short_describe">
							{{item.name.substring(7) || ''}}
						</view>
						<view class="short_btn">
							<view class="btn_text">{{item.sale}}/天</view>
							<view style="width: 26rpx;"></view>
							<view class="btn_radio">抢</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 热租 -->
		<view class="long_box marginTop20">
			<view class="long_box_title">
				<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/f0585d81bc1944eeb5ef5e7122689a66.png" class="long_box_img1"></image>
			</view>
			<view class="long_box_center" @click="gotoProduct(qualiListOne.productId)">
				<view class="long_left">
					<image :src="qualiListOne.src" class="long_logo"></image>
				</view>
				<view class="long_right">
					<view class="long_title">
						{{qualiListOne.name.substring(0,10) || ''}}
					</view>
					<view class="long_describe">
						{{qualiListOne.name.substring(10) || ''}}
					</view>
					<view class="long_btn">
						<view class="btn_text">租金只需{{qualiListOne.sale}}/天</view>
						<view style="width: 64rpx;"></view>
						<view class="btn_radio">抢</view>
					</view>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="short">
			<view class="short_box" v-for="(item,index) in qualiList" :key="index" v-if="index > 0" @click="gotoProduct(item.productId)">
				<view class="short_box_center">
					<view class="short_left">
						<image :src="item.src" class="short_logo"></image>
					</view>
					<view class="short_right">
						<view class="short_title">
							{{item.name.substring(0,7) || ''}}
						</view>
						<view class="short_describe">
							{{item.name.substring(7) || ''}}
						</view>
						<view class="short_btn">
							<view class="btn_text">{{item.sale}}/天</view>
							<view style="width: 26rpx;"></view>
							<view class="btn_radio">抢</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- fixed -->
		<view class="bottomImg">
			<image src="https://oss.chuangliukeji.com/backstage/2024-01-19/240efb2773a640cf9d84705b20d42a1f.png" mode="widthFix" class="bottomImg_img"></image>
		</view>
	</view>
</template>

<script>
	import { request } from "@/utils"
	import { channelMaiDianHandler } from "../../utils/index";
	export default {
		data(){
			return {
				fashList:[],
				fashListOne:{},
				qualiList:[],
				qualiListOne:{},
			}
		},
		onLoad(e) {
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
			  this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
			  channelMaiDianHandler(); // 进行埋点上传
			}
			
			this.selectFashionList();
			this.selectQuality();
		},
		methods:{
			// 爆款产品
			selectFashionList(){
				return request("/hzsx/api/components/selectActivityCommodityFashion",{
					"type":1
				},
				"GET", true, true).then(res=>{
					this.fashList = res.data;
					this.fashListOne = res.data[0];
				})
			},
			// 精选产品
			selectQuality(){
				return request("/hzsx/api/components/selectActivityCommodityFashion",{
					"type":2
				}, "GET", true, true).then(res=>{
					this.qualiList = res.data;
					this.qualiListOne = res.data[0];
				})
			},
			// 跳转商品详情
			gotoProduct(id){
				this.$onTo(`pages/product/product?productId=${id}`)
			},
			
		}
	}
</script>

<style lang="scss">
	view{
		box-sizing: border-box;
	}
	.page{
		background-color: #f12f19;
		min-height: 100vh;
		.banner_box{
			position: relative;
			padding-bottom: 180rpx;
			.banner{
				display: flex;
				text-align: center;
				.banner_left{
					width: 400rpx;
					.left_img1{
						width: 400rpx;
					}
					.left_title{
						font-size: 30rpx;
						color: #ffffff;
						font-weight: bold;
					}
					.left_img2{
						width: 300rpx;
					}
				}
				.banner_right{
					width: 350rpx;
					.right_img1{
						width: 100%;
					}
				}
			}
		}
		.positionA{
			position: absolute;
			left: 0;
			bottom: 0;
		}
		.marginTop20{
			margin-top: 20rpx;
		}
		.long_box{
			width: 100%;
			padding: 0 36rpx;
			.long_box_title{
				margin-left: 36rpx;
				width: 180rpx;
				height: 42rpx;
				background-color: #fff;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
				border: 4rpx solid #000;
				border-bottom: none;
				text-align: center;
				.long_box_img1{
					width: 86%;
					height: 100%;
				}
			}
			.long_box_center{
				width: 100%;
				height: 200rpx;
				background-image: url('https://oss.chuangliukeji.com/backstage/2024-01-19/25728a6949754392836d1bedd299f08d.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				display: flex;
				.long_left{
					width: 200rpx;
					.long_logo{
						width: 100%;
						height: 100%;
					}
				}
				.long_right{
					width: calc(100% - 200rpx);
					text-align: center;
					color: #f12f19;
					padding: 26rpx 20rpx 0 0;
					.long_title {
					  font-size: 44rpx;
					  white-space: nowrap;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  font-weight: bold;
					}
					.long_describe{
						width: 90%;
						font-size: 26rpx;
						font-weight: bold;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
					.long_btn{
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;
						height: 64rpx;
						position: relative;
						margin-top: 4rpx;
						.btn_text{
							width: 265rpx;
							font-size: 26rpx;
							padding: 4rpx 20rpx;
							border-top-left-radius: 30rpx;
							border-bottom-left-radius: 30rpx;
							border: 4rpx solid #000;
							border-right: none;
							background-color: #f12f19;
						}
						.btn_radio{
							position: absolute;
							top: 0;
							right: 72rpx;
							font-size: 30rpx;
							width: 64rpx;
							height: 64rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border: 4rpx solid #000;
							border-radius: 50%;
							background-color: #f12f19;
						}
					}
				}
			}
		}
		.short{
			width: 100%;
			padding-right: 36rpx;
			.short_box{
				width: calc(50% - 36rpx);
				height: 180rpx;
				margin: 20rpx 0 0 36rpx;
				background-image: url('https://oss.chuangliukeji.com/backstage/2024-01-19/47f9220c8be24345bb78de9f21eed432.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				padding: 15rpx 0;
				display: inline-block;
				.short_box_center{
					width: 100%;
					height: 150rpx;
					display: flex;
					.short_left{
						width: 150rpx;
						.short_logo{
							width: 100%;
							height: 100%;
						}
					}
					.short_right{
						width: calc(100% - 150rpx);
						text-align: center;
						color: #f12f19;
						padding: 30rpx 20rpx 0 0;
						.short_title {
						  font-size: 24rpx;
						  white-space: nowrap;
						  overflow: hidden;
						  text-overflow: ellipsis;
						  font-weight: bold;
						}
						.short_describe{
							font-size: 20rpx;
							font-weight: bold;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						.short_btn{
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							height: 40rpx;
							position: relative;
							margin-top: 4rpx;
							.btn_text{
								width: 120rpx;
								font-size: 20rpx;
								padding: 4rpx 6rpx;
								border-top-left-radius: 30rpx;
								border-bottom-left-radius: 30rpx;
								border: 2rpx solid #000;
								border-right: none;
								background-color: #f12f19;
							}
							.btn_radio{
								position: absolute;
								top: 0;
								right: 0rpx;
								font-size: 20rpx;
								width: 40rpx;
								height: 40rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border: 2rpx solid #000;
								border-radius: 50%;
								background-color: #f12f19;
							}
						}
					}
				}
			}
		}
		
		.bottomImg{
			width: 100%;
			text-align: center;
			margin-top: 30rpx;
			padding: 40rpx 0;
			.bottomImg_img{
				width: 50%;
			}
		}
	}
</style>