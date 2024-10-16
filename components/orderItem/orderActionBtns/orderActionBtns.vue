<template>
	<view class="orderActionBtns-wrapper">
		<!-- 省略号部分开始 -->
		<view v-if="checkShowMore()" class="more" @click.stop="showPopup = !showPopup">
			<view class="dot"></view>
			<view class="dot"></view>
			<view class="dot"></view>
			<view class="bottomLine" />
			<!-- 弹出来的按钮部分 -->
			<view v-if="showPopup"
				:class="{popoverBtnWrapper: true, singlePopupBtnWrapper: checkIsSingleCls(), doublePopupBtnWrapper: checkIsDoubleCls()}">
				<Tousu :isUsedInList="isUsedInList" :isUsedInMore="true" :order="orderVO" :product="productVo"></Tousu>
				<!-- 投诉按钮 -->
				<ChaKanWuliu :isUsedInList="isUsedInList" :isUsedInMore="true" :order="orderVO" :product="productVo">
				</ChaKanWuliu> <!-- 查看物流按钮 -->
			</view>
			<!-- 弹出来的按钮结束 -->
		</view>
		<!-- 省略号结束 -->

		


		<!-- 按钮开始，摆放顺序随意，显示顺序取决于在utils文件的js定义 -->

		<Qianshu :isUsedInList="isUsedInList" :order="orderVO" :product="productVo" :orderDeatil="orderDeatil">
		</Qianshu>
		<Daikouhetong :isUsedInList="isUsedInList" :order="orderVO" :product="productVo" :orderDeatil="orderDeatil">
		</Daikouhetong>
		<Tousu :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Tousu> <!-- 投诉按钮 -->
		<Xuzu :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Xuzu> <!-- 续租按钮 -->
		<ChaKanWuliu :isUsedInList="isUsedInList" :order="orderVO" :product="productVo" :orderDeatil="orderDeatil"></ChaKanWuliu> <!-- 查看物流按钮 -->
		<Zhangdan :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Zhangdan> <!-- 账单按钮 -->
		<Maiduan :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Maiduan> <!-- 买断按钮 -->
		<Quxiaodindan :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Quxiaodindan> <!-- 取消订单按钮 -->
		<Xiugaidizhi :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Xiugaidizhi> <!-- 修改地址按钮 -->
		<Querenshouhuo :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Querenshouhuo>
		<!-- 确认收货按钮 -->
		<GuiHuanBtn :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></GuiHuanBtn> <!-- 归还按钮 -->
		<Quzhifu :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"
			:userOrderCashDto="userOrderCashDto"></Quzhifu> <!-- 去支付按钮 -->
		<Xiugairenzheng :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Xiugairenzheng>
		<!-- 修改认证按钮 -->
		<Qianshuxieyi :isUsedInList="isUsedInList" :order="orderVO" :product="productVo" :userOrderCashDto="userOrderCashDto"></Qianshuxieyi> <!-- 签署协议按钮 -->
		<Shualianrenzheng :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Shualianrenzheng>
		<!-- 刷脸认证按钮 -->
		<Zaicixiadan :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Zaicixiadan> <!-- 再次下单按钮 -->
		<Shenqingxiugai :isUsedInList="isUsedInList" :order="orderVO" :product="productVo"></Shenqingxiugai>
		<!-- 申请修改按钮 -->
		<!-- 按钮结束 -->
	</view>
</template>

<script>
	// 订单模块的操作按钮集合，即使用在订单列表页面，也使用在订单详情页面

	import ChaKanWuliu from "./btns/chakanwuliu.vue"
	import GuiHuanBtn from "./btns/guihuan.vue"
	import Maiduan from "./btns/maiduan.vue"
	import Querenshouhuo from "./btns/querenshouhuo.vue"
	import Quxiaodindan from "./btns/quxiaodindan.vue"
	import Quzhifu from "./btns/quzhifu.vue"
	import Tousu from "./btns/tousu.vue"
	import Xiugaidizhi from "./btns/xiugaidizhi.vue"
	import Xuzu from "./btns/xuzu.vue"
	import Zhangdan from "./btns/zhangdan.vue"
	import Shualianrenzheng from "./btns/shualianrenzheng.vue"
	import Zaicixiadan from "./btns/zaicixiadan.vue"
	import Shenqingxiugai from "./btns/shenqingxiugai.vue"
	import Qianshu from "./btns/qianshu.vue"
	import Daikouhetong from "./btns/daikouhetong.vue"
	import Xiugairenzheng from "./btns/xiugairenzheng.vue"
	import Qianshuxieyi from "./btns/qianshuxieyi.vue"
	import {
		checkOrderRenting,
		checkOrderOverdue,
		checkPosition,
		checkIsEqb
	} from "./utils/checkShowBtn" // 判断订单租用中、订单已逾期

	export default {
		name: "orderActionBtns",

		data() {
			return {
				showPopup: false, // 是否显示弹出的菜单
			}
		},

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

		mounted() {
			const hideCb = () => {
				this.showPopup = false
			}
			this.eventId = this.$eventEmitter.subscribe("hidePopup", hideCb) // 订阅隐藏省略号弹窗的事件
		},

		beforeDestroy() {
			this.eventId && this.$eventEmitter.removeHandler("hidePopup", this.eventId)
		},

		components: {
			ChaKanWuliu,
			GuiHuanBtn,
			Maiduan,
			Querenshouhuo,
			Quxiaodindan,
			Quzhifu,
			Tousu,
			Xiugaidizhi,
			Xuzu,
			Zhangdan,
			Shualianrenzheng,
			Zaicixiadan,
			Shenqingxiugai,
			Qianshu,
			Daikouhetong,
			Xiugairenzheng,
			Qianshuxieyi
		},

		computed: {
			/**
			 * 订单租用中
			 */
			orderRenting: function() {
				return checkOrderRenting(this.orderVO, this.isUsedInList)
			},
			/**
			 * 订单已逾期
			 */
			orderOverdue: function() {
				return checkOrderOverdue(this.orderVO, this.isUsedInList)
			},
			/**
			 * 订单需要签署协议
			 */
			orderIsEsb: function() {
				return checkIsEqb(this.orderVO, this.isUsedInList)
			}
		},

		methods: {
			/**
			 * 省略号中只有当个按钮时
			 */
			checkIsSingleCls: function() {
				if (!this.isUsedInList && this.orderOverdue) {
					if (checkPosition.guihuan(this.orderVO, this.isUsedInList) != undefined && checkPosition.maiduan(
							this.orderVO, this.isUsedInList) != undefined) return true // 归还和买断都显示了，才会大于5个
					return false
				}
				if (this.isUsedInList && this.orderRenting) { // 订单列表页面，且租用中状态
					let base = 2
					if (checkPosition.xuzu(this.orderVO) != undefined) base++ // 续租展示了
					if (checkPosition.maiduan(this.orderVO) != undefined) base++ // 买断展示了
					if (checkPosition.guihuan(this.orderVO) != undefined) base++ // 归还展示了
					return base > 4
				}
			},
			

			/**
			 * 省略号中有多个按钮时
			 */
			checkIsDoubleCls: function() {
			  if (!this.isUsedInList) { // 使用在详情页面才有可能显示省略号
			    if (this.orderRenting) { // 且得是租用中才有可能
			      const arr = [checkPosition.xuzu(this.orderVO), checkPosition.maiduan(this.orderVO), checkPosition.guihuan(this.orderVO)]
			      return arr.every(n => n != undefined)
			    } else {
			      return false
			    }
			  }
			  return false
			},
			
			/**
			 * 判断是否显示省略号
			 */
			checkShowMore: function() {
			  return this.checkIsSingleCls() || this.checkIsDoubleCls()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.orderActionBtns-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		height: 56rpx;

		/deep/ .actionBtn {
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

		/deep/ .actionBtn0 {
			@include global-background-color2();
			// color: #333333;
			color: #FFFFFF;
			border: none;
			right: 0;
		}

		/deep/ .actionBtn1 {
			right: 162rpx;
		}

		/deep/ .actionBtn2 {
			right: 324rpx;
		}

		/deep/ .actionBtn3 {
			right: 486rpx;
		}

		.more {
			position: absolute;
			left: 0;
			height: 56rpx;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			align-items: center;
			width: 38rpx;
			justify-content: space-between;
			z-index: 90;

			.dot {
				width: 6rpx;
				height: 6rpx;
				border-radius: 50%;
				background: #333333;
			}

			.bottomLine {
				width: 52rpx;
				height: 8rpx;
				@include global-background-color();
				border-radius: 4rpx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 20rpx;
				z-index: -1;
			}

			.popoverBtnWrapper {
				position: absolute;
				width: 140rpx;
				box-shadow: 24rpx;
				background: #fff;
				z-index: 92;
				left: -8rpx;
				border-radius: 4rpx;
				box-shadow: 0 3rpx 6rpx -4rpx rgba(0, 0, 0, 0.12), 0 6rpx 16rpx 0 rgba(0, 0, 0, 0.08), 0 9rpx 28rpx 8rpx rgba(0, 0, 0, 0.05);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				&::after {
					content: "";
					width: 10rpx;
					height: 10rpx;
					transform: rotate(45deg);
					position: absolute;
					left: 21rpx;
					bottom: -5rpx;
					background: #fff;
					z-index: 90;
				}

				/deep/ .actionBtn {
					border: none;
					width: 100%;
					border-radius: 0;
					text-align: center;
					margin-left: 0;
					position: static !important;
				}
			}

			.singlePopupBtnWrapper {
				height: 50rpx;
				top: -36rpx;
			}

			.doublePopupBtnWrapper {
				height: 112rpx;
				top: -112rpx;
			}
		}
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