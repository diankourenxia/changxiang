<template>
<view class="wrapper">
  <image :src="productVO[imageKey]" class="product-image" />
  <view class="right">
    <view class="product-name">{{ $uiStr(productVO.productName) }}</view>
    <view class="product-sku">规格：{{ $uiStr(productVO.skuTitle) }}</view>
    <view class="bottom">
      <text class="name">{{ bottomTxt }}</text>
      <view>
        <text class="fuhao">¥</text>
        <text class="money">{{ $uiStr(money || productVO[moneyKey], "", "", true) }}</text>
      </view>
    </view>
  </view>
</view>
</template>

<script>
// 商品的简要展示组件，展示商品的主图、标题、所购买规格、某个价格
// 用在账单详情页面、买断页面、确认订单等页面
export default {
  name:"liteProductShow",

  data() {
    return {}
  },

  props: {
    productVO: {
      type: Object,
      default: {},
    }, // 商品的详情对象
    imageKey: {
      type: String,
      default: "mainImageUrl"
    }, // 商品主图的键名
    bottomTxt: {
      type: String,
      default: "总租金"
    }, // 底部左侧文案
    moneyKey: {
      type: String,
      default: "totalRent"
    }, // 金额取哪个字段
    money: {
      type: String,
      default: "",
    }, // 金额的值
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .product-image {
    width: 216rpx;
    height: 216rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }
  .right {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 190rpx;
    overflow: hidden;
    .product-name {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-bottom: 20rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .product-sku {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      margin-bottom: 24rpx;
      height: 60rpx;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        font-size: 24rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .money {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #E52021;
      }
      .fuhao {
        color: #E52021;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
}
</style>
