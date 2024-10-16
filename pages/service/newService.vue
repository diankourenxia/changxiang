<template>
	<view class="service">
		<view class="top_image">
			<view :style="{'height':menuHeight+menuTop}"></view>
			<view class="top_hender">
				<view class="top_hender_textView">
					<view class="textView_text">Hi～有什么可以帮您？</view>
					<view>服务时间：周一至周日 9:00～21:00</view>
				</view>
				<image class="top_hender_image" src="https://oss.chuangliukeji.com/backstage/2024-04-19/651136b9d773412db13ba6973fc12e50.png"></image>
			</view>
		</view>
		<view class="list_view" :style="{'top':menuHeight+menuTop+105}">
			<view class="askView">
				
			</view>
			<view class="telView">
				
			</view>
		</view>
		
	</view>
</template>

<script>
import { request } from "@/utils"
export default {
	data () {
		return{
			serviceTel:'18969032669',//电话
			menuTop: 0, //胶囊通知栏top
			menuHeight: 0, //胶囊高度
		}
	},
	onLoad() {
		this.getMenu();
	},
	methods:{
		// 获取导航栏高度
		getMenu() {
			const {
				height,
				top
			} = uni.getMenuButtonBoundingClientRect();
			this.menuTop = top;
			this.menuHeight = height;
		},
		//拉起手机电话
		onPhone() {
		  uni.makePhoneCall({
		    phoneNumber: this.serviceTel,
		  });
		},
	}
}
</script>

<style lang="scss" scoped>
	view{
		box-sizing: border-box;
	}
	.service{
		position: relative;
		.top_image{
			width: 100%;
			height: 518rpx;
			background-image: url('https://oss.chuangliukeji.com/backstage/2024-04-19/e6f18c9b5be74ceaa604ca829711711c.png');
			background-size: 100% 100%;
			
			.top_hender{
				width: calc(100% - 24rpx);
				margin: 22rpx 0 0 48rpx;
				height: 170rpx;
				display: flex;
				
				.top_hender_textView{
					font-weight: 400;
					font-size: 26rpx;
					color: #666666;
					display: flex;
					flex-direction: column;
					justify-content: center;
					text-transform: none;
					font-family: HarmonyOS Sans SC, HarmonyOS Sans SC;
					margin-right: 20rpx;
					.textView_text{
						font-weight: bold;
						font-size: 34rpx;
						color: #333333;
						margin-bottom: 12rpx;
					}
				}
				.top_hender_image{
					width: 242rpx;
					height: 170rpx;
				}
			}
		}
		.list_view{
			position: absolute;
			width: 700rpx;
			left: 24rpx;
			
			.askView{
				width: 100%;
				height: 900rpx;
				background: #FFFFFF;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				z-index: 50;
			}
			.telView{
				width: 100%;
				height: 136rpx;
				background: #FFFFFF;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				margin: 24rpx 0 48rpx 0;
			}
		}
		
	}
</style>