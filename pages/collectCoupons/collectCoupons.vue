<template>
  <view class="collectCoupons">
    <view class="tabs">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="item"
        @tap="onSelectCurrent(index, item.id)"
        :style="{
          
          fontWeight: selectCurrent === index ? 700 : 400,
          fontSize: selectCurrent === index ? '32rpx' : '28rpx',
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
          <view style="width: 200rpx" v-if="item.discountRate == null">
            <view class="title">
              <text style="font-size: 24rpx">￥</text>
              {{ item.discountAmount }}
            </view>
            <view class="fu">满{{ item.minAmount }}可用</view>
          </view>
		  <view style="width: 200rpx" v-else>
		    <view class="title">
				{{ item.discountRate }}
		      <text style="font-size: 24rpx">折</text>
		    </view>
		    <view class="fu">满{{ item.minAmount }}可用</view>
		  </view>
          <view class="item-content">
            <view class="title">{{ item.name }}</view>
            <view class="fu">
              <text class="b"></text>
              <text v-if="item.delayDayNum"
                >领取后{{ item.delayDayNum }}天有效</text
              >
              <text v-else>{{ item.time }}</text>
            </view>
            <view class="fu">
              <text class="b"></text>
              {{ rangeType[item.rangeStr] }}
            </view>
          </view>
        </view>

        <view class="item-right">
          <view class="bind" v-if="!item.isBind" @click="onBindCoupon(item.id)">
            立即领取
          </view>
          <view v-else class="bind" @click="onToUse(item.id)">去使用</view>
        </view>
      </view>
    </view>
    <view class="stateless" v-if="!list.length">
      <image
        src="../../static/product/noyhp.png"
        mode="scaleToFill"
        style="width: 230rpx; height: 268rpx"
      ></image>
      <view style="font-size: 28rpx; font-weight: 500; color: #333333">
        暂无优惠券
      </view>
    </view>
    <image
      v-if="isHasCouponPackage"
      src="../../static/coupons/jxlb2.png"
      mode="scaleToFill"
      class="jxlb"
      @click="$onTo('/pages/jxlb/jxlb')"
    ></image>
  </view>
</template>

<script>
import { getZWZUserDetail, formatStrDate } from "@/utils/index.js"
export default {
  data() {
    return {
      tabs: [
		{ name: "福利券", id: "FIRST_MONTH_FIXED_COUPON" },
        { name: "租赁券", id: "RENT" },
        // { name: "买断券", id: "BUY_OUT" },
		{ name: "优惠券", id: "BUY_OUT" },
		{ name: "折扣券", id: "DISCOUNT" },
      ],
      selectCurrent: 0,
      list: [],
      rangeType: {
        ALL: "全部商品可用",
        CATEGORY: "部分类目可用",
        PRODUCT: "部分指定商品可用",
        SHOP:"指定店铺可用"
      },
      isHasCouponPackage: false,
	  tabId:"FIRST_MONTH_FIXED_COUPON"//tab切换的id
    }
  },
  onLoad() {
    this.getCouponList()
  },
  methods: {
    onSelectCurrent(index, id) {
      this.selectCurrent = index;
	  this.tabId = id;
      this.getCouponList(id)
    },
    //获取券列表
    getCouponList() {
		const id = this.tabId;
      this.$request(
        "/hzsx/lite/couponCenter/index",
        { scene: id },
        "get",
        true
      ).then((res) => {
        for (let i = 0; i < res.data.couponList.length; i++) {
          if (res.data.couponList[i].startTime) {
            let startTime = formatStrDate(
              res.data.couponList[i].startTime || "",
              "MM.dd"
            )
            let endTime = formatStrDate(
              res.data.couponList[i].endTime || "",
              "MM.dd"
            )
            res.data.couponList[i].time = `${startTime}-${endTime} 有效`
          }
        }
        this.list = res.data.couponList
        this.isHasCouponPackage = res.data.hasCouponPackage
      })
    },
    //领取优惠券
    onBindCoupon(templateId) {
      this.$request(
        "/hzsx/lite/couponCenter/bindCoupon",
        {
          templateId,
          phone: getZWZUserDetail().telephone,
          uid: this.$getUid(),
        },
        "post"
      ).then((res) => {
        uni.showToast({ title: res.data })
        this.getCouponList()
      })
    },
    onToUse(id) {
      this.$onTo(`/pages/availableGoods/availableGoods?id=${id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.collectCoupons {
  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 30rpx;
    .item {
		width: 25%;
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
	  text-align: center;

      .select {
        width: 42rpx;
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
        .title {
          font-size: 62rpx;
          font-weight: 500;
          color: #ff4a26;
        }
        .fu {
          font-size: 22rpx;
          font-weight: 400;
          color: #ff4a26;
        }
      }

      .item-content {
        margin-left: 47rpx;
        text-align: left;
        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
          margin-bottom: 10rpx;
        }
        .fu {
          font-size: 22rpx;
          font-weight: 400;
          color: #999999;
          display: flex;
          align-items: center;

          .b {
            display: inline-block;
            margin-right: 10rpx;
            width: 6rpx;
            height: 6rpx;
            background: #999999;
            border-radius: 50%;
          }
        }
      }
      .item-right {
        .bind {
          width: 130rpx;
          height: 52rpx;
          border-radius: 26rpx;
          border: 1px solid #ff4a26;
          text-align: center;
          line-height: 52rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #ff4a26;
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
