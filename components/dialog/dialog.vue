<template>
<view>
  <view class="mask" @click.stop="$emit('cancel')"></view>
  <view class="dialog-wrapper">
    <view class="content-wrapper">
      {{ content }}
    </view>
    <view class="footer">
      <view class="btn" @click.stop="$emit('cancel')">{{ cancelText }}</view>
      <view class="btn" @click.stop="$emit('ok')">{{ okText }}</view>
    </view>
  </view>
</view>
</template>

<script>
/**
 * 弹窗组件
 */
export default {
  name: "dialog",

  data() {
    return {}
  },

  props: {
    content: {
      type: String,
      default: "",
    }, // 弹窗提示内容
    cancelText: {
      type: String,
      default: "取消",
    }, // 取消按钮的文案
    okText: {
      type: String,
      default: "确定",
    }, // 确定按钮的文案
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 10000000;
}
.dialog-wrapper {
  position: fixed;
  z-index: 10000001;
  width: 600rpx;
  height: 375rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 296rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 60rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 45rpx;
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    height: 80rpx;
    display: flex;
    .btn {
      width: 50%;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .btn:first-child {
      background: #1F2129;
      color: #fff;
      border-radius: 0 0 0 20rpx;
    }
    .btn:last-child {
      @include global-background-color();
      color: #333;
      border-radius: 0 0 20rpx 0;
    }
  }
}
</style>
