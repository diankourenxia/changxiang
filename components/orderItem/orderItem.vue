<template>
	<view @click="goProductDetail" class="itemWrapper">
		<view class="topItem">
			<text class="created-time">{{ orderObj.createTime }}</text>
			<text :class="{'status-cn': true, isRed: isStatusCnAlertColor}">{{ statusCn }}</text>
		</view>

		<!-- 中间位置 -->
		<view :class="{centerItem: true, noMarginBottom: !showBottomBtns()}">
			<image class="product-image" :src="orderObj.mainImageUrl"></image>
			<view class="right">
				<text class="top">
					<!-- 续租小标签 -->
					<text v-if="showXuzu" class="xzTag">续租</text>
					<text class="product-name">{{ orderObj.productName }}</text>
				</text>
				<text class="bottom">
					总租金
					<text class="price-cls">¥{{ orderObj.totalRent }}</text>
				</text>
			</view>
		</view>

		<!-- 底部按钮位置 -->
		<view v-if="showBottomBtns()" class="bottomBtns">
			<OrderActionBtns :orderVO="orderObj"></OrderActionBtns>
			<!-- <view class="orderActionBtns-wrapper">
				<view class="actionBtn butn1" @click.stop="payMoneyHandler">
					去支付
				</view>
				<view class="actionBtn butn1" @click.stop="payMoneyHandler">
					确认支付
				</view>
				<view class="actionBtn butn1">
					刷脸认证
				</view>
				<view class="actionBtn butn1">
					确认收货
				</view>
				<view class="actionBtn butn1">
					账单
				</view>
				<view class="actionBtn butn1">
					投诉
				</view>
				<view class="actionBtn butn1">
					再次下单
				</view>
				<view class="actionBtn">
					取消订单
				</view>
				<view class="actionBtn">
					修改认证
				</view>
				<view class="actionBtn">
					查看物流
				</view>
				<view class="actionBtn">
					申请修改
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	/**
	 *  单个订单的展示组件
	 *  父组件并不需要知道到底应该展示那个子按钮，在这里就把所有组件都堆上去，是否展示，取决于按钮组件内部的逻辑
	 *  如果父组件需要知道到底该显示哪些子按钮的话，那么在父组件就需要通过逻辑确定所需要显示的按钮列表，没必要把这部分逻辑放在父组件
	 *  把所有按钮都堆在这里的话，那么父组件就不需要考虑展示逻辑，通过按钮名字便可以轻松定位到具体应该修改哪个组件文件，然后便可以修改对应逻辑
	 */
	import {
		EMPTY_PLACEHOLDER,
		orderStatusNumber2Cn
	} from "../../utils/constant"
	import {
		checkOrderNeedPay,
		checkOrderNeedShouhuo,
		checkOrderOverdue,
		checkOrderSettle,
		checkOrderHasClose,
		getOrderId
	} from "./orderActionBtns/utils/checkShowBtn"
	import OrderActionBtns from "./orderActionBtns/orderActionBtns"

	export default {
		name: "orderItem",

		props: {
			orderObj: {
				type: Object,
				default: {},
			}, // 订单对象
		},

		data() {
			return {}
		},

		components: {
			OrderActionBtns,
		},

		computed: {
			/**
			 * 获取到状态的中文名称
			 */
			statusCn: function() {
				const isOrderYuQi = checkOrderOverdue(this.orderObj) // 判断订单是否已逾期
				if (isOrderYuQi) return "已逾期"
				const cn = orderStatusNumber2Cn[this.orderObj.status]
				return cn || EMPTY_PLACEHOLDER
			},

			/**
			 * 判断是否显示续租
			 */
			showXuzu: function() {
				return this.orderObj?.orderType == "03"
			},

			/**
			 * 判断状态是否是红色
			 */
			isStatusCnAlertColor: function() {
				return checkOrderNeedPay(this.orderObj) ||
					checkOrderNeedShouhuo(this.orderObj) ||
					checkOrderOverdue(this.orderObj) ||
					checkOrderSettle(this.orderObj)
			},
		},

		methods: {
			/**
			 * 判断是否需要显示底部按钮；除了已关闭和待审核的订单外，都要显示
			 */
			showBottomBtns() {
				return !checkOrderHasClose(this.orderObj)
			},

			/**
			 * 跳转到订单详情页面
			 */
			goProductDetail() {
				const orderId = getOrderId(this.orderObj)
				this.$onTo(`/pages/orderDetail/orderDetail?orderId=${orderId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.itemWrapper {
		padding: 40rpx 30rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.topItem {
		margin-bottom: 50rpx;
		display: flex;
		justify-content: space-between;

		.created-time {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
		}

		.status-cn {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}

		.isRed {
			color: #E52021;
		}
	}

	.centerItem {
		display: flex;
		align-items: flex-start;
		margin-bottom: 50rpx;

		.product-image {
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
		}

		.right {
			display: flex;
			flex-direction: column;

			.top {
				margin-bottom: 26rpx;
				font-size: 28rpx;
				min-height: 2.85em;
				max-height: 2.85em;
				overflow: hidden;
				text-overflow: ellipsis;

				.xzTag {
					@include global-background-color();
					border-radius: 15rpx 0rpx 15rpx 0rpx;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					padding: 2rpx 6rpx;
					margin-right: 10rpx;
				}

				.product-name {
					font-size: 28rpx;
					line-height: 44rpx;
					font-weight: 400;
					color: #333333;
					font-family: Arial;
				}
			}

			.bottom {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;

				.price-cls {
					margin-left: 4rpx;
					color: #333333;
				}
			}
		}
	}

	.noMarginBottom {
		margin-bottom: 0 !important;
	}


	.orderActionBtns-wrapper {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		// justify-content: flex-end;
		height: 56rpx;

		.actionBtn {
			width: 138rpx;
			height: 56rpx;
			border-radius: 30rpx;
			border: 1rpx solid #C0C0C0;
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			margin-left: 24rpx;
			flex-shrink: 0;
		}
		.butn1{
			background-color: #FFCB31;
			border: none;
		}
	}
</style>