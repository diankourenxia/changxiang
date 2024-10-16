<template>
	<view @click.stop="clickBtnHandler"
		:class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
		v-if="$orderModuleShowActionBtn(position)">续租
		<view v-if="showModal">
			<view @click.stop class="bg"></view>
			<view class="content-wrapper">
				<image @click.stop="showModal = false" src="/static/orderList/close.png" class="close-img" />

				<view class="top-container">
					<image class="product-img" :src="returnProductDescObj().mainImageUrl" />
					<view class="right">
						<text class="title1">{{ returnProductDescObj().productName }}</text>
						<text class="sku">规格:{{ returnProductDescObj().skuTitle }}</text>
						<text class="totalMoney">
							总租金
							<text class="mo">¥{{ returnZongzujin() }}</text>
						</text>
					</view>
				</view>

				<view class="title">租期</view>

				<!-- 租期天数列表数据 -->
				<view class="period-list">
					<view @click.stop="() => activePeriodIdx = idx"
						:class="{'period-item': true, 'active-period-item': activePeriodIdx === idx}"
						v-for="(periodObj, idx) in returnPeriodList()" :key="idx">
						{{ periodObj.days }}天
					</view>
				</view>

				<view @click.stop="goXuZuHandler" class="submitBtn">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 续租按钮
	import {
		checkPosition,
		getOrderId
	} from "../utils/checkShowBtn"

	export default {
		name: "xuzu",

		props: {
			order: {
				type: Object,
				default: {},
			}, // 订单对象
			isUsedInList: {
				type: Boolean,
				default: true,
			}, // 是否使用在订单列表页面
			product: {
				type: Object,
				default: null,
			}, // 商品对象
		},

		data() {
			return {
				showModal: false, // 表示是否展示续租弹窗
				secondApiParams: {}, // orderRelet/userOrderReletPage接口所返回的数据，有续租租期数据以及用户第二个接口的数据
				activePeriodIdx: 0, // 处于焦点的租期索引
			}
		},

		computed: {
			position: function() {
				return checkPosition.xuzu(this.order, this.isUsedInList)
			}
		},

		methods: {
			/**
			 * 点击按钮时，加载续租天数数据
			 */
			clickBtnHandler() {
				const postObj = {
					orderId: getOrderId(this.order)
				}
				const cnMap = {
					orderId: "订单ID"
				}
				const {
					postData,
					pass
				} = this.$postDataGuard(postObj, cnMap)
				if (!pass) return
				this.$request("hzsx/api/orderRelet/userOrderReletPage", postData, "POST", false, true).then(res => {
					const resData = res.data
					this.secondApiParams = resData
					this.showModal = true
				})
			},

			/**
			 * 返回商品的描述对象
			 */
			returnProductDescObj() {
				return this.product || this.order || {}
			},

			/**
			 * 返回总租金对象
			 */
			returnZongzujin() {
				const zuQiList = this.secondApiParams?.reletCyclePricesDtoList || []
				const azqo = zuQiList[this.activePeriodIdx] || {}
				return azqo.totalPrice
			},

			/**
			 * 获取续租列表数据
			 */
			returnPeriodList() {
				const productObj = this.secondApiParams || {}
				return productObj.reletCyclePricesDtoList || []
			},

			/**
			 * 点击续租的提交按钮
			 */
			goXuZuHandler() {
				const obj1 = this.secondApiParams || {}
				const cycleObj = this.returnPeriodList()[this.activePeriodIdx] || {} // 所选中的租期对象
				const postObj = {
					skuId: obj1.skuId,
					price: cycleObj.price,
					originalOrderId: obj1.originalOrderId,
					uid: this.$getUid(),
					duration: cycleObj.days,
				}
				const cnMap = {
					skuId: "SKU",
					price: "价格",
					originalOrderId: "原订单ID",
					uid: "用户ID",
					duration: "租期"
				}
				const {
					postData,
					pass
				} = this.$postDataGuard(postObj, cnMap)
				if (!pass) return
				this.$request("hzsx/api/orderRelet/userOrderReletConfirm", postData, "POST", false, true).then(res => {
					const resData = res.data
					const pid = this.order?.productId || this.product?.productId // 产品ID
					this.$setGlobalData("productIdForXieyi", pid)
					this.$setGlobalData("xuzuProductDetail", resData)
					this.$onTo("/pages/confirm/confirm?isXuzu=1", false,
						true) // 跳转到商品确认页面，同时携带上续租标志，使用replace跳转，避免续租成功付款之后又跳转到了订单列表页面，那么此时将会有两个订单列表页面
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.actionBtn {
		width: 138rpx;
		height: 56rpx;
		border-radius: 30rpx;
		border: 1px solid #C0C0C0; // 1rpx 在高分辨率设备上可能会遇到显示不出来的问题，所以这里改成1px
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-left: 24rpx;
		flex-shrink: 0;
		position: absolute;
	}

	.actionBtn0 {
		@include global-background-color2();
		color: #ffffff;
		border: none;
		right: 0;
	}

	.actionBtn1 {
		right: 162rpx;
	}

	.actionBtn2 {
		right: 324rpx;
	}

	.actionBtn3 {
		right: 486rpx;
	}

	.bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}

	.content-wrapper {
		width: 750rpx;
		height: 767rpx; // +30rpx
		background: #FFFFFF;
		border-radius: 20rpx 20rpx 1rpx 1rpx;
		padding-top: 30rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 200;

		.top-container {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			margin-bottom: 30rpx;

			.product-img {
				width: 165rpx;
				height: 165rpx;
				margin-right: 30rpx;
				flex-shrink: 0;
			}

			.right {
				display: flex;
				flex-direction: column;
				overflow: hidden;
				text-align: left;

				.title1 {
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
					line-height: 40rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 10rpx;
					padding-right: 30rpx;
				}

				.sku {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 33rpx;
					margin-bottom: 21rpx;
				}

				.totalMoney {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;

					.mo {
						margin-left: 6rpx;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
					}
				}
			}
		}

		.title {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			line-height: 40rpx;
			margin-bottom: 20rpx;
			padding-left: 30rpx;
		}

		.period-list {
			padding: 0 30rpx;
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			max-height: 320rpx;
			overflow-y: auto;

			.period-item {
				width: 100rpx;
				height: 60rpx;
				border-radius: 10rpx;
				background: #F2F2F2;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border: 2rpx solid transparent;
			}

			.active-period-item {
				border: 2rpx solid #F8A11F;
				background: #FFFBF1;
			}
		}

		.submitBtn {
			position: absolute;
			height: 98rpx;
			left: 0;
			right: 0;
			bottom: 30rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFCB31;
		}

		.close-img {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			top: 16rpx;
			right: 16rpx;
		}

	}
</style>