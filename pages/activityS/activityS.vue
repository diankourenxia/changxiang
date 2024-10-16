<template>
	<view class="page">
		<!-- 头部图片 -->
		<view class="topBanner">
			<image class="topBannerImg" src="https://oss.chuangliukeji.com/backstage/2023-05-16/d4cc674986464e4ebcf448fc9c7803b0.png" mode="widthFix"></image>
		</view>
		<!-- 标题 -->
		<view class="listTitle">
			<image class="listTitleImg" src="https://oss.chuangliukeji.com/backstage/2023-05-16/d454080b7d1a47a3b0735ba073a02069.png" mode="widthFix"></image>
		</view>
		<!-- 横列表list -->
		<view class="dataY">
			<view class="listY" v-for="(item,index) in fashList" :key="index" @click="gotoProduct(item.productId)">
				<image class="yLeftImg" :src="item.src"></image>
				<view class="yRight">
					<view class="yRightTitle">
						<text v-if="item.oldNewDegree == 1" class="yTitleclass">全新</text><text v-if="item.oldNewDegree == 2" class="yTitleclass btn1">99新</text><text v-if="item.oldNewDegree == 3" class="yTitleclass btn1">95新</text><text v-if="item.oldNewDegree == 4" class="yTitleclass btn1">9成新</text><text v-if="item.oldNewDegree == 5" class="yTitleclass btn1">8成新</text><text v-if="item.oldNewDegree == 6" class="yTitleclass btn1">7成新</text>{{item.name}}
					</view>
					<view style="display: flex;justify-content: space-between;">
						 <view class="">
						 	<view class="yLabel">
						 		包邮
						 	</view>
							<!-- 最底部的商品价格区域 -->
							<view class="price-area plr20">
							  <view class="left">
							    <text class="m">¥</text>
							    <text class="l">{{ getPartMoney(true,item.sale) }}</text>
							    <text class="d">.</text>
							    <text class="r">{{ getPartMoney(false,item.sale) }}</text>
							    <text class="r">/天</text>
							  </view>
							  <!-- <view class="right">已租{{ productObj.salesVolume || 0 }}</view> -->
							</view>
						 </view>
						 <view>
						 	<view class="yButton">
						 		立即租用
						 	</view>
						 </view>
					</view>
				</view>
			</view>
		</view>
		<!-- 标题 -->
		<view class="listTitle">
			<image class="listTitleImg" src="https://oss.chuangliukeji.com/backstage/2023-05-16/4f517d4eb29a4a2b873feb6057a3f11d.png" mode="widthFix"></image>
		</view>
		<!-- x列表 -->
		<view class="x_Box">
			<view class="x_list" v-for="(item,index) in qualiList" :key="index" @click="gotoProduct(item.productId)">
				<image :src="item.src" class="x_list_img"></image>
				<view>
					<view class="yRightTitle">
						<text v-if="item.oldNewDegree == 1" class="yTitleclass">全新</text><text v-if="item.oldNewDegree == 2" class="yTitleclass btn1">99新</text><text v-if="item.oldNewDegree == 3" class="yTitleclass btn1">95新</text><text v-if="item.oldNewDegree == 4" class="yTitleclass btn1">9成新</text><text v-if="item.oldNewDegree == 5" class="yTitleclass btn1">8成新</text><text v-if="item.oldNewDegree == 6" class="yTitleclass btn1">7成新</text>{{item.name}}
					</view>
					<view class="yLabel" style="margin-top: 6rpx;margin-bottom: 30rpx;">
						包邮
					</view>
					<view style="display: flex;justify-content: space-between;">
						<view class="price-area plr20">
						  <view class="left">
						    <text class="m">¥</text>
						    <text class="l">{{ getPartMoney(true,item.sale) }}</text>
						    <text class="d">.</text>
						    <text class="r">{{ getPartMoney(false,item.sale) }}</text>
						    <text class="r">/天</text>
						  </view>
						  <!-- <view class="right">已租{{ productObj.salesVolume || 0 }}</view> -->
						</view>
						<image class="x_list_shopImg" src="https://oss.chuangliukeji.com/backstage/2023-05-16/85723090aaf14304862c2cdd4b201548.png"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部banner -->
		<!-- <view class="bottomBanner">
			<image class="bottomBannerImg" src="https://oss.chuangliukeji.com/backstage/2023-05-16/6888ee030b294061bf833a3ef3bf8aff.png" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
import { request } from "@/utils"
import { channelMaiDianHandler } from "../../utils/index";
export default {
	data(){
		return {
			fashList:[],
			qualiList:[]
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
			return request("/hzsx/api/components/selectActivityCommodityFashion",{},
			"GET", true, true).then(res=>{
				this.fashList = res.data;
			})
		},
		// 精选产品
		selectQuality(){
			return request("/hzsx/api/components/selectActivityCommodityQuality",{}, "GET", true, true).then(res=>{
				this.qualiList = res.data;
			})
		},
		// 跳转商品详情
		gotoProduct(id){
			this.$onTo(`pages/product/product?productId=${id}`)
		},
		
		
		/**
		 * 获取金额的小数点前、后的数据
		 * @param {Boolean} isFront : 是否是前半部分
		 */
		getPartMoney(isFront,salePrice) {
		  const price = String(salePrice); // 接口返回的价格不一定是字符串，所以这里做一个强制转换
		  if (!price) return EMPTY_PLACEHOLDER;
		  const list = price.split(".");
		  const result = isFront ? list[0] : list[1];
		  return result || 0;
		},
		
	}
}
</script>

<style lang="scss" scoped>
	view{
		box-sizing: border-box;
	}
	.page{
		height: 100%;
		background-color: #51C9FF;
		padding-bottom: 50rpx;
	}
	.topBanner{
		width: 100%;
	}
	.topBannerImg{
		width:100%
	}
	.listTitle{
		width: 100%;
		padding-top: 18rpx;
		text-align: center;
	}
	.listTitleImg{
		width: 320rpx;
	}
	.dataY{
		width: 100%;
		padding:0 24rpx 24rpx 24rpx;
	}
	.listY{
		width: 100%;
		height: 224rpx;
		background: url('https://oss.chuangliukeji.com/backstage/2023-05-16/f15853ee1de54086b1f8c2af16d00cfb.png');
		background-size: 100% 100%;
		padding: 12rpx;
		margin-bottom: 24rpx;
		display: flex;
	}
	.yLeftImg{
		width:192rpx;
		height:192rpx;
	}
	.yRight{
		width:450rpx;
		height: 192rpx;
		padding-top: 12rpx;
		margin-left:16rpx;
	}
	.yRightTitle{
		height: 76rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 超出几行省略 */
		overflow: hidden;
	}
	.yTitleclass{
		width: 56rpx;
		height: 28rpx;
		background: linear-gradient(315deg, #35CC6A 0%, #6AE695 100%);
		border-radius: 4rpx;
		font-size: 20rpx;
		font-weight: 400;
		color: #FFFFFF;
		padding: 4rpx 8rpx;
		margin-right:8rpx;
		line-height: 40rpx;
	}
	.btn1{
		background: linear-gradient(315deg, #03ADF6 0%, #30CBFE 100%);
	}
	.yLabel{
		border-radius: 8rpx;
		border: 1rpx solid #E6D3D5;
		padding: 4rpx 8rpx;
		font-size: 20rpx;
		font-weight: 500;
		color: #FE3D4F;
		width: 60rpx;
		margin-bottom: 15rpx;
	}
	.price-area {
	  display: flex;
	  flex-direction: row;
	  align-items: flex-end;
	  justify-content: space-between;
	  .left {
	    color: #e52021;
	    .m {
	      font-size: 20rpx;
	      margin-right: 6rpx;
	    }
	    .l {
	      font-size: 38rpx;
	      font-weight: 500;
	    }
	    .d {
	      font-size: 36rpx;
	    }
	    .r {
	      font-size: 20rpx;
	      font-weight: 500;
	    }
	  }
	  .right {
	    font-size: 20rpx;
	    font-family: PingFangSC-Regular, PingFang SC;
	    font-weight: 400;
	    color: #999999;
	    margin-bottom: 3rpx;
	  }
	}
	.yButton{
		width: 140rpx;
		height: 64rpx;
		background: url("https://oss.chuangliukeji.com/backstage/2023-05-16/716b4f3eba014356b273949e7a09e33a.png");
		background-size: 100% 100%;
		font-size: 24rpx;
		font-weight: 600;
		color: #FFFFFF;
		text-align: center;
		line-height: 64rpx;
		margin-top: 30rpx;
	}
	.x_Box{
		width: calc(100% - 24rpx);
		display: flex;
		flex-wrap: wrap;
	}
	.x_list{
		width: 340rpx;
		height:550rpx;
		background: url("https://oss.chuangliukeji.com/backstage/2023-05-16/0796c8e1860540919f137c6f923f5983.png");
		background-size: 100% 100%;
		margin: 0 0 24rpx 22rpx;
		padding: 16rpx;
	}
	.x_list_img{
		width: 300rpx;
		height:300rpx;
		margin-bottom: 10rpx;
	}
	.x_list_shopImg{
		width:48rpx;
		height:48rpx;
	}
	
	.bottomBanner{
		width: 100%;
		padding: 40rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}
	.bottomBannerImg{
		width: 100%;
	}
</style>