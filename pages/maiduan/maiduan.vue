<template>
<view class="page-container">
  <view class="product-container">
    <!-- <LiteProductShow
      :productVO="productObj"
      imageKey="images"
      bottomTxt="当前买断尾款"
      moneyKey="endFund"
    ></LiteProductShow> -->
	<LiteProductShow
	  :productVO="productObj"
	  imageKey="images"
	  bottomTxt="当前尾款"
	  moneyKey="endFund"
	></LiteProductShow>
  </view>

  <!-- 优惠券展示模块 -->
  <view @click="showYouhuiPickerHandler" class="youhuiquan-container">
    <text class="text">优惠券</text>
    <text class="flexg" />
    <text class="quan-amount" v-if="checkChosedYouhuiQuan().checked">{{ -checkChosedYouhuiQuan().amount }}</text> <!-- 选中了优惠券的话，那么显示减免金额 -->
    <view v-else> <!-- 未选中的话，那么显示有多少优惠券可选 -->
      <text :class="{'quan-amount': true, noQuan: !returnYouhuiQuanNums() }">{{ returnYouhuiQuanNums() ? `${returnYouhuiQuanNums()}张可用` : "暂无优惠券可选" }}</text>
      <image src="/static/complain/back.png" class="back-icon" />
    </view>
  </view>

  <!-- 账单元数据信息展示模块 -->
  <view class="billMeta-container">
    <view class="row">
      <!-- <text class="key">到期买断尾款</text> -->
	  <text class="key">到期尾款</text>
      <text class="val">{{ productObj.dueBuyOutAmount ? `¥${productObj.dueBuyOutAmount}`  : "-" }}</text>
    </view>

    <view class="row">
      <text class="key">总租金</text>
      <text class="val">{{ productObj.totalRent ? `¥${productObj.totalRent}` : "-" }}</text>
    </view>

    <view class="row">
      <text class="key">已付租金</text>
      <text class="val">{{ productObj.paid ? `¥${productObj.paid}` : "-" }}</text>
    </view>
  </view>

  <!-- 底部结算 -->
  <BottomBtn>
    <view class="btnWrapper" slot="ele">
      <view class="left">
        <text class="t1">总计:</text>
        <text class="t2">¥</text>
        <text class="t3">{{ getXiaoshuAndZongshu().before }}</text>
        <text class="t4" v-if="getXiaoshuAndZongshu().show">.</text>
        <text class="t5">{{ getXiaoshuAndZongshu().after }}</text>
      </view>
      <!-- <view @click="maiduanHandler" class="right">确定买断</view> -->
	  <view @click="maiduanHandler" class="right">确定下单</view>
    </view>
  </BottomBtn>

  <!-- 优惠券选择模块 -->
  <wyb-popup
    ref="couponList"
    type="bottom"
    width="500"
    radius="6"
    :showCloseIcon="true"
    title="可用优惠券"
    bgColor="rgba(247, 248, 251, 1)"
  >
    <view class="coupons">
      <!-- 具有优惠券时的显示效果 -->
      <template v-if="returnYouhuiQuanList().length">
        <view
          class="coupon-item"
          v-for="(item, index) in returnYouhuiQuanList()"
          :key="index"
          @click="pickYouHuiQuanHandler(index)"
        >
          <view class="item-left">
            <view>
              <view class="title">
                <text style="font-size: 24rpx">￥</text>
                {{ item.discountAmount }}
              </view>
            </view>
            <view class="item-content">
              <view class="title">
                满{{ item.minAmount }}减{{ item.discountAmount }}
              </view>
              <view class="fu">{{ item.endTime }}到期</view>
            </view>
          </view>
          <view class="item-right">
            <image
              src="/static/orderList/inactive.png"
              :class="{
                checkIcon: true,
                hide: item.check,
              }"
            />
            <image
              src="/static/orderList/active.png"
              :class="{
                checkIcon: true,
                hide: !item.check,
              }"
            />
          </view>
        </view>
      </template>

      <!-- 没有优惠券 -->
      <view class="em-wr" v-else>
        <image
          src="../../static/product/noyhp.png"
          class="qu-img"
        ></image>
        <text class="f1">暂无优惠券</text>
        <text class="f2">一个优惠券也没有</text>
      </view>
    </view>
  </wyb-popup>
</view>
</template>

<script>
// 商品的买断功能页面
import BottomBtn from "../../components/bottomBtn/bottomBtn.vue"
import LiteProductShow from "../../components/liteProductShow/liteProductShow.vue"
import wybPopup from "@/components/wyb-popup/wyb-popup.vue"
import { tradePay } from "../../utils/platform"
import { notifyTopPageRefresh } from "../../components/orderItem/orderActionBtns/utils/checkShowBtn"

export default {
  data() {
    return {
      productObj: {}, // 商品对象数据
      activeYouHuiQuan: null, // 优惠券对象
    }
  },

  components: {
    BottomBtn,
    LiteProductShow,
    wybPopup,
  },

  onLoad(opt) {
    this.queryOrderId = opt && opt.orderId // 订单ID
    if (this.$checkIsPageLessParameter(opt, ["orderId"])) return // 如果URL传参没有订单ID，那么做出提示
    this.fetchProductDetail()
  },

  watch: {
    activeYouHuiQuan: function(newV) { // 选中的优惠券发生变化时，进行接口请求
      if (!newV) return
      const { check } = newV
      if (!this.queryOrderId) return
      const postData = { orderId: this.queryOrderId }
      if (check) postData.couponId = newV.code
      else delete postData["couponId"]
      this.$request("hzsx/api/buyOutOrder/buyOutTrial", postData, "POST").then(res => {
        const resData = res.data || {}
        // 这个接口返回的数据模型是一样的，但是其它字段不具有有效值，所以还是保持继续使用老接口/buyOutOrder/buyOutPage所返回的数据，这里只是更新其中几个字段即可
        const { dueBuyOutAmount, endFund, couponAmount, needPay } = resData // 分别表示到期买断价格、买断尾款、优惠金额、最终需要支付金额
        this.productObj = Object.assign({}, this.productObj, { dueBuyOutAmount, endFund, couponAmount, needPay })
      })
    }
  },

  methods: {
    /**
     * 加载商品信息数据
     */
    fetchProductDetail() {
      uni.showLoading({ title: "加载中" })
      const postObj = { orderId: this.queryOrderId }
      const cnMap = { orderId: "订单ID" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return
      this.$request("hzsx/api/buyOutOrder/buyOutPage", postData, "POST").then(res => {
        const resData = res.data || {}
        this.productObj = resData
      }).finally(() => {
        uni.hideLoading()
      })
    },

    /**
     * 返回优惠券数据
     */
    returnYouhuiQuanList() {
      const obj = this.productObj || {}
      const { orderCouponDtos } = obj
      if (Object.prototype.toString.call(orderCouponDtos) !== "[object Array]") return []
      return orderCouponDtos
    },

    /**
     * 选中优惠券的时候触发，注：选中优惠券之后没有进行价格试算，一切以实际支付时后端为准
     */
    pickYouHuiQuanHandler(idx) {
      let youhuiquanList = [...this.returnYouhuiQuanList()] // 优惠券列表数据
      const quanObj = youhuiquanList[idx] // 当前点的这个优惠券对象

      if (quanObj.check) { // 已选中的话，将其取消选中
        quanObj.check = false
      } else { // 未选中的话的处理
        youhuiquanList.forEach(obj => obj.check = false) // 先取消选中所有
        quanObj.check = true
      }

      this.activeYouHuiQuan = Object.assign({}, quanObj)

      this.$set(this.productObj, "orderCouponDtos", youhuiquanList) // 将优惠券列表数据应用上去
      this.$refs.couponList.hide()
    },

    /**
     * 获取金额的总数部分和小数部分
     */
    getXiaoshuAndZongshu() {
      const totalMoney = this.computeTotalMoney()
      if (totalMoney == undefined) return {
        before: "",
        after: "",
        show: false, // 是否显示小数点
      }
      const str = totalMoney + ""
      const strList = str.split(".")
      return {
        before: strList[0],
        after: strList[1],
        show: strList[1] != undefined
      }
    },

    /**
     * 计算显示的总价，选中优惠券之后没有像confirm一样进行试算，一切以在调用后端进行实际支付时为准
     */
    computeTotalMoney() {
      const { needPay } = this.productObj || {}
      return needPay
    },

    /**
     * 表示展示picker选择器
     */
    showYouhuiPickerHandler() {
      this.$refs.couponList.show()
    },

    /**
     * 点击买断的时候触发
     */
    maiduanHandler() {
      const postObj = { orderId: this.queryOrderId }
      if (this.activeYouHuiQuan && this.activeYouHuiQuan.code) {
        postObj.couponId = this.activeYouHuiQuan.code
      }
      uni.showLoading({ title: "处理中" })
      this.$request("hzsx/api/buyOutOrder/liteBuyOutOrderPay", postObj, "POST").then(res => {
        const resData = res.data || {}
        const { payUrl } = resData

        if (!payUrl) { // 存在0元买断的情况，那么此时是拉不起支付的
          uni.hideLoading()
          setTimeout(() => {
            notifyTopPageRefresh.apply(this)
            uni.navigateBack()
          }, 1000)
          return
        }

        tradePay(payUrl, true).then(res => {
          uni.hideLoading()
          this.$eventEmitter.emit("refreshMyPageConfigData") // 刷新我的页面的配置数据，使得我的订单页面中各个类型订单气泡显示对应的数字
          if (res.resultCode === "9000") { // 支付成功
            setTimeout(() => {
              notifyTopPageRefresh.apply(this) // 通知订单列表页面、订单详情页面进行刷新操作
              uni.showToast({ title: "支付成功" })
              uni.navigateBack()
            }, 1000)
          }
        }).catch(() => {
          uni.hideLoading()
        })
      }).catch(() => {
        uni.hideLoading()
      })
    },

    /**
     * 返回优惠券的数量
     */
    returnYouhuiQuanNums() {
      const { orderCouponDtos } = this.productObj || {}
      return orderCouponDtos && orderCouponDtos.length
    },

    /**
     * 表示选中了优惠券对象
     */
    checkChosedYouhuiQuan() {
      if (this.activeYouHuiQuan && this.activeYouHuiQuan.check) return {
        checked: true,
        amount: this.activeYouHuiQuan.discountAmount,
      }
      if (this.activeYouHuiQuan && !this.activeYouHuiQuan.check) return {
        checked: false,
      }
      const { couponCode, couponAmount  } = this.productObj || {} // 说明默认选中了优惠券
      if (couponCode) return {
        checked: true,
        amount: couponAmount
      }
      return {
        checked: false,
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  min-height: 100vh;
  background: #F7F8FB;
  padding-top: 20rpx;
  .product-container {
    background: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
  }
  .youhuiquan-container {
    border-radius: 20rpx;
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    background: #fff;
    margin-bottom: 20rpx;
    .text {
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .flexg {
      flex-grow: 1;
    }
    .back-icon {
      width: 10rpx;
      height: 16rpx;
      margin-left: 12rpx;
    }
    .quan-amount {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #E52021;
      line-height: 30rpx;
      padding: 2rpx 8rpx;
      background: #FBEDEB;
    }
    .noQuan {
      background: #fff;
      color: #333;
      padding-right: 0;
    }
  }
  .billMeta-container {
    border-radius: 20rpx;
    background: #fff;
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76rpx;
      padding: 0 30rpx;
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .key {
        color: #999;
      }
      .val {
        color: #333;
      }
    }
  }
  .coupons {
    max-height: 750rpx;
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
        }
      }
      .item-right {
        .checkIcon {
          width: 36rpx;
          height: 36rpx;
          margin-right: 20rpx;
        }
      }
    }
    .em-wr {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 146rpx;
      .qu-img {
        width: 230rpx;
        height: 268rpx;
        margin-bottom: 46rpx;
      }
      .f1 {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 40rpx;
        margin-bottom: 10rpx;
      }
      .f2 {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 33rpx;
        margin-bottom: 200rpx;
      }
    }
  }
  .hide {
    display: none;
  }
  .btnWrapper {
    display: flex;
    .left {
      flex-grow: 1;
      padding-left: 30rpx;
      background: #fff;
      text-align: left;
      .t1 {
        font-size: 24rpx;
        margin-right: 6rpx;
      }
      .t2 {
        font-size: 28rpx;
        color: #E52021;
        margin-right: 6rpx;
      }
      .t3 {
        font-size: 38rpx;
        color: #E52021;
      }
      .t4 {
        font-size: 36rpx;
        color: #E52021;
      }
      .t5 {
        font-size: 28rpx;
        color: #E52021;
      }
    }
    .right {
      flex-shrink: 0;
      width: 328rpx;
      @include global-background-color2();
    }
  }
}
</style>
