<template>
	<view class="content">
		<!-- 黄色-最右边 -->
		<view class="btn yellowBtn" v-if="orderVO.status == '01'">
			去支付
		</view>
		<!-- 白色-右边排列 -->
		<view class="btn" v-if="orderVO.status == '01'||orderVO.status == '11'||orderVO.status == '04'">
			修改地址
		</view>
		<view class="btn" v-if="orderVO.status == '11'&&orderVO.isEqb == '0'||orderVO.status == '01'">
			签署协议
		</view>
		<view class="btn" v-if="orderVO.status == '11'||orderVO.status == '04'||orderVO.status == '05'||orderVO.status == '06'||orderVO.status == '12'||orderVO.status == '07'||orderVO.status == '08'||orderVO.status == '01'">
			投诉
		</view>
	</view>
</template>

<script>
	export default {
		name: "orderBtns",

		props: {
			orderVO: {
				type: Object,
				default: {},
			}, // 订单对象
			isUsedInList: {
				type: Boolean,
				default: true,
			}, // 是否使用在订单列表页面，除了订单列表页面外还能使用在订单详情页面
			productVo: {
				type: Object,
				default: null,
			}, // 商品的建模对象，可不传。不传的场景：orderVO对象里面已经包含了商品描述数据，比如说使用在订单列表时，就不需要传；如果orderVO里面有商品定义数据的话，那么就需要传入该数据
			userOrderCashDto: {
				type: Object,
				default: null,
			}, // 在商品详情页面使用的话需要传入
		},

		data() {
			return {
				
			}
		},
		mounted(){
			console.log("orderVO",this.orderVO);
			console.log("isUsedInList",this.isUsedInList);
			console.log("productVo",this.productVo);
			console.log("userOrderCashDto",this.userOrderCashDto);
		},
		computed: {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	view {
		box-sizing: border-box;
	}

	.content {
		width: 100vw;
		height: 100rpx;
		position: fixed;
		z-index: 16;
		background: #FFCB31;
		bottom: 30rpx;
		left: 0;
		right: 0;
		background: #fff;
		padding: 0 20rpx;
		border-top: 1rpx solid #dcdcdc;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		.btn {
			width: 138rpx;
			height: 56rpx;
			border-radius: 30rpx;
			border: 1rpx solid #C0C0C0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #666666;
			margin-left: 24rpx;
			font-weight: 400;
		}
		.yellowBtn {
			background: #FFCB31;
			color: #333333;
			border: none;
		}
	}
</style>