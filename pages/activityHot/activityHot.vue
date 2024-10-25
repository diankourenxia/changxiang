<template>
	<view class="page">
		<!--  -->
		<!-- <view class="topView"> -->
			<!-- <view class="topBox1">
				1 元租
				<view class="special-text">苹果</view>旗舰
			</view>
			<view class="topBox2">
				正品保障 免押租
			</view> -->
		<!-- </view> -->
		<!--  -->
		<view class="headerView">
			
			<!-- <view class="h_box">
				<view v-for="(item,index) in list.headList" :key="index" class="h_box_list" @click="gotoProduct(item.productId)">
					<view class="list_imgBox">
						<image :src="item.image" class="list_img"></image>
						<text class="list_text">{{item.name}}</text>
					</view>
					<view class="list_textBox">
						<view>￥<text style="font-size: 26rpx;font-weight: bold;">{{item.minPrice}}</text>/天</view>
						<image src="https://oss.changxiangwl.cn/backstage/2024-10-16/1bad658d806f497fbf1253903d9db9a4.jpg" class="list_textImg"></image>
					</view>
				</view>
			</view> -->
		</view>
		<!-- 官方严选 -->
		<view class="banner-2">
			<image src="https://oss.changxiangwl.cn/backstage/2024-10-24/c3d98670626d4cde8444981fc8f4c08a.jpg" mode="aspectFit"></image>
		</view>
		<view class="shopView">
			
			<view class="shop_Box">
				<view class="shop_box_list product-item" v-for="(item,index) in list" :key="index" @click="gotoProduct(item.productId)">
					<image :src="item.image" class="product-image"   mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="banner-2">
			<image src="https://oss.changxiangwl.cn/backstage/2024-10-24/c3d98670626d4cde8444981fc8f4c08a.jpg" mode="aspectFit"></image>
		</view>
		<view class="shopView">
			
			<view class="shop_Box_2">
				<view class="shop_box_list product-item-2" v-for="(item,index) in list2" :key="index" @click="gotoProduct(item.productId)">
					<image :src="item.image" class="product-image"   mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="banner-2" style="height:10.1vw">
			<image src="https://oss.changxiangwl.cn/backstage/2024-10-24/5dc558e5a4734668b65210cb903f2ff2.jpg" mode="aspectFit"></image>
		</view>
		<view class="shopView">
			
			<view class="shop_Box">
				<view class="shop_box_list product-item" v-for="(item,index) in list3" :key="index" @click="gotoProduct(item.productId)">
					<image :src="item.image" class="product-image"   mode="widthFix"></image>
				</view>
			</view>
		</view>
		
		<!-- fixed -->
		<view class="bottomImg">
			<!-- <image src="https://oss.changxiangwl.cn/backstage/2024-10-16/9bae73299a7d451e88c3bc1fd5687229.png" mode="aspectFit" class="bottomImg_img"></image> -->
		</view>
	</view>
</template>

<script>
	import { request } from "@/utils"
	import { channelMaiDianHandler } from "../../utils/index";
	import homeService from "./services";

	export default {
		data(){
			return {
				list:[{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/ae56e75fe56e4812968d465c43e0c3be.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/a2d95624ba2e41ea9eb60c7558fc24af.jpg',
					productId:''
				}],
				list2:[{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/2ac51250811041dd97695bdf9ad1a9de.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/0e04f751fda44d2d9cdb2390b01b6d91.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/7fc9cafee49f4013976982ed117b3df9.jpg',
					productId:''
				}],
				list3:[{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/2bbfba019e934dd78633fd0f2c3f2cf7.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/9f652a4ee36040399bed0c3f95950f17.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/817add18c2ea4943bb76c784b5d25ee2.jpg',
					productId:''
				},{
					image:'https://oss.changxiangwl.cn/backstage/2024-10-24/a0f6fb0950174e288285ebe3b70d16b7.jpg',
					productId:''
				}],
			}
		},
		onLoad(e) {
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
			  this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
			  channelMaiDianHandler(); // 进行埋点上传
			}
			// this.selectFashionList();
		},
		methods:{

			filterText(text) {
			      return text.replace(/[^a-zA-Z0-9 ]/g, '');
			    },
			filterDesc(text){
				if(text.indexOf('15 Pro MAX')>0){
					return '6.7 英寸 ｜ 4800 万像素 ｜ A17 Pro 芯片'
				}else if(text.indexOf('15 Pro')>0){
					return 'A17 Pro  芯片 ｜ 6 核图形处理器'
				}else if(text.indexOf('15PLUS')>0){
					return '6.7 英寸 ｜ 4800 万像素'
				}else{
					return 'A16  仿生芯片 ｜ 5 核图形处理器'
				}
			},
			selectFashionList(){
				return request("/hzsx/aliPay/product/productList",{},
				"GET", true, true).then(res=>{
					this.list = res.data;
				})
				// return request("/hzsx/api/components/selectRecommendProducts", {}, "GET", true, true).then(res => {
				//   const resData = res && res.data
				//   this.list = resData || [] // 商品列表数据
				// })
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
background: rgb(190,208,234);
		min-height: 100vh;
		padding-bottom: 60rpx;
		position: relative;
		.topView {
			width: 100%;
			height: 208rpx;
			background: black;
			position: relative;
			.topImg1 {
				width: 100%;
				// height: 69rpx;
				
			}
			view {
				position: absolute;
			}
			.topBox1 {
				width: 100%;
				font-size: 94rpx;
				color: #e8e9fc;
				font-weight: bold;
				text-align: center;
				z-index: 50;
				top: 68rpx;
				left: 0;
				
				.special-text {
				  position: relative; /* 设置相对定位 */
				  display: inline-block; /* 行内块级元素 */
				  font-weight: bold; /* 字体粗细 */
				  margin: 0 40rpx;
				
				  /* 添加伪元素，用于在文字前后添加特殊样式 */
				}
				.special-text::before {
				  content: '\300E'; /* Unicode 左双引号 */
				  position: absolute; /* 绝对定位 */
				  left: -90rpx; /* 调整位置 */
				  top: -5rpx;
				}
				.special-text::after {
				  content: '\300F'; /* Unicode 右双引号 */
				  position: absolute; /* 绝对定位 */
				  right: -90rpx; /* 调整位置 */
				  bottom: -5rpx;
				}
			}
			.topBox2 {
				width: 306rpx;
				height: 52rpx;
				background: #DAFD75;
				text-align: center;
				line-height: 52rpx;
				font-size: 36rpx;
				z-index: 10;
				top: 30rpx;
				right: 56rpx;
				transform: rotate(-2deg);
			}
		}
		.banner-2{
			width: 100%;
			    text-align: center;
			    display: flex;
				justify-content: center;
				image{
					width: 100vw;
					height:13vw;
					align-self: center;
				}
		}
		.headerView {
			// position: absolute;
			width:100vw;
			height:63vw;
		   
			// top: 192rpx;
			// left: 18rpx;
			background: url('https://oss.changxiangwl.cn/backstage/2024-10-24/f1af82377a1c4d86b4682ebc257cee3a.jpg') no-repeat;
			  background-size: cover; /* 保持比例，图片会填满容器，可能会被裁剪 */
			    background-position: 0 0; /* 图片居中显示 */

			
			.h_box {
				width: calc(100% - 50rpx);
				margin-left: 42rpx;
				margin-top: 48rpx;
				height: 306rpx;
				display: flex;
				.h_box_list {
					width: 200rpx;
					height: 100%;
					background: linear-gradient( 90deg, #B4E4FF 0%, #EFECFE 23%, #DAC3FF 47%, #EFECFE 71%, #B4E4FF 95%);
					box-shadow: inset 0rpx -4rpx 8rpx 0rpx rgba(0,71,255,0.33), 0rpx 4rpx 8rpx 0rpx rgba(0,25,250,0.32);
					border-radius: 26rpx;
					padding: 6rpx;
					margin-right: 14rpx;
					
					.list_imgBox {
						width: 100%;
						height: 230rpx;
						background: linear-gradient( 129deg, #B6BDFB 0%, #6494F1 95%);
						box-shadow: inset 8rpx -4rpx 28rpx -14rpx #1677FF;
						border-radius:26rpx;
						display: flex;
						align-items: center;
						flex-direction: column;
						justify-content: center;
						font-size: 24rpx;
						.list_img {
							width: 156rpx;
							height: 156rpx;
						}
						.list_text {
							width: 100%;
							margin-top: 12rpx;
							padding: 0 12rpx;
							box-sizing: border-box;
							white-space: nowrap; /* 不换行 */
							overflow: hidden; /* 溢出隐藏 */
							text-overflow: ellipsis; /* 使用省略号表示溢出的部分 */
						}
					}
					
					.list_textBox {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24rpx;
						color: #333333;
						margin-top: 16rpx;
						
						.list_textImg {
							width: 28rpx;
							height: 28rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
		.shopView {
			// margin-top: -8rpx;
			
			.shopTitle {
				width: 100%;
				height: 72rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				
				.title_img {
					width: 72rpx;
					height: 70rpx;
				}
				.l2 {
					transform: rotate(180deg);
				}
				.title_text {
					margin: 0 32rpx;
					font-size: 48rpx;
					color: #FFFFFF;
				}
			}
			.shop_Box_2{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				background: rgb(190,208,234);
				 flex:auto;
				 justify-content: center; /* 水平居中对齐 */
				   align-items: center; /* 垂直居中对齐 */
				.product-item-2 {
				  display: flex; /* 使用 Flexbox 布局 */
				  align-items: center; /* 垂直居中对齐 */
				  margin-bottom:10rpx;
				  width:33%;
				  :last-child{
					  margin-left: -1px;
				  }
				 
				}
			}
			.shop_Box {
				// padding: 32rpx 20rpx 0rpx 20rpx;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				background: rgb(190,208,234);
				 flex:auto;
				 justify-content: center; /* 水平居中对齐 */
				   align-items: center; /* 垂直居中对齐 */
				 gap: 25rpx;
				.product-item {
				  display: flex; /* 使用 Flexbox 布局 */
				  align-items: center; /* 垂直居中对齐 */
				  margin-bottom:10rpx;
				  width:350rpx;
				 
				}
				
				
				.product-image {
				  flex: 1;
				}
				
				.product-info {
				  display: flex;
				  flex-direction: column; /* 垂直排列名称和价格 */
				      flex: 1;
				      width: 70%;
				      height: 100%;
				}
				
				.product-name {
				     color: white;
					 height:30%;
					 font-weight: 700;
					 display: flex;
					 justify-content: flex-start; /* 水平靠左 */
					 align-items: center; /* 垂直居中 */
					 font-size: 36rpx;
				     flex: 1;
				     text-align: left;
					 background: linear-gradient(to right, #ff7e5f, #feb47b); /* 渐变颜色 */
					   -webkit-background-clip: text; /* 背景剪切 */
					   -webkit-text-fill-color: transparent; /* 文字填充透明 */
				}
				.product-desc{
					height:20%;
					align-self: flex-start;
					color:#bdbfc4;
					font-size:22rpx;
					margin-bottom:20rpx;
				}
				.product-price {
				  font-size: 24rpx; /* 商品价格字体大小 */
				  color: white; /* 商品价格字体颜色 */
				  height:40%;
				  flex: 1;
				      display: flex;
				      flex-direction: row;
					  .product-price-price{
						  flex:1;
						  widht:50%;
						      display: flex;
						      justify-content: flex-end;
						      align-items: center;
					  }
					  image{
						  flex:1;
						  height:100%
					  }
					  .product-price-only{
						      align-self: center;
						      color: #ff0000;
							  font-size: 28rpx;
					  }
				}
				.shop_box_list {
					
					
					.list_shop_image {
						width: 200rpx;
						height: 200rpx;
					}
					.list_shop_title {
						width: 100%;
						height: 44rpx;
						line-height: 44rpx;
						text-align: left;
						white-space: nowrap; /* 不换行 */
						overflow: hidden; /* 溢出隐藏 */
						text-overflow: ellipsis; /* 使用省略号表示溢出的部分 */
						font-weight: 500;
						font-size: 28rpx;
						color: #333333;
						padding-left: 10rpx;
					}
					
					.list_shop_bot {
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 56rpx;
						background-color: #333333;
						font-size: 24rpx;
						color: #ffffff;
						padding: 0 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.list_shop_botImg1 {
							height: 100%;
						}
					}
				}
			}
		}
		.bottomImg{
			width: 100%;
			text-align: center;
			padding: 20rpx 0 0;
			bottom: 0;
			left: 0;
			.bottomImg_img{
				width: 100%;
			}
		}
	}
</style>