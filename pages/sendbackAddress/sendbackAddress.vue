<template>
<view class="page-container">
  <view class="title">选择归还地址</view>

  <!-- 地址列表数据 -->
  <view class="address-list">
    <view
      :class="{'address-item': true, 'last-address-item': idx === addressList.length - 1}"
      v-for="(addressObj, idx) in addressList"
      :key="idx"
      @click="selectAddressHandler(idx)"
    >
      <view class="check-wrapper">
        <view :class="{radio: true, activeRadio: activeIdx == idx}"></view>
      </view>

      <view class="right">
        <view class="top">
          <text class="mr28">{{ addressObj.name }}</text>
          <text>{{ addressObj.telephone }}</text>
        </view>

        <view class="bottom">
          {{ returnAddressStr(addressObj) }}
        </view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
// 归还地址的选择页面
import { selectAddressObjKey } from "../../utils/constant"
import { getAddressDescStr } from "../../utils/index"

export default {
  data() {
    return {
      addressList: [], // 归还地址列表数据
      activeIdx: 0, // 选中的地址索引
    }
  },

  onLoad(opt) {
    this.orderId = opt && opt.orderId // 订单ID
    this.aid = opt && opt.aid // 这个aid代表了当前所选中的aid
    if (this.$checkIsPageLessParameter(opt, ["orderId"])) return // 页面链接中缺少订单ID
    this.fetchDestinationHandler()
  },

  /**
   * 通知归还页面获取最新选中的地址
   * 不论用户点没点，没点也应该设置：1、只有一个那么默认选中的，那么必须点的话交互有问题；2、归还页面卸载后会清理存在全局的地址数据
   */
  onUnload() {
    const list = this.addressList || []
    if (!list || !list.length) return // 如果点击返回时，地址列表数据还未加载到的话，那么就算了 
    const addressObj = list[this.activeIdx] || {} // 选中的地址对象
    this.$setGlobalData(selectAddressObjKey, addressObj)
    this.$eventEmitter.emit("feedbackSelectAddress_ndsjk19")
  },

  methods: {
    /**
     * 加载归还地址列表数据
     */
    fetchDestinationHandler() {
      const postObj = { orderId: this.orderId }
      const cnMap = { orderId: "订单ID" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return // 表明缺少了订单ID
      return this.$request("hzsx/api/order/giveBack/queryOrderGiveBackAddress", postData, "POST").then(res => {
        const resData = res.data || []
        this.addressList = resData
        this.findActiveIdxByAid() // 找到当前选中地址的索引位置
      })
    },

    /**
     * 返回详细地址进行显示
     */
    returnAddressStr(addressObj) {
      return getAddressDescStr(addressObj)
    },

    /**
     * 选中地址的时候触发
     */
    selectAddressHandler(idx) {
      this.activeIdx = idx
      uni.navigateBack() // 回退到上一个页面
    },

    /**
     * 找出处于焦点的索引位置
     */
    findActiveIdxByAid() {
      if (!this.aid) return
      if (!this.addressList || !this.addressList.length) return
      const idx = this.addressList.findIndex(obj => obj.id == this.aid) // 找到处于焦点的索引
      this.activeIdx = idx
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  background:#F7F8FB;
  min-height: 100vh;
  box-sizing: border-box;
  .title {
    height: 98rpx;
    padding-left: 30rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .address-list {
    background: #FFFFFF;
    .address-item {
      display: flex;
      align-items: center;
      .check-wrapper {
        width: 92rpx;
        flex-shrink: 0;
        padding: 26rpx 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .radio {
          width: 16px;
          height: 16px;
          border: 1px solid #DDD;
          border-radius: 50%;
        }
        .activeRadio {
          position: relative;
          border: 1px solid #FFCB31;
        }
        .activeRadio::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FFCB31;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .right {
        padding: 30rpx 0;
        flex-grow: 1;
        border-bottom: 1rpx solid #F2F2F2;
        .top {
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 40rpx;
          margin-bottom: 11rpx;
          .mr28 {
            margin-right: 28rpx;
          }
        }
        .bottom {
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 33rpx;
        }
      }
    }
    .last-address-item {
      .right {
        border-bottom-style: none;
      }
    }
  }
}
</style>
