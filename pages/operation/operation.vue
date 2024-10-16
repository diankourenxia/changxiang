<template>
	<view class="page">
		<!--  -->
		<view class="topView">
			<view class="topTitle">
				<view class="bold">iPhone 15 Pro Max</view>
				<view>顶级摄像头系统</view>
			</view>
			<view class="topImgView">
				<view class="topImgView_ra">
					<view></view>
					<view style="background-color: #4E4F51;"></view>
					<view style="background-color: #F1F1F1;"></view>
					<view style="background-color: #4A5160;"></view>
				</view>
				<view class="topImgView_text">(多种颜色可选)</view>
			</view>
			<view class="topPriceView">
				<view class="topPrice_left">
					￥<text style="font-size: 36rpx;font-weight: bold;">18.93</text>/天
				</view>
				<view class="topPrice_right" @click="gotoProduct('1695715419245')">
					立即抢租>
				</view>
			</view>
		</view>
		
		<!-- 热租榜单1 -->
		<view class="headerView1">
			<view class="h_v_title">热租榜单 心动之选</view>
			<view class="h_v_header">
				<view class="v_header_top"></view>
				<view class="v_header_content">
					<view class="v_header_content_list" v-for="(item,index) in list.headList" :key='index' @click="gotoProduct(item.productId)">
						<image :src="item.image" class="list_img"></image>
						<view class="list_price">
							￥
							<text style="font-size: 26rpx;">{{item.minPrice}}</text>
							/天
						</view>
						<view class="list_text">立即抢租</view>
					</view>
				</view>
				<view class="v_header_bom">
					<view class="header_bom_box1"></view>
					<view class="header_bom_box2"></view>
				</view>
			</view>
		</view>
		
		<!-- 热租榜单2 -->
		<view class="headerView2">
			<view class="h_v_title">热租榜单 心动之选</view>
			<view class="h2_v_listBox">
				<view class="h2_v_listBox_list" v-for="(item,index) in list.list" :key='index' @click="gotoProduct(item.productId)">
					<image :src="item.image" class="list_image"></image>
					<view class="list_title">{{item.name}}</view>
					<view class="list_priceBox">
						<view class="priceBox_price">
							￥
							<text style="font-size: 32rpx;">{{item.minPrice}}</text>
							/天
						</view>
						<image src="https://oss.chuangliukeji.com/backstage/2024-06-26/7a636e4ddf8643189651ae0c099f5071.png" class="priceBoximg" ></image>
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
				list:{},
			}
		},
		onLoad(e) {
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
			  this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
			  channelMaiDianHandler(); // 进行埋点上传
			}
			this.selectFashionList();
		},
		methods:{
			// 
			selectFashionList(){
				return request("/hzsx/aliPay/product/newProductList",{},
				"GET", true, true).then(res=>{
					this.list = res.data;
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
	.bold {
		font-weight: bold;
	}
	.page{
		background-color: #D2F1FF;
		min-height: 100vh;
		padding: 24rpx 24rpx 140rpx 24rpx;
		position: relative;
		
		.topTitle {
			width: 100%;
			height: 166rpx;
			background: linear-gradient( 90deg, rgba(40,159,249,0.67) 0%, rgba(255,255,255,0) 100%);
			font-size: 52rpx;
			padding: 20rpx 0 0 30rpx;
			line-height: 61rpx;
		}
		
		.topImgView {
			width: 100%;
			height: 388rpx;
			background: url('https://oss.chuangliukeji.com/backstage/2024-06-26/206ad37e570c48df8d6b772c2acedb6b.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			
			.topImgView_ra {
				position: absolute;
				bottom: 82rpx;
				left: 0;
				width: 170rpx;
				display: flex;
				>view {
					width: 20rpx;
					height: 20rpx;
					margin-right: 12rpx;
					background-color: #BAB5AC;
					border-radius: 50%;
				 }
			}
			.topImgView_text {
				font-size: 28rpx;
				color: #666666;
				position: absolute;
				bottom: 32rpx;
				left: 0;
			}
		}
		
		.topPriceView {
			width: 100%;
			height: 84rpx;
			background: linear-gradient( 90deg, rgba(40,159,249,0.67) 0%, rgba(255,255,255,0) 100%);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 8rpx 0 24rpx;
			font-size: 32rpx;
			color: #333333;
			
			.topPrice_left {
				font-size: 30rpx;
			}
			
			.topPrice_right {
				width: 190rpx;
				height: 60rpx;
				background: #88DBFF;
				border-radius: 50%;
				text-align: center;
				line-height: 60rpx;
				border: 2rpx solid #000000;
			}
		}
		
		.headerView1 {
			width: 100%;
			height: 360rpx;
			background: #1677FF;
			border-radius: 16rpx;
			padding: 20rpx 18rpx 0rpx;
			margin-top: 28rpx;
			
			.h_v_title {
				font-size: 40rpx;
				color: #FFFFFF;
				line-height: 47rpx;
			}
			
			.h_v_header {
				margin-top: 20rpx;
				width: 100%;
				height: 258rpx;
				background: #FFFFFF;
				position: relative;
				.v_header_top {
					width: calc(100% - 40rpx);
					height: 20rpx;
					background: #DFF1FF;
					position: relative;
					margin-left: 20rpx;
				}
				.v_header_top::before {
					content: '';
					position: absolute;
					top: 0;
					left: -20rpx;
					border-width: 20rpx;
					border-style: solid;
					border-color: #DFF1FF transparent transparent transparent;
				}
				.v_header_top::after {
					content: '';
					position: absolute;
					top: 0;
					right: -20rpx;
					border-width: 20rpx;
					border-style: solid;
					border-color: #DFF1FF transparent transparent transparent;
				}
				.v_header_content {
					position: absolute;
					bottom: 20rpx;
					left: 0;
					width: 100%;
					display: flex;
					overflow: hidden;
					z-index: 50;
					
					.v_header_content_list {
						width: 144rpx;
						height: 214rpx;
						margin: 40rpx 4rpx 0 16rpx;
						position: relative;
						
						.list_img {
							width: 144rpx;
							height: 150rpx;
						}
						.list_price {
							position: absolute;
							bottom: 36rpx;
							left: 0;
							width: 100%;
							height: 40rpx;
							background-color: #1677FF;
							font-size: 20rpx;
							line-height: 40rpx;
							text-align: center;
							color: #ffffff;
						}
						.list_text {
							position: absolute;
							bottom: 0;
							left: 8rpx;
							width: calc(100% - 16rpx);
							height: 36rpx;
							line-height: 36rpx;
							text-align: center;
							font-size: 24rpx;
							color: #333333;
							background-color: #ffffff;
						}
					}
				}
				.v_header_bom {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					.header_bom_box1 {
						width: 100%;
						height: 24rpx;
						background: #D1E3F1;
					}
					.header_bom_box2 {
						width: 100%;
						height: 12rpx;
						background: #A0BED4;
					}
				}
			}
		}
		
		.headerView2 {
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(213,226,239,0.25);
			border-radius: 16rpx;
			margin-top: 20rpx;
			
			.h_v_title {
				height: 86rpx;
				background: #1677FF;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				line-height: 86rpx;
				padding-left: 18rpx;
				font-size: 40rpx;
				color: #FFFFFF;
			}
			
			.h2_v_listBox {
				display: flex;
				flex-wrap: wrap;
				.h2_v_listBox_list {
					width: 234rpx;
					height: 334rpx;
					background: #FFFFFF;
					box-shadow: inset -2rpx -2rpx 0rpx 0rpx rgba(0,0,0,0.06);
					padding: 0 16rpx;
					
					.list_image {
						width: 202rpx;
						height: 202rpx;
						margin: 16rpx 0;
					}
					.list_title {
						width: 100%;
						font-weight: 500;
						font-size: 28rpx;
						color: #333333;
						line-height: 44rpx;
						white-space: nowrap; /* 不换行 */
						overflow: hidden; /* 溢出隐藏 */
						text-overflow: ellipsis; /* 使用省略号表示溢出的部分 */
					}
					.list_priceBox {
						width: 100%;
						height: 48rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
						color: #1677FF;
					}
					.priceBoximg {
						width: 28rpx;
						height: 28rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
		
		
		
		
		.bottomImg{
			width: 100%;
			text-align: center;
			padding: 40rpx 0;
			position: absolute;
			bottom: 0;
			left: 0;
			.bottomImg_img{
				width: 50%;
			}
		}
	}
</style>