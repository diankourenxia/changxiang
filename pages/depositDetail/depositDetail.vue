<template>
<view class="depositDetailPage-Wrapper0615">
  <view v-if="list && list.length">
    <view
      v-for="(obj, idx) in list"
      :key="idx"
      class="list-item"
    >
      <view class="row">订单编号：{{ obj.orderId }}</view>
      <view class="row">订单时间：{{ obj.time }}</view>
      <view class="row">订单类型：{{ obj.type }}</view>
      <view class="row">充值金额：<text class="money-cls">{{ obj.money }}</text></view>
      <view @click="copy(obj)" class="btn">复制</view>
    </view>
  </view>
  <view v-else class="empty-text">暂无充值明细数据</view>
</view>
</template>

<script>
// 充值明细页面
export default {
  data() {
    return {
      list: [],
    }
  },

  onLoad() {
    this.fetchOrderListHandler()
  },

  methods: {
    /**
     * 获取充值明细列表
     */
    fetchOrderListHandler() {
      uni.showLoading({ title: "加载中" })
      this.$request("hzsx/api/order/queryDepositOrderList", {}, "GET", true).then(res => {
        const list = res?.data?.depositOrderDetailDtoList
        const resData = this.arrHandler(list)
        this.list = resData
      }).finally(() => {
        uni.hideLoading();
      })
    },

    /**
     * 对接口返回的数据进行处理
     */
    arrHandler(originData) {
      if (Object.prototype.toString.call(originData) !== "[object Array]") {
        return []
      }
      const newArr = []
      originData.forEach(obj => {
        if (obj.payTime) { // 是押金充值订单
          const item = { orderId: obj.orderId }
          item.time = obj.payTime
          item.type = "押金充值"
          item.money = `¥${obj.amount}`
          newArr.push(item)
        }
        if (obj.refundTime) { // 是押金提取订单
          const item = { orderId: obj.orderId }
          item.time = obj.refundTime
          item.type = "押金提取"
          item.money = `-¥${obj.amount}`
          newArr.push(item)
        }
      })
      return newArr
    },

    /**
     * 复制操作
     */
    copy(orderObj) {
      if (!orderObj) return;
      const { orderId } = orderObj
      uni.setClipboardData({
        data: orderId,
        success: function() {
          uni.showToast({ title: "复制成功" })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.depositDetailPage-Wrapper0615 {
  box-sizing: border-box;
  min-height: 100vh;
  background: #F3F4F4;
  padding: 20rpx;
  .empty-text {
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222;
    height: 500rpx;
    line-height: 500rpx;
    text-align: center;
  }
  .list-item {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    position: relative;
    .row+.row {
      margin-top: 30rpx;
    }
    .row {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 33rpx;
      max-width: calc(100% - 146rpx);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .money-cls {
        font-weight: bold;
      }
    }
    .btn {
      position: absolute;
      width: 106rpx;
      height: 52rpx;
      border-radius: 26rpx;
      border: 1rpx solid #979797;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      top: 20rpx;
      right: 30rpx;
    }
  }
  .list-item+.list-item {
    margin-top: 20rpx;
  }
}
</style>
