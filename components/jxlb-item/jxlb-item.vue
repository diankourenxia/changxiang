<template>
	<view class="jxlb">
		<uni-swiper-dot
			:info="item.couponList2"
			:current="current"
			mode="round"
			backgroundColor="#fff"
		>
			<view class="item">
				<view style="height: 30rpx"></view>
				<view class="title">{{ item.packageName }}</view>
				<swiper class="coupons" @change="onCoupons" :current="current">
					<swiper-item
						v-for="(itemCoupon, indexCoupon) in item.couponList2"
						:key="indexCoupon"
						class="coupons-item"
					>
						<view
							class="coupons-item-img"
							v-for="(itemCouponImg, indexCouponImg) in itemCoupon.list"
							:key="indexCouponImg"
						>
							<view style="font-size: 22rpx; font-weight: 500; margin-top: 25rpx">
								{{ itemCouponImg.name }}
							</view>
							<view style="font-size: 56rpx; font-weight: bold">
								<text style="font-size: 28rpx; font-weight: 600">￥</text>
								{{ itemCouponImg.discountAmount }}
							</view>
							<view style="font-size: 22rpx; font-weight: 500">
								满{{ itemCouponImg.minAmount }}元可用
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</uni-swiper-dot>
		<view class="anyes" v-if="item.isBind" @tap="$onTo('/pages/classified/classified', true)">
			已领取，去使用
		</view>
		<view class="anno" v-else @click="onReceive(item.id)">立即领取</view>
	</view>
</template>

<script>
import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
import { getZWZUserDetail } from "@/utils/index.js"
export default {
  name: "jxlb-item",
  data() {
    return {
      current: 0
    }
  },
  components: {
    uniSwiperDot
  },
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  methods: {
    onCoupons(e) {
      this.current = e.detail.current
    },
    onReceive(e) {
      this.$request(
        "/hzsx/lite/couponCenter/bindCouponPackage",
        { packageId: e, phone: getZWZUserDetail().telephone, uid: this.$getUid() },
        "post"
      ).then(res => {
        this.$parent.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.jxlb {
	width: 610rpx;
	background: linear-gradient(360deg, #fef6e1 0%, #feefc2 100%);
	border-radius: 20rpx;
	margin: 0 auto;
	margin-top: 30rpx;
	padding: 20rpx 40rpx;
	.item {
		.title {
			font-size: 46rpx;
			font-weight: 600;
			color: #333333;
			text-align: center;
			margin-bottom: 30rpx;
		}
		.coupons {
			width: 610rpx;
			height: 450rpx !important;
			.coupons-item {
				width: 610rpx;
				height: 400rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.coupons-item-img {
					background-image: url('../../static/coupons/yhqk.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
					width: 289rpx;
					height: 177rpx;
					color: #ffffff;
					text-align: center;
				}
			}
		}
	}
	.anno {
		width: 610rpx;
		height: 90rpx;
		border-radius: 45rpx;
		border: 2rpx solid #f79e38;
		margin-top: 40rpx;
		font-size: 38rpx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		line-height: 90rpx;
	}
	.anyes {
		width: 610rpx;
		height: 90rpx;
        @include global-background-color();
		border-radius: 45rpx;
		@include global-border(2rpx);
		font-size: 38rpx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		line-height: 90rpx;
	}
}
</style>
