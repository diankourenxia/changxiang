<template>
  <view class="coupon">
    <view class="tabs">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="item"
        @tap="onSelectCurrent(index, item.id)"
        :style="{
          marginRight: index === 0 ? '291rpx' : 0,
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
          <view style="width: 130rpx">
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
          <view class="bind" @click="onToUse(item.templateId)">立即使用</view>
        </view>
      </view>
    </view>
    <view class="stateless" v-if="!list.length">
      <image
        src="../../static/product/noyhp.png"
        mode="scaleToFill"
        style="width: 230rpx; height: 268rpx"
      ></image>
      <view style="font-size: 28rpx; font-weight: 500; color: #333333;margin-top:46rpx">
        暂无优惠券
      </view>
      <view class="an" @click="$onTo('pages/collectCoupons/collectCoupons')">
        去领券
      </view>
    </view>
    <view class="footer">
      <view @click="$onTo('/pages/historyCoupon/historyCoupon')"
        >历史优惠券</view
      >
      <view class="divider"></view>
      <view @click="$onTo('/pages/collectCoupons/collectCoupons')"
        >去领券中心</view
      >
    </view>
  </view>
</template>

<script>
import { getZWZUserDetail, formatStrDate } from "@/utils/index.js"

export default {
  data() {
    return {
      tabs: [
        { name: "租赁券", id: "RENT" },
        // { name: "买断券", id: "BUY_OUT" },
		{ name: "优惠券", id: "BUY_OUT" },
      ],
      selectCurrent: 0,
      list: [],
      rangeType: {
        ALL: "全部商品可用",
        CATEGORY: "部分类目可用",
        PRODUCT: "部分指定商品可用",
        SHOP:"指定店铺可用"
      },
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
    getCouponList(id = "RENT") {
      this.$request(
        "/hzsx/lite/couponCenter/my",
        { scene: id },
        "get",
        true
      ).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          let startTime = formatStrDate(res.data[i].startTime || "", "MM.dd")
          let endTime = formatStrDate(res.data[i].endTime || "", "MM.dd")
          res.data[i].time = `${startTime}-${endTime} 有效`
        }
        this.list = res.data
      })
    },
    //跳转可用商品页
    onToUse(id) {
      this.$onTo(`/pages/availableGoods/availableGoods?id=${id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.coupon {
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
            width: 4rpx;
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
    padding-top: 260rpx;
    .an {
      width: 138rpx;
      height: 56rpx;
      line-height: 56rpx;
      @include global-background-color2();
      border-radius: 43rpx;
      text-align: center;
      font-size: 24rpx;
      font-weight: 400;
      color: #fff;
      margin: 0 auto;
      margin-top: 30rpx;
    }
  }
  .jxlb {
    width: 114rpx;
    height: 112rpx;
    position: fixed;
    right: 0;
    bottom: 200rpx;
  }
  .footer {
    width: 100%;
    height: 98rpx;
    background: #ffffff;
    box-shadow: 0px -6rpx 10rpx 0px rgba(186, 202, 251, 0.15);
    position: fixed;
    bottom: 0;
    font-size: 28rpx;
    font-weight: 500;
    color: #606370;
    display: flex;
    justify-content: center;
    align-items: center;
    .divider {
      width: 1px;
      height: 28rpx;
      background-color: #dedede;
      margin: 0 117rpx;
    }
  }
}
</style>
