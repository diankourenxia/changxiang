<template>
	<view class="lowActivityBox">
		<!--  -->
		<view class="topBox">
			<view :style="{'height':menuHeight+menuTop+9}" class="fixedHeader"></view>
			<image src="https://oss.chuangliukeji.com/backstage/2024-07-03/684ea4305461487c9f72fde1ed4d47aa.png" class="topBox_img"></image>
			<view class="topBox_text">
				免押租机 超低月供
			</view>
		</view>
		<!--  -->
		<view class="topShop">
			<image src="https://oss.chuangliukeji.com/backstage/2024-07-03/c20466c2108742599edce86e240c23d1.png" class="shopBox"></image>
			<image src="https://oss.chuangliukeji.com/backstage/2024-07-03/442e5138e31b49b98dd2c55a87be01bc.png" class="shop_titileImg"></image>
			<view class="shop_title">
				全新iPhone 15系列5折起
			</view>
			<view class="shop_boxList">
				<view class="s_box_list" v-for="(item,index) in list.headList" :key="index" @click="gotoProduct(item.productId)">
					<image :src='item.image' class="list_img"></image>
					<view class="list_price">
						￥<text style="font-size: 28rpx;">{{item.minPrice}}</text>/天
					</view>
					<view class="list_title">{{item.name}}</view>
					<view class="list_oldPrice">
						立省300
					</view>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="contactTitleBox">
			<view class="TitleBox_img">限时低价</view>
		</view>
		<!--  -->
		<view class="contactBox">
			<view class="c_Box_list" v-for="(item,index) in list.list" :key="index" @click="gotoProduct(item.productId)">
				<image :src="item.image" class="list_img"></image>
				<view class="list_text">
					{{item.name}}
				</view>
				<view class="list_titleBox">
					<view class="list_title">
						<view class="title_oldText">￥{{(item.minPrice + 0.94).toFixed(2) }}</view>
						<view>
							￥<text style="font-size: 28rpx;font-weight: 600;">{{item.minPrice}}</text>/天
						</view>
					</view>
					<view class="list_title_img">抢租</view>
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
		data() {
			return {
				menuTop: 0,
				menuHeight: 0,
				list:{},
			}
		},
		onLoad(e) {
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
				this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
				channelMaiDianHandler(); // 进行埋点上传
			}
			this.onList();
			this.getMenu(); //自定义顶部胶囊位置
		},
		methods: {
			onList() {
				return request("/hzsx/aliPay/product/productListCommon",{ code: 'product:low:price' },
				"GET", true, true).then(res=>{
					this.list = res.data;
				})
			},
			//
			getMenu() {
				const {
					height,
					top
				} = uni.getMenuButtonBoundingClientRect();
				this.menuTop = top;
				this.menuHeight = height;
			},
			// 跳转商品详情
			gotoProduct(id){
				this.$onTo(`pages/product/product?productId=${id}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	view {
		box-sizing: border-box;
	}
	.lowActivityBox {
		background-color: #5328D8;
		position: relative;
		min-height: 100vh;
		padding-bottom: 120rpx;
		.topBox {
			width: 100%;
			height: 546rpx;
			background: url('https://oss.chuangliukeji.com/backstage/2024-07-03/ee0358c03ca74dc08bb0f5e0ca049435.png') no-repeat;
			background-size: 100% 100%;
			
			.fixedHeader {
				width: 100%;
			}
			.topBox_img {
				width: 406rpx;
				height: 96rpx;
				margin: 0rpx 0 20rpx 42rpx;
			}
			.topBox_text {
				width: 328rpx;
				height: 56rpx;
				background: linear-gradient( 91deg, #C5EAF9 0%, #FCF8FF 20%, #F9F9DB 45%, #F1FDC0 65%, #FEFEFE 81%, #CDFEB0 96%);
				border-radius: 16rpx 0rpx 16rpx 0rpx;
				border: 2rpx solid rgba(0,0,0,0.48);
				font-weight: 600;
				font-size: 36rpx;
				color: rgba(0,0,0,0.76);
				line-height: 50rpx;
				text-align: center;
				font-style: normal;
				text-transform: none;
				margin-left: 42rpx;
			}
		}
		.topShop {
			width: 706rpx;
			height: 360rpx;
			margin-left: 24rpx;
			position: relative;
			.shopBox {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: -22rpx;
				z-index: 50;
			}
			.shop_titileImg {
				position: absolute;
				width: 252rpx;
				height: 192rpx;
				right: -24rpx;
				top: -34rpx;
				z-index: 1;
			}
			.shop_title {
				position: absolute;
				top: 0;
				left: 32rpx;
				font-weight: bold;
				font-size: 40rpx;
				color: #5832D1;
				line-height: 47rpx;
				z-index: 99;
			}
			.shop_boxList {
				width: 100%;
				display: flex;
				position: absolute;
				bottom: 50rpx;
				left: 24rpx;
				z-index: 99;
				.s_box_list{
					width: 208rpx;
					height: 228rpx;
					background: url('https://oss.chuangliukeji.com/backstage/2024-07-03/cce24f57b28741aca740c0169d4a15bd.png') no-repeat;
					background-size: 100% 100%;
					text-align: center;
					padding-top: 32rpx;
					margin-right: 16rpx;
					position: relative;
					
					.list_img {
						width: 118rpx;
						height: 118rpx;
					}
					.list_price {
						position: absolute;
						bottom: 60rpx;
						left: 34rpx;
						height: 40rpx;
						padding: 0 10rpx;
						background: #5628D8;
						border-radius: 34rpx;
						font-size: 20rpx;
						color: #ffffff;
						text-align: center;
						line-height: 40rpx;
					}
					.list_title {
						position: absolute;
						bottom: 20rpx;
						left: 0;
						width: 100%;
						padding: 0 18rpx;
						font-size: 24rpx;
						color: #5328D8;
						white-space: nowrap; /* 不换行 */
						overflow: hidden; /* 溢出隐藏 */
						text-overflow: ellipsis; /* 使用省略号表示溢出的部分 */
					}
					.list_oldPrice {
						position: absolute;
						top: 0;
						left: 0;
						width: 60rpx;
						height: 60rpx;
						background: url('https://oss.chuangliukeji.com/backstage/2024-07-05/358f1666ad1a4743b39a71791e427656.png') no-repeat;
						background-size: 100% 100%;
						word-wrap: break-word;
						overflow-wrap: break-word;
						font-size: 16rpx;
						padding: 16rpx 10rpx;
						color: #fff;
					}
				}
			}
		}
		.contactTitleBox{
			width: 100%;
			display: flex;
			justify-content: center;
			margin: 2rpx 0 8rpx 0;
			.TitleBox_img {
				width: 442rpx;
				height: 102rpx;
				background: url('https://oss.chuangliukeji.com/backstage/2024-07-03/4be2aac2df774fb3bc9b9606b55dcdc6.png') no-repeat;
				background-size: 100% 100%;
				padding-left: 152rpx;
				line-height: 94rpx;
				font-weight: bold;
				font-size: 40rpx;
				color: #302F6D;
			}
		}
		.contactBox {
			width: calc(100% - 48rpx);
			display: flex;
			flex-wrap: wrap;
			padding: 24rpx 0 14rpx 14rpx;
			margin-left: 24rpx;
			background: #F4F1FF;
			box-shadow: inset 0rpx 8rpx 65rpx 0rpx rgba(175,162,255,0.56), inset 0rpx -2rpx 30rpx 0rpx rgba(175,162,255,0.45);
			border-radius: 32rpx;
			.c_Box_list {
				width: 212rpx;
				height: 336rpx;
				background: #FFFFFF;
				border: 4rpx solid;
				border-image: linear-gradient(140deg, rgba(168, 245, 232, 1), rgba(207, 208, 250, 1)) 4 4;
				border-radius: 16rpx;
				margin: 0 0 10rpx 10rpx;
				padding-top: 24rpx;
				position: relative;
				
				.list_img {
					width: 140rpx;
					height: 176rpx;
					margin-left: 32rpx;
				}
				.list_titleBox {
					margin-top: 8rpx;
					width: 100%;
					height: 81rpx;
					font-size: 20rpx;
					color: #5328D8;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 8rpx;
					background: url('https://oss.chuangliukeji.com/backstage/2024-07-05/c717d20a79b34a239405c42b187eb326.png') no-repeat;
					background-size: 100%, 100%;
					.list_title {
						text-align: center;
						
						
					}
					.list_title_img {
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
				.list_text {
					width: 100%;
					padding: 0 8rpx;
					font-weight: 600;
					font-size: 24rpx;
					color: #5328D8;
					line-height: 28rpx;
					margin-top: 8rpx;
					white-space: nowrap; /* 不换行 */
					overflow: hidden; /* 溢出隐藏 */
					text-overflow: ellipsis; /* 使用省略号表示溢出的部分 */
				}
				
			}
		}
		.title_oldText {
			text-decoration: line-through;
			color: #999;
		}
		.bottomImg{
			width: 100%;
			text-align: center;
			padding: 20rpx 0 40rpx 0;
			position: absolute;
			bottom: 0;
			left: 0;
			.bottomImg_img{
				width: 50%;
			}
		}
	}
</style>