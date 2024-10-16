<template>
<view class="cyclePaymentOrderList-wrapper">
  <view class="topHeader">
    <view class="left">
      <view class="top">信用租赁</view>
      <view class="bottom">守约记录</view>
    </view>
    <view class="right">
      <view>签约租金周期扣款协议,</view>
      <view>可避免逾期交租</view>
    </view>
  </view>

  <view class="tab-wrapper">
    <view
      v-for="(tabObj, idx) in tabList"
      :key="idx"
      @click="changeActiveTabHandler(idx)"
      :class="{'tab-item': true, 'active-tab-item': idx == activeTabIdx}"
    >
      {{ tabObj.name }}
    </view>
  </view>

  <view class="product-list-wrapper">
    <template v-if="showOrderList && showOrderList.length">
      <view
        v-for="orderObj in showOrderList"
        :key="orderObj.orderId"
        class="product-item"
      >
        <view class="top2">
          <view class="time">下单时间：{{ orderObj.createTime }}</view>
          <view :class="{'status-cls': true, 'red': checkOrderDaiQianYue(orderObj)}">{{ getStatusCn(orderObj.signStatus) }}</view>
        </view>

        <view class="center">
          <image :src="orderObj.productImage" class="product-image" />
          <view class="right2">
            <view class="product-name-cls">{{ orderObj.productName }}</view>
            <view class="money-cls">月租金：¥{{ orderObj.monthRent }}</view>
          </view>
        </view>

        <view class="footer">
          <view class="flexg" />
          <view @click="clickPlanHandler(orderObj)" class="btn btn1">查询交租计划</view>
          <view v-if="checkOrderDaiQianYue(orderObj)" @click="signCyclePaymentHandler(orderObj)" class="btn btn2">去签约</view>
        </view>
      </view>
    </template>

    <view v-else class="empty-text">
      {{ getEmptyText() }}
    </view>
  </view>

  <view v-if="showModal" class="modal-wrapper">
    <view class="mask" />
    <view class="content-wrapper">
      <view class="title">交租计划</view>
      <view class="desc">{{ activeOrderObj && activeOrderObj.productName }}</view>
      <image @click="closeModalHandler" class="close-img" src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/cyclePaymentOrderPage/%E5%85%B3%E9%97%AD%402x%20%281%29.png" />
      <view class="scroll-area">
        <template v-if="planList && planList.length">
          <view
            v-for="planObj in planList"
            :key="planObj.id"
            class="plan-item"
          >
            <view class="period-cls">第{{ planObj.currentPeriods }}期</view>
            <view class="period-money-cls">¥{{ planObj.currentPeriodsRent }}</view>
            <view class="period-bottom-cls">{{ planObj.statementDate }}</view>
          </view>
        </template>
        <view v-else class="empty-plan">暂无交租计划数据</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
// 周期扣款页面
const initOrderListObj = {
  UNSIGN: [], // 待签约
  NORMAL: [], // 守约中
  FINISH: [], // 已完成
} // 初始化的订单列表数据，包括tab的三者类型

export default {
  data() {
    return {
      tabList: [
        { name: "待签约", value: "UNSIGN" },
        { name: "守约中", value: "NORMAL" },
        { name: "已完成", value: "FINISH" }
      ], // 菜单列表数据
      activeTabIdx: 0, // 处于焦点的菜单索引
      orderListObj: initOrderListObj, // 订单列表接口返回的数据
      planList: [], // 还款计划列表数据
      activeOrderObj: {}, // 处于焦点的订单对象
      showModal: false, // 是否显示弹窗
      orderPlanMap: {}, // 缓存订单所对应的还款计划map，键名是订单号，值是数组
    }
  },

  computed: {
    showOrderList: function() {
      return this.getOrderList()
    }
  },

  onLoad() {
    this.fetchListHandler()
  },

  methods: {
    /**
     * 判断订单待签约
     * @param {*} oObj : 订单对象
     */
    checkOrderDaiQianYue(oObj) {
      if (Object.prototype.toString(oObj) !== "[object Object]") return false
      return oObj.signStatus === "UNSIGN"
    },

    /**
     * 改变焦点栏
     * @param {Number} idx : 点击的tab索引
     */
    changeActiveTabHandler(idx) {
      this.activeTabIdx = idx
    },

    /**
     * 根据处于焦点的菜单索引找到菜单的接口值定义
     */
    findActiveTabValByIdx() {
      const obj = this.tabList[this.activeTabIdx] || {}
      return obj.value
    },

    /**
     * 加载列表数据
     */
    fetchListHandler() {
      this.$request(
        "hzsx/userCyclePay/getSignOrder",
        {},
        "GET",
        true,
        true,
      ).then(res => {
        this.orderListObj = res?.data || initOrderListObj
      })
    },

    /**
     * 点击交租计划的时候触发
     * @param {Object} oObj : 订单对象
     */
    clickPlanHandler(oObj) {
      const { orderId } = oObj || {}
      if (!orderId) return

      const cb = v => {
        this.activeOrderObj = oObj
        this.showModal = true
        this.planList = v || []
      }

      // 看看缓存中是否存在
      const cacheVal = this.orderPlanMap[orderId]
      if (cacheVal && Object.prototype.toString.call(cacheVal) === "[object Array]") { // 存在缓存值
        cb(cacheVal)
        return
      }

      this.$request(
        `hzsx/api/orderByStages/queryOrderByStagesByOrderId?orderId=${orderId}`,
        {},
        "GET",
        false,
        true,
      ).then(res => {
        const resData = res?.data || [] // 交租计划列表数据
        this.orderPlanMap[orderId] = resData // 缓存起来，避免每次点击都进行请求
        cb(resData)
      }).catch(() => {
        cb()
      })
    },

    /**
     * 签署周期扣款的方法
     * @params {Object} oObj : 订单对象
     */
    signCyclePaymentHandler(oObj) {
      const { orderId } = oObj || {}
      if (!orderId) return

      this.$request(
        `hzsx/userCyclePay/getSignUrl?orderId=${orderId}`,
        {},
        "GET",
        true,
        true,
      ).then(res => {
        const link = res?.data // 签约链接
        if (!link) {
          uni.showToast({ title: "未返回签约链接", icon: "none", duration: 2000 })
          return
        }
        const str = encodeURIComponent(link) // 根据支付宝文档先对链接进行encode转码
        // #ifdef MP-ALIPAY
        // 抖音小程序没这个功能，就不迁移到platform了
        my.paySignCenter({
          signStr: str,
          success: res => {
            const { resultStatus } = res
            const blackList = ["7002", "6001", "6002"] // 如果是这些状态码的话，即表示签约失败https://opendocs.alipay.com/mini/006v6d
            if (!resultStatus || blackList.includes(resultStatus)) { // 不存在状态，或者是失败状态
              uni.showToast({ title: "签约失败", icon: "none" })
            } else {
              uni.showLoading({ title: "查询状态中" })
              setTimeout(() => {
                uni.hideLoading()
                uni.showToast({ title: "签约成功", icon: "success" }) // 签约成功后重新拉取一下数据
                this.fetchListHandler()
              }, 2000) // 加入延时，避免后端接受支付宝回调不及时
            }
          },
          fail: () => {
            uni.showToast({ title: "调用paySignCenter失败", icon: "none" })
          }
        })
        // #endif
      })
    },

    // 隐藏弹窗
    closeModalHandler() {
      this.showModal = false
    },

    /**
     * 获取需要显示的订单列表数据
     * @returns Array
     */
    getOrderList() {
      const status = this.findActiveTabValByIdx() // 当前处于焦点的订单状态
      const obj = this.orderListObj
      if (!status || !obj) return []
      return obj[status] || []
    },

    /**
     * 返回状态中文
     * @param {string} statusEn : 状态英文
     */
    getStatusCn(statusEn) {
      const placeholder = "——"
      if (!statusEn) return placeholder
      const obj = this.tabList.find(obj => obj.value === statusEn) || {}
      return obj.name || placeholder
    },

    /**
     * 返回空白时的文案
     * @returns string
     */
    getEmptyText() {
      const statusEn = this.findActiveTabValByIdx()
      return `暂无${this.getStatusCn(statusEn)}订单`
    },
  }
}
</script>

<style lang="scss" scoped>
.cyclePaymentOrderList-wrapper {
  min-height: 100vh;
  background: #F3F4F4;
  .topHeader {
    background: #fff;
    padding: 50rpx 54rpx;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .left {
      font-size: 48rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 67rpx;
    }
    .right {
      width: 365rpx;
      height: 99rpx;
      background: linear-gradient(90deg, #FFF1AB 0%, #FCF5DE 100%);
      border-radius: 57rpx;
      box-sizing: border-box;
      padding: 0 34rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #C78C1F;
      line-height: 40rpx;
    }
  }
  .tab-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 66rpx;
    padding-bottom: 16rpx;
    background: #fff;
    box-shadow: 0 5rpx 10rpx 0 rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 2;
    .tab-item {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding: 0 30rpx;
    }
    .active-tab-item {
      position: relative;
      &::after {
        content: "";
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAAAMCAMAAADBGAZ+AAAAdVBMVEUAAAD////+W1j/JQL+XFn+XFn/XFn/JgT/Rjb/JgT/JQH/JgP/JAP/KQn/LQ//MBT/Mxr/OyX+QC7/JgT/Nh7+QzL/Pir/OCH+UUn+SDr+Wlf+VVD+ST3+RTX+WFX+TkT+TEL+Sz/+VE3+Rjf+V1L+UEb+U0s/bmWKAAAADXRSTlMAAfPzyL1lZRnIyL299+J2ewAAAX1JREFUOMuNlQt2wiAURIn/WitGW2tRozFp9r/EAoE3HDKN3hXcM/MGlFLFYjYxpnK0lrPjYem67uT49dwsd0dd1xfPj6dprs3V8RXY9xwDZeDb8xnYCTqyjXyAg2P6tiyUZTU3VtNEz1Y8xfRkNeHpSDw98NxHestj1OSiOvGEqKgerKnnfWXznBtHFD33+EARqZjCMxG9egaimWpPnqhmiYJDYFOohRHRtkqbR6DwpKa0eVQ/Jqphuk2Ap7BUs+iJG5XyIQpT8byg+TxQiJbcE6aABiqs1SSISvetaKZjcprZjWJMMMWWgik/0l0vqvmYkkRFdRpER1aPRO+3bPW40ZEx0UjJiQKW6DRWb/5tHjcqnkmkzfiNjovqNFDNPEV1jTENAn3Q7nGjmP2rY4InYImSNS3xPGH1qD7bEhJ9dfUlF0X1RJSNaVO4Bx+rd55tJsrfUVQPU3qj8OSmT8aEBz98oZUZ/EzZjWL2l5o++MwUoiXdElt96okv9A/4hrFgfkPRJgAAAABJRU5ErkJggg==");
        background-size: cover;
        position: absolute;
        width: 84rpx;
        left: 50%;
        transform: translateX(-50%);
        height: 6rpx;
        bottom: -16rpx;
      }
    }
  }
  .product-list-wrapper {
    padding: 20rpx;
    padding-bottom: 60rpx;
    background: #F3F4F4;
    .product-item {
      padding: 0 30rpx;
      background: #FFFFFF;
      border-radius: 20rpx;
      .top2 {
        height: 69rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        .time {
          color: #999;
        }
        .status-cls {
          color: #999;
        }
        .red {
          color: #FF2401;
        }
      }
      .center {
        border-top: 1rpx solid #F5F6F6;
        border-bottom: 1rpx solid #F5F6F6;
        padding: 30rpx 0;
        display: flex;
        align-items: flex-start;
        .product-image {
          width: 150rpx;
          height: 150rpx;
          border-radius: 10rpx;
          margin-right: 30rpx;
          flex-shrink: 0;
        }
        .right2 {
          .product-name-cls {
            font-size: 24rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            line-height: 1.5em;
            color: #222222;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-all;
            margin-bottom: 28rpx;
          }
          .money-cls {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }
        }
      }
      .footer {
        height: 93rpx;
        display: flex;
        align-items: center;
        .flexg {
          flex-grow: 1;
        }
        .btn {
          height: 56rpx;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
        .btn1 {
          width: 180rpx;
          border: 1rpx solid #C0C0C0;
          color: #333333;
        }
        .btn2 {
          width: 138rpx;
          background: linear-gradient(90deg, #FD5C5A 0%, #FF2401 100%);
          color: #fff;
        }
        .btn+.btn {
          margin-left: 20rpx;
        }
      }
    }
    .product-item+.product-item {
      margin-top: 20rpx;
    }
  }
  .modal-wrapper {
    .mask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    .content-wrapper {
      position: fixed;
      z-index: 11;
      background: #FBFBFA;
      border-radius: 20rpx 20rpx 1rpx 1rpx;
      left: 0;
      right: 0;
      height: 799rpx;
      bottom: 0;
    }
    .title {
      font-size: 42rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 59rpx;
      position: absolute;
      top: 60rpx;
      left: 40rpx;
    }
    .desc {
      width: 670rpx;
      position: absolute;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9A9CAA;
      top: 129rpx;
      left: 40rpx;
    }
    .close-img {
      position: absolute;
      top: 0;
      right: 0;
      width: 30rpx;
      height: 30rpx;
      border: 30rpx solid transparent;
    }
    .scroll-area {
      height: 490rpx;
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      bottom: 86rpx;
      overflow-y: auto;
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .plan-item {
        background: #fff;
        width: calc((100vw - 100rpx) / 2);
        height: 150rpx;
        background: #FFFFFF;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;
        .period-cls {
          font-size: 24rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 33rpx;
        }
        .period-money-cls {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 40rpx;
          margin-bottom: 3rpx;
        }
        .period-bottom-cls {
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 30rpx;
        }
      }
      .plan-item:nth-of-type(2n) {
        margin-left: 20rpx;
      }
    }
  }
  .empty-text {
    text-align: center;
    margin-top: 300rpx;
  }
  .empty-plan {
    text-align: center;
    margin-top: 50rpx;
  }
}
</style>
