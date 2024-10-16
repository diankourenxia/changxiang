<template>
	<view class="historyCoupon">
		<view class="tabs">
			<view
				v-for="(item, index) in tabs"
				:key="index"
				class="item"
				@tap="onSelectCurrent(index, item.id)"
				:style="{
					marginRight: index === 0 ? '291rpx' : 0,
					fontWeight: selectCurrent === index ? 700 : 400,
					fontSize: selectCurrent === index ? '32rpx' : '28rpx'
				}"
			>
				{{ item.name }}
				<view class="select" v-if="selectCurrent === index"></view>
				<view class="select" style="visibility: hidden" v-else></view>
			</view>
		</view>
		<view class="coupons">
			<view class="coupon-item" v-for="(item, index) in list" :key="index">
				<view class="item-left">
					<view style="width: 130rpx;">
						<view class="title">
							<text style="font-size: 24rpx">￥</text>
							{{ item.discountAmount }}
						</view>
						<view class="fu">满{{ item.minAmount }}可用</view>
					</view>
					<view class="item-content">
						<view class="title">{{ item.title }}</view>
						<view class="fu">
							<text class="b"></text>
							{{ item.time }}
						</view>
						<view class="fu">
							<text class="b"></text>
							{{ rangeType[item.rangeStr] }}
						</view>
					</view>
				</view>

				<view class="item-right">
					<image
						v-if="selectCurrent === 0"
						class="bind"
						src="../../static/coupons/ysy.png"
						mode="scaleToFill"
					></image>
					<image
						v-else
						class="bind"
						src="../../static/coupons/ygq.png"
						mode="scaleToFill"
					></image>
				</view>
			</view>
		</view>
		<view class="stateless" v-if="!list.length">
			<image
				src="../../static/product/noyhp.png"
				mode="scaleToFill"
				style="width: 230rpx;height: 268rpx;"
			></image>
			<view
				style="font-size: 28rpx;font-weight: 500;
				color: #333333;"
			>
				暂无优惠券
			</view>
		</view>
	</view>
</template>

<script>
import { getZWZUserDetail,formatStrDate } from "@/utils/index.js"
export default {
  data() {
    return {
      tabs: [{ name: "已使用", id: "Used" }, { name: "已过期", id: "Expire" }],
      selectCurrent: 0,
      list: [],
      rangeType: {
        ALL: "全部商品可用",
        CATEGORY: "部分类目可用",
		PRODUCT: "部分指定商品可用",
		SHOP:"指定店铺可用"
      }
    }
  },
  onLoad() {
    this.getCouponList()
  },
  methods: {
    onSelectCurrent(index, id) {
      this.selectCurrent = index
      this.getCouponList(id)
    },
    //获取券列表
    getCouponList(id = "Used") {
      this.$request(`/hzsx/lite/couponCenter/my${id}`, {}, "get", true,true).then(res => {
        for (let i = 0; i < res.data.length; i++) {
		  let startTime = formatStrDate(res.data[i].startTime||"","MM.dd")
          let endTime = formatStrDate(res.data[i].endTime||"","MM.dd")
          res.data[i].time = `${startTime}-${endTime} 有效`
        }
        this.list = res.data
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.historyCoupon {
	.tabs {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 30rpx;
		.item {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			.select {
				width: 60rpx;
				height: 6rpx;
				@include global-background-color2();
				border-radius: 3rpx;
				margin: 0 auto;
				margin-top: 10rpx;
			}
		}
	}
	.coupons {
		max-height: 1250rpx;
		overflow: auto;
		padding-bottom: 30rpx;
		.coupon-item {
			width: 650rpx;
			height: 170rpx;
			background: #ffffff;
			border-radius: 10rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item-left {
				text-align: center;
				display: flex;
				color: #979aaa;
				.title {
					font-size: 62rpx;
					font-weight: 500;
				}
				.fu {
					font-size: 22rpx;
					font-weight: 400;
				}
			}
			.item-content {
				margin-left: 47rpx;
				text-align: left;
				color: #979aaa;
				.title {
					font-size: 28rpx;
					font-weight: 500;

					margin-bottom: 10rpx;
				}
				.fu {
					font-size: 22rpx;
					font-weight: 400;

					display: flex;
					align-items: center;

					.b {
						display: inline-block;
						margin-right: 10rpx;
						width: 4rpx;
						height: 6rpx;
						background: #979aaa;
						border-radius: 50%;
					}
				}
			}
			.item-right {
				.bind {
					width: 113rpx;
					height: 95rpx;
				}
			}
		}
	}
	.stateless {
		text-align: center;
		padding-top: 300rpx;
	}
	.jxlb {
		width: 114rpx;
		height: 112rpx;
		position: fixed;
		right: 0;
		bottom: 200rpx;
	}
}
</style>
