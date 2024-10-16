<template>
	<view class="off">
		<view class="position">
			<image src="../../static/product/xjsp.png" mode="scaleToFill" class="position-img"></image>
			<view class="title">
				商品已下架
			</view>
			<view class="fu">
				去看看同类商品吧
			</view>
		</view>
		<view class="title-area">
			<view class="round round1"></view>
			<view class="round round2"></view>
			<view class="round round3"></view>
			<text class="title">同类商品推荐</text>
			<view class="round round4"></view>
			<view class="round round5"></view>
			<view class="round round6"></view>
		</view>
		<view class="productList">
			<view v-for="(obj, idx) in recommendLite" :key="idx" class="product-item">
				<productItem :productObj="obj" :showTag="true" :isWaterfallFlow="false">
					<XinjiuSlot slot="topLeft" :productObj="obj"></XinjiuSlot>
				</productItem>
			</view>
		</view>
	</view>
</template>

<script>
import ProductItem from "../../components/productItem/productItem.vue"
import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue"
export default {
  data() {
    return {
      recommendLite:[]
    }
  },
  onLoad(e) {
    this.productId = e.productId
    this.getRecommendLite()
  },
  components: {
    ProductItem,
    XinjiuSlot
  },
  methods:{
    getRecommendLite() {
      this.$request(
        "/hzsx/aliPay/product/recommendLite",
        { productId: this.productId },
        "get"
      ).then(res => {
        this.recommendLite = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.off{
.position{
	text-align: center;
	background-color: #FFFFFF;
	.position-img{
		width: 230rpx;
		height: 253rpx;
		margin-top: 73rpx;
	}
	.title{
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		margin-top: 46rpx;
	}
	.fu{
		font-size: 24rpx;
		font-weight: 400;
		color: #666666;
		margin-top: 10rpx;
		padding-bottom: 95rpx;
	}
}
.title-area {
	height: 90rpx;
	background: #f7f7f7;
	display: flex;
	align-items: center;
	justify-content: center;
	.round {
		border-radius: 50%;
		background: linear-gradient(180deg, #fbdc97 0%, #f69b24 100%);
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
	.round4 {
		margin-right: 10px;
	}
	.round6 {
		margin-right: 0;
	}
}
.productList {
		padding: 20rpx;
		column-count: 2;
		column-gap: calc(100% - 344rpx * 2);
		.product-item {
			width: 344rpx;
			break-inside: avoid; // 这个属性很重要，可以避免首位塌陷
		}
	}
}
</style>
