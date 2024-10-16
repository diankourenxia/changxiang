<template>
	<view
		:class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
		v-if="$orderModuleShowActionBtn(position)" @click.stop="clickHandler">
		取消订单
		<wyb-popup ref="productDetails" type="bottom" radius="6" title="取消原因" :titleStyle="titleStyle"
			:showCloseIcon="true">
			<view class="content-wrapper">
				<view class="content-container">
					<view class="why">请选择取消订单的原因：</view>
					<view class="reason-item" v-for="(reasonObj, idx) in reasonList" :key="idx"
						@click.stop="choseReasonHandler(reasonObj)">
						<image src="/static/orderList/inactive.png"
							:class="{checkIcon: true, hide: activeReasonStr == reasonObj.content}" />
						<image src="/static/orderList/active.png"
							:class="{checkIcon: true, hide: activeReasonStr != reasonObj.content}" />
						<text class="reasonContent">{{ reasonObj.content }}</text>
					</view>
					<view @click.stop="submitReasonHandler" :class="{btn: true, disabledBtn: !activeReasonStr}">提交
					</view>
				</view>
			</view>
		</wyb-popup>
	</view>
</template>

<script>
	// 取消订单按钮
	import {
		checkPosition,
		getOrderId,
		checkOrderNeedFahuo,
		notifyTopPageRefresh
	} from "../utils/checkShowBtn.js"
	import wybPopup from "@/components/wyb-popup/wyb-popup.vue"

	const DEFAULT_REASON = "" // 默认选中的取消原因

	const CANCEL_REASONS = [{
			id: 1,
			content: "商品价格较贵",
		},
		{
			id: 2,
			content: "等待时间较长",
		},
		{
			id: 3,
			content: "重新下单",
		},
		{
			id: 4,
			content: "想体验一下流程",
		},
		{
			id: 5,
			content: "不想要了",
		},
	]

	const CANCEL_REASONSJUJUE = [{
			id: 6,
			content: "审核原因而取消订单",
		},
		{
			id: 5,
			content: "不想要了",
		}
	]

	export default {
		name: "quxiaodindan",

		props: {
			order: {
				type: Object,
				default: {},
			}, // 订单对象
			isUsedInList: {
				type: Boolean,
				default: true,
			}, // 是否使用在订单列表页面
		},

		data() {
			return {
				reasonList: this.order?.status === '15' ? CANCEL_REASONSJUJUE : CANCEL_REASONS, // 取消原因列表
				activeReasonStr: DEFAULT_REASON, // 处于焦点状态的取消原因
				titleStyle: {
					"font-size": "0.32rem",
					"font-family": "PingFangSC-Medium, PingFang SC",
					"font-weight": "500",
					color: "#333",
				}
			}
		},

		components: {
			wybPopup,
		},

		computed: {
			position: function() {
				return checkPosition.quxiaodindan(this.order, this.isUsedInList)
			}
		},

		methods: {
			/**
			 * 选中取消原因的时候触发
			 */
			choseReasonHandler(reasonObj) {
				const {
					content
				} = reasonObj
				this.activeReasonStr = content
			},

			/**
			 * 点击订单的时候触发
			 */
			clickHandler() {
				//拿订单状态，当审核拒绝的时候，直接可取消订单
				const {
					status
				} = this.order;
				if (status === '15') {
					this.$refs.productDetails.show();
					return
				}

				// 拿订单创建时间和现在做比较，如果超过1个小时的话，那么弹窗提示请联系客服
				const {
					createTime
				} = this.order
				const check = 1 * 60 * 60 * 1000 // 1小时
				try {
					const createStamp = new Date(createTime).valueOf()
					const now = Date.now()
					if (now - createStamp > check) { // 已超过1小时
						uni.showModal({
							title: "提示",
							content: "已超时，请联系客服取消",
							showCancel: false,
						})
					} else { // 未超过小时，显示取消原因
						this.$refs.productDetails.show()
					}
				} catch (_) {
					this.$refs.productDetails.show()
				}
			},

			/**
			 * 提交拒绝原因
			 */
			submitReasonHandler() {
				if (!this.activeReasonStr) {
					uni.showToast({
						title: "请先选择取消订单原因"
					})
					return
				}

				// 已支付和未支付阶段的取消账单接口是不一样的，目前只有账单是待付款和待发货这两个状态才需要显示按钮
				const url = checkOrderNeedFahuo(this.order) ? "hzsx/api/order/payedCloseOrder" :
					"hzsx/api/order/userCancelOrder"

				const postObj = {
					cancelReason: this.activeReasonStr,
					orderId: getOrderId(this.order)
				}
				const cnMap = {
					cancelReason: "取消原因",
					orderId: "订单ID"
				}
				const {
					postData,
					pass
				} = this.$postDataGuard(postObj, cnMap)
				if (!pass) return // 数据校验失败

				this.$request(url, postData, "post").then(() => {
					uni.showToast({
						title: "操作成功"
					})
					// 接下来通知顶层页面进行刷新操作
					notifyTopPageRefresh.apply(this)
					this.closeHandler()
				})
			},

			/**
			 * 关闭弹窗
			 */
			closeHandler() {
				this.activeReasonStr = DEFAULT_REASON
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

	.content-wrapper {
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;

		.content-container {
			padding: 0 30rpx;

			.why {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 1.5em;
				margin-top: 30rpx;
			}

			.reason-item {
				display: flex;
				align-items: center;
				height: 42rpx;
				border-top: 30rpx solid transparent;

				.checkIcon {
					width: 42rpx;
					height: 42rpx;
					margin-right: 20rpx;
				}

				.hide {
					display: none;
				}

				.reasonContent {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}

			.btn {
				margin: 50rpx 0 70rpx 0;
				width: 100%;
				height: 80rpx;
				@include global-background-color();
				border-radius: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}

			// .disabledBtn {
			//   opacity: 0.5;
			// }
		}
	}
</style>