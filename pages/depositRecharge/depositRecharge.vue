<template>
<view class="depositDetailPage-container1033">
  <view class="top-tip">订单结束后，客户无违约且无未完结的结算单，可申请原路退回租赁押金。押金不能抵扣租金，请按月及时交租</view>

  <view class="operation">
    <text class="text1">可提现金额(元)</text>
    <text class="money">{{ apiRes && apiRes.withdrawAble }}</text>
    <text class="money2">押金总额：<text class="bold">{{ apiRes && apiRes.totalDeposit }}</text></text>
    <view v-if="checkIsShowTotalTiaxianBtn()" @click="tixianAllHandler" class="btn">提现</view>
    <text @click="goDetail" class="text2">充值明细</text>
  </view>

  <view class="order-wrapper">
    <view v-if="checkHasBillList()">
      <view
        v-for="orderObj in apiRes.orderList"
        class="order-item"
        :key="orderObj.orderId"
      >
        <view class="top">
          下单时间：{{ orderObj.createTime }}
        </view>
        <view class="center">
          <image :src="orderObj.productImgSrc" class="left" />
          <view class="right">
            <view class="c-top">{{ orderObj.productName }}</view>
            <view class="c-center">已支付押金：¥{{ orderObj.paidDeposit }}</view>
            <view class="c-bottom">待支付押金：¥{{ orderObj.unPaidDeposit }}</view>
          </view>
        </view>
        <view v-if="checkShowBottomArea(orderObj)" class="bottom">
          <view
            v-if="checkIsSingleOrderShowTixian(orderObj)"
            @click="clickSingleOrderTixianBtnHandler(orderObj)"
            class="btn btn1"
          >
            提现
          </view>
          <view
            v-if="checkIsShowSingleOrderQuZhifu(orderObj)"
            @click="quzhifuHandler(orderObj)"
            class="btn btn2"
          >
            去支付
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-text">暂无需要支付押金的订单</view>
  </view>

  <!-- 弹窗部分 -->
  <view v-if="showDialog" class="dialog-wrapper">
    <view class="mask" />
    <view class="content-wrapper">
      <image @click="closeDialogHandler" src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/index/dialogClose1025.png" class="closeImg" />
      <text class="top-text">{{ returnDialogTopText() }}</text>
      <view v-if="checkCanTixian()">
        <text class="contentip1-0">提交后，押金将在1个工作日内原路</text>
        <text class="contentip1-1">退回至您的账户，请注意查收</text>
      </view>
      <view v-else>
        <text class="contentip1">若有疑问，请电话联系客服</text>
        <text class="contentip2">客服工作时间：工作日 10:00-18:00</text>
      </view>
      <view @click="dialogOkHandler" class="submit-btn">{{ returnBtnText() }}</view>
    </view>
  </view>
</view>
</template>

<script>
import { tradePay } from "../../utils/platform"
const defaultApiRes = {
  totalDeposit: 0, // 总押金
  withdrawAble: 0, // 可提取的押金
  orderList: [], // 订单列表
}

export default {
  data() {
    return {
      apiRes: defaultApiRes,
      showDialog: false,
      activeOrderObj: {}, // 处于焦点的订单对象
      zhifuFetching: false, // 支付中
      isTixianAll: false, // 是否提现所有
      customerPhone: "", // 平台客服的联系方式
    }
  },

  onLoad(e) {
    this.fetchOrderListHandler()
    this.fetchCustomerPhone()
  },

  /**
   * 监听页面的下拉刷新操作
   */
  onPullDownRefresh() {
    this.fetchOrderListHandler(true)
  },

  methods: {
    /**
     * 加载账单列表数据
     * @param {Boolean} isRefresh : 是否使用在刷新的场景中
     */
    fetchOrderListHandler(isRefresh) {
      uni.showLoading({ title: "加载中" })
      this.$request("hzsx/api/order/depositOrderList", {}, "get", true).then(res => {
        const resData = res.data
        this.apiRes = resData || defaultApiRes
      }).finally(() => {
        uni.hideLoading()
        isRefresh && uni.stopPullDownRefresh()
      })
    },

    /**
     * 加载客服联系方式
     */
    fetchCustomerPhone() {
      this.$request(`hzsx/api/sysConfig/getSysConfigByKey?configKey=CONSUMER_HOTLINE`, {}, "get").then(res => {
        const resData = res.data
        const { sysConfigValue } = resData
        this.customerPhone = sysConfigValue
      })
    },

    /**
     * 判断是否显示顶部的提现按钮（提现所有）
     */
    checkIsShowTotalTiaxianBtn() {
      return this.apiRes?.withdrawAble > 0 // 小于等于0时，不显示总提现按钮
    },

    /**
     * 判断是否有订单列表数据
     */
    checkHasBillList() {
      return this.apiRes?.orderList?.length 
    },

    /**
     * 判读单个订单是否显示提现按钮
     * @param {*} oObj : 单个订单对象
     */
    checkIsSingleOrderShowTixian(oObj) {
      return oObj?.paidDeposit > 0 // 已支付押金大于0才显示
    },

    /**
     * 判断单个订单是否显示去支付按钮
     * @param {*} oObj : 单个订单对象
     */
    checkIsShowSingleOrderQuZhifu(oObj) {
      return oObj?.unPaidDeposit > 0 // 有待支付的押金时才显示该按钮
    },

    /**
     * 判断是否显示订单模块的底部按钮区域
     * @param {*} orderObj : 单个订单对象
     */
    checkShowBottomArea(orderObj) {
      return this.checkIsSingleOrderShowTixian(orderObj) || this.checkIsShowSingleOrderQuZhifu(orderObj)
    },

    /**
     * 判断是否可进行提现操作，如果是提现单个订单的话，那么得这个订单的状态达到一定条件才能提现；如果是提现所有的话，那么点击了则代表可以提现
     */
    checkCanTixian() {
      if (this.isTixianAll) { // 表明是提现所有，那么只要点击了提现按钮的话，则表示可以进行提现操作。否则走下面提现当个订单的判断
        return true
      }
      const { orderStatus } = this.activeOrderObj || {}
      if (!orderStatus) return false // 不存在此字段的话，默认不可进行提现操作
      const hits = ["09", "10"] // 如果订单状态是这些值的话，那么才可提现。https://www.yuque.com/ktbs5p/yft9p7/uau1y2
      return hits.includes(orderStatus)
    },

    /**
     * 返回按钮文案
     */
    returnBtnText() {
      return this.checkCanTixian() ? "确认提现" : `客服电话：${this.customerPhone}`
    },

    /**
     * 关闭弹窗
     */
    closeDialogHandler() {
      this.activeOrderObj = {}
      this.showDialog = false
      this.isTixianAll = false
    },

    /**
     * 弹窗点击确定
     */
    dialogOkHandler() {
      if (this.checkCanTixian()) { // 可提现时，点击按钮是进行提现操作
        const { orderId }  = this.activeOrderObj || {}
        this.tixianHandler(orderId)
      } else { // 不可提现时，点击按钮是拨打电话
        my.makePhoneCall({ number: this.customerPhone })
      }
    },

    /**
     * 提现所有订单，此时也得显示弹窗
     */
    tixianAllHandler() {
      this.showDialog = true
      this.isTixianAll = true
    },

    /**
     * 点击单个订单的提现按钮时触发
     */
    clickSingleOrderTixianBtnHandler(oObj) {
      if (!oObj) return
      this.activeOrderObj = oObj
      this.showDialog = true
    },

    /**
     * 返回弹窗的顶部文案
     */
    returnDialogTopText() {
      if (this.checkCanTixian()) { // 账单可提现时的弹窗顶部文案
        let money = 0
        if (this.isTixianAll) { // 提现所有
          money = this.apiRes?.withdrawAble
        } else {
          const obj = this.activeOrderObj || {}
          money = obj.paidDeposit || 0
        }
        return `即将提现${money}，请确认`
      } else { // 账单不可提现时的弹窗顶部文案
        return "您的订单未完结，暂不能提现"
      }
    },

    /**
    * 支付当个订单的时候触发
    * @param {*} oObj : 订单对象
    */
    quzhifuHandler(oObj) {
      if (this.zhifuFetching) return
      const { orderId } = oObj
      this.zhifuFetching = true
      uni.showLoading({ title: "支付中" })

      const failedToast = () => {
        this.zhifuFetching = false
        uni.hideLoading()
        uni.showToast({ title: "支付失败" })
      }

      this.$request(`hzsx/orderPayDeposit/getPayInfo?orderId=${orderId}`, {}, "get").then(res => {
        this.zhifuFetching = false
        const resData = res.data
        if (!resData || !resData.payUrl) {
          uni.hideLoading()
          uni.showToast({ title: "缺少付款流水号，请重试" })
          return
        }
        tradePay(resData.payUrl, true).then(res => {
          if (res.resultCode === "9000") { // 表明支付成功
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({ title: "支付成功" })
              this.fetchOrderListHandler()
            }, 2500) // 增加延时，避免后端接受支付宝回调不及时
          } else {
            failedToast()
          }
        }).catch(() => {
          failedToast()
        })
      }).catch(() => {
        failedToast()
      })
    },

    /**
     * 进行提现操作时调用，即用于单笔提现，也用于总金额提现
     * @param {String} orderId : 单笔提现时所传入的订单ID
     */
    tixianHandler(orderId) {
      if (this.tixianing) return
      this.tixianing = true

      let url = "hzsx/orderPayDeposit/withdraw"
      orderId && (url += `?orderId=${orderId}`)
      uni.showLoading({ title: "提现中" })

      this.$request(url, {}, "get", true).then(res => {
        uni.hideLoading()
        this.tixianing = false
        const resData = res.data
        if (resData) {
          this.closeDialogHandler()
          this.fetchOrderListHandler() // 提现成功之后进行数据拉取
          uni.showToast({ title: "提现成功" })
        } else {
          uni.showToast({ title: "提现失败" })
        }
      }).catch(() => {
        uni.hideLoading()
        this.tixianing = false
        uni.showToast({ title: "提现失败" })
      })
    },

    /**
     * 跳转到充值明细页面
     */
    goDetail() {
      this.$onTo("/pages/depositDetail/depositDetail")
    }
  }
}
</script>

<style lang="scss" scoped>
.depositDetailPage-container1033 {
  min-height: 100vh;
  background: #F3F4F4;
  box-sizing: border-box;
  padding: 20rpx;
  padding-bottom: 140rpx;
  .top-tip {
    background: #FFF9E3;
    border-radius: 20rpx;
    padding: 17rpx 20rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #986828;
    line-height: 33rpx;
    margin-bottom: 30rpx;
  }
  .operation {
    width: 710rpx;
    height: 297rpx;
    position: relative;
    background-image: url("https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/depositRecharge/bg.png");
    background-size: 710rpx 297rpx;
    background-repeat: no-repeat;
    margin-bottom: 50rpx;
    .text1 {
      position: absolute;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      top: 50rpx;
      left: 43rpx;
    }
    .money {
      position: absolute;
      font-size: 70rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 98rpx;
      left: 43rpx;
      top: 90rpx;
    }
    .money2 {
      position: absolute;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      bottom: 28rpx;
      left: 43rpx;
      .bold {
        font-weight: 600;
      }
    }
    .btn {
      position: absolute;
      width: 150rpx;
      height: 60rpx;
      background: #FFFFFF;
      box-shadow: 0 5rpx 10rpx 0 rgba(243, 11, 18, 0.5);
      border-radius: 49rpx;
      top: 109rpx;
      right: 32rpx;
      text-align: center;
      line-height: 60rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #F53223;
    }
    .text2 {
      position: absolute;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      bottom: 8rpx;
      right: 32rpx;
      padding: 20rpx;
    }
  }
  .order-wrapper {
    .order-item + .order-item {
      margin-top: 20rpx;
    }
    .order-item {
      background: #FFFFFF;
      border-radius: 20rpx;
      box-sizing: border-box;
      padding: 0 30rpx;
      .top {
        height: 70rpx;
        display: flex;
        align-items: center;
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .center {
        padding: 30rpx 0;
        border-top: 1rpx solid #F5F6F6;  
        border-bottom: 1rpx solid #F5F6F6;
        display: flex;
        align-items: center;
        .left {
          width: 150rpx;
          height: 150rpx;
          margin-right: 30rpx;
        }
        .right {
          .c-top {
            font-size: 24rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #222222;
            margin-bottom: 30rpx;
            line-height: 33rpx;
          }
          .c-center, .c-bottom {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 33rpx;
          }
          .c-center {
            margin-bottom: 10rpx;
          }
        }
      }
      .bottom {
        height: 94rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 24rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 138rpx;
          height: 56rpx;
          border-radius: 30rpx;
        }
        .btn1 {
          background: #FFFFFF;
          color: #333333;
          border: 1rpx solid #C0C0C0;
        }
        .btn2 {
          background: linear-gradient(90deg, #FD5C5A 0%, #FF2401 100%);
          color: #FFFFFF;
        }
        .btn+.btn {
          margin-left: 20rpx;
        }
      }
    }
  }
  .dialog-wrapper {
    .mask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 3;
    }
    .content-wrapper {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600rpx;
      height: 406rpx;
      background: #FFFFFF;
      border-radius: 20rpx;
      z-index: 4;
      .top-text {
        position: absolute;
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        top: 87rpx;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .contentip1, .contentip2, .contentip1-0, .contentip1-1 {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606370;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .contentip1, .contentip1-0 {
        top: 172rpx;
      }
      .contentip2, .contentip1-1 {
        top: 210rpx;
      }
      .contentip1-0, .contentip1-1 {
        left: 115rpx;
        transform: translateX(0);
      }
      .submit-btn {
        width: 498rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #FD5C5A 0%, #FF2401 100%);
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 39rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
      }
    }
  }
  .empty-text {
    text-align: center;
    margin-top: 119rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
  }
  .closeImg {
    width: 21rpx;
    height: 21rpx;
    border: 20rpx solid transparent;
    position: absolute;
    top: 10rpx;
    right: 10rpx;
  }
}
</style>
