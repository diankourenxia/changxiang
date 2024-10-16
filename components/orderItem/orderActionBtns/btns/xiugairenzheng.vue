<template>
	<view
		:class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3, actionBtn3: position == 4 }"
		v-if="$orderModuleShowActionBtn(position)" @click.stop="clickHandler">
		修改认证
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
	export default {
		name: "xiugairenzheng",

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
			return {}
		},

		components: {},

		computed: {
			position: function() {
				return checkPosition.xiugairenzheng(this.order, this.isUsedInList)
			}
		},

		methods: {
			/**
			 * 点击订单的时候触发
			 */
			clickHandler() {
				this.$onTo((`pages/certificates/certificates?class=2`))
			},
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
				margin-top: 50rpx;
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