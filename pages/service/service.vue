<template>
	<view class="service">
		<!-- 头部 -->
		<view class="s_top">
			<view class="top_text">
				<view class="top_title">Hi~</view>
				<view class="top_title" style="font-size: 36rpx;font-weight: 500;">有什么问题可以帮您?</view>
				<view class="conter_text">
					<view class="text_left">
						<view>客服电话: 18969032669</view>
						<view>时间: 工作日9:00-12:00  13:30-16:30</view>
					</view>
					<view class="text_right">
						<view class="text-but" @click="onPhone">联系客服</view>
					</view>
				</view>
				<view class="infoText" style="z-index: 99999;">
					<image src="https://oss.chuangliukeji.com/backstage/2023-06-15/b2eb1e21fa644ad7802ab6aaf5914fce.png" mode="widthFix" class="infoImg"></image>
					<view>使用过程中如遇任何问题都可以联系官方客服为您解决</view>
				</view>
			</view>
			<view class="bottomSmegma"></view>
		</view>
		<!-- 为您推荐 -->
		<view class="title-area">
		  <view class="round round1"></view>
		  <view class="round round2"></view>
		  <view class="round round3"></view>
		  <text class="title">为您推荐</text>
		  <view class="round round4"></view>
		  <view class="round round5"></view>
		  <view class="round round6"></view>
		</view>
		
		<view class="commodity">
		  <view>
		    <view
		      class="commodity_list"
		      v-for="(item, index) in productList"
		      :key="index"
		    >
		      <ProductItem
		        v-if="index % 2 === 0"
		        :productObj="item"
		        :showXinjiu="false"
		        :showTag="true"
		      >
		        <XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
		      </ProductItem>
		    </view>
		  </view>
		  <view>
		    <view
		      class="commodity_list"
		      v-for="(item, index) in productList"
		      :key="index"
		    >
		      <ProductItem
		        v-if="index % 2 !== 0"
		        :productObj="item"
		        :showXinjiu="false"
		        :showTag="true"
		      >
		        <XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
		      </ProductItem>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
import ProductItem from "../../components/productItem/productItem.vue"
import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue";
import { request } from "@/utils"
export default {
	data () {
		return{
			productList:[],//为您推荐list
			serviceTel:'18969032669',//电话
		}
	},
	components: {
	  ProductItem,
	  XinjiuSlot
	},
	onLoad() {
		this.fetchConfigureDataHandler();
	},
	methods:{
		/**
		 * 为您推荐
		 */
		fetchConfigureDataHandler() {
		  return request("/hzsx/api/components/selectRecommendProducts", {}, "GET", true, true).then(res => {
		    const resData = res && res.data
		    this.productList = resData || [] // 商品列表数据
		  })
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
		
	}
	.s_top{
		width: 100%;
		height: 396rpx;
		position: relative;
		
		.top_text{
			width: 100%;
			height: 336rpx;
			background: url('https://oss.chuangliukeji.com/backstage/2023-06-15/dbd6dc6c5c9e4075852b118307656d6f.png');
			background-size: 100% 100%;
			padding-top: 10rpx;
			.top_title{
				font-size: 46rpx;
				font-weight: 600;
				color: #FFFFFF;
				padding-left: 30rpx;
				line-height: 60rpx;
			}
			.conter_text{
				width: 100%;
				padding: 0 60rpx 0 24rpx;
				display: flex;
				justify-content: space-between;
				font-size: 26rpx;
				color: #fff;
				line-height: 40rpx;
				margin-top: 66rpx;
				.text_left{
					width: 460rpx;
				}
				.text_right{
					.text-but{
						width: 160rpx;
						height: 60rpx;
						background: linear-gradient(135deg, #EDDA25 0%, #F68B1A 100%);
						border-radius: 30rpx;
						margin-top: 22rpx;
						text-align: center;
						line-height: 60rpx;
					}
				}
			}
		}
		.infoText{
			width: calc(100% - 48rpx);
			margin-left: 24rpx;
			height: 64rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			padding: 0 16rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			margin-top: 24rpx;
			z-index: 9999;
			.infoImg{
				width: 26rpx;
				margin-right: 8rpx;
			}
		}
	}
	.bottomSmegma{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60rpx;
		background: linear-gradient(180deg, #286DFE 0%, rgba(40,109,254,0) 100%);
		z-index: -50;
	}
	.title-area {
		height: 90rpx;
		background: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		.round {
			border-radius: 50%;
			background: linear-gradient(180deg, #286DFE 0%, #286DFE 100%);
			margin-right: 10px;
		}
		.round1,
		.round6 {
			width: 5rpx;
			height: 5rpx;
		}
		.round2,
		.round5 {
			width: 8rpx;
			height: 8rpx;
		}
		.round3,
		.round4 {
			width: 12rpx;
			height: 12rpx;
			margin-right: 21rpx;
		}
		.title {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			margin-right: 21rpx;
		}
		.round6 {
			margin-right: 0;
		}
	}
	.commodity {
	  display: flex;
	  justify-content: space-between;
	  padding: 0 20rpx;
	}
	.commodity_list {
	  break-inside: avoid;
	  width: 344rpx;
	}
	.home-bottom {
	  text-align: center;
	  margin: 20rpx 0;
	}
	.jinganquWrapperCls {
	  background: #ffffff;
	  border-radius: 20rpx;
	  padding: 28rpx 0;
	  margin-bottom: 6rpx;
	  .itmes {
	    display: flex;
	    justify-content: space-between;
	    flex-wrap: wrap;
	    //一行4个
	    .item {
	      width: calc(100% / 4);
	      margin-bottom: 20rpx;
	      .item-img {
	        width: 100%;
	        height: 100%;
	        border-radius: 20rpx;
	      }
	    }
	  }
	  .row1 {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	  }
	  .row1 + .row1 {
	    margin-top: 47rpx;
	  }
	  .menuItemCls {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    min-width: 88rpx;
	    position: relative;
	    margin-top: 20rpx;
	    width: calc(100% / 4);
	    .menuTag {
	      position: absolute;
	      background: linear-gradient(90deg, #ff2401 0%, #fd5c5a 100%);
	      border-radius: 100rpx;
	      border: 2rpx solid #ffffff;
	      padding: 3rpx 10rpx;
	      right: -30rpx;
	      top: -14rpx;
	      font-size: 18rpx;
	      font-family: PingFangSC-Medium, PingFang SC;
	      font-weight: bold;
	      color: #ffffff;
	    }
	    .menuIconCls {
	      width: 78rpx;
	      height: 78rpx;
	      margin-bottom: 11rpx;
	    }
	    .menuTextCls {
	      font-size: 22rpx;
	      font-family: PingFangSC-Regular, PingFang SC;
	      font-weight: 400;
	      color: #000000;
	    }
	  }
	  .menuItemCls:nth-of-type(4n) {
	    margin-right: 0 !important;
	  }
	  .noMbCls {
	    margin-bottom: 0 !important;
	  }
	}
</style>