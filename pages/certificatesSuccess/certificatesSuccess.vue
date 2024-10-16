<template>
  <view class="container_cer_success">
    <view class="header">
      <image class="header-img" :src="data.avatar" />
      <view class="header-name">{{ data.name }}</view>
      <image
        class="header-icon"
        src="https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/certificate-success.png"
      />
      <view class="header-tips">您已完成认证，可前往挑选商品</view>
    </view>
    <view class="content">
      <view class="item">
        <view class="item-l">证件号</view>
        <view class="item-r">{{ idCard }}</view>
      </view>
      <view class="item">
        <view class="item-l">当前账号</view>
        <view class="item-r">{{
          data.telephone.substring(0, 3) +
          "****" +
          data.telephone.substring(8, 11)
        }}</view>
      </view>
    </view>
    <view class="btn" @click="$onTo('pages/classified/classified', true)"
      >挑选商品</view
    >
  </view>
</template>

<script>
import { getZWZUserDetail } from "@/utils/index.js"
export default {
  data() {
    return {
      data: getZWZUserDetail(),
      idCard: "",
    }
  },
  onLoad(e) {
    this.idCard = e.idCard
  },
}
</script>

<style lang="scss">
.container_cer_success {
  @include wh(100%, 100vh);
  .header {
    background: #fff;
    box-sizing: border-box;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
    border-radius: 0 0 20rpx 20rpx;
    .header-img {
      display: block;
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin: 0 auto 10rpx auto;
    }
    .header-name {
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 36rpx;
      color: #333333;
      letter-spacing: 0;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    .header-icon {
      display: block;
      width: 151rpx;
      height: 53rpx;
      margin: 0 auto 18rpx auto;
    }
    .header-tips {
      font-family: PingFangSC-Regular;
      font-size: 28rpx;
      color: #333333;
      font-weight: 400;
      text-align: center;
    }
  }
  .content {
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    .item {
      height: 100rpx;
      box-sizing: border-box;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-l,
      .item-r {
        font-family: PingFangSC-Regular;
        font-size: 28rpx;
        color: #333333;
        font-weight: 400;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 150rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 650rpx;
    height: 98rpx;
    @include global-background-color2();
    border-radius: 49rpx;
    font-size: 34rpx;
    text-align: center;
    line-height: 98rpx;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
