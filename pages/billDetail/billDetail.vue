<template>
  <view class="wrapper">
    <!-- 顶部注意事项，未显示关闭，且存在未还款账单的时候才会显示 -->
    <view v-if="checkShowTopTip()" class="topTip">
      <text>{{ returnTopToolTip() }}</text>
      <image
        @click="showTopTip = false"
        src="/static/billDetail/close.png"
        class="close-icon"
      />
    </view>

    <!-- 商品数据 -->
    <view class="quanpinquanjiao product-wrapper">
      <view class="top-item">
        <LiteProductShow :productVO="orderObj" :money="returnMoney()" />
      </view>
      <!-- 底部金额区域 -->
      <view class="bottom">
        <view class="item">
          <view class="top">应付租金(元)</view>
          <view class="b-money">¥{{ totalMoney }}</view>
        </view>
        <view class="item">
          <view class="top">已付租金(元)</view>
          <view class="b-money">¥{{ haspayMoney }}</view>
        </view>
        <view class="item">
          <view class="top">未付租金(元)</view>
          <view class="b-money"
            >¥{{ makeSubHandler(totalMoney, haspayMoney) }}</view
          >
        </view>
      </view>
    </view>

    <view class="period-wrapper">
      <view class="title">可提前支付租金</view>
      <!-- 租金期数列表，把期数列举出来 -->
      <view class="period-list">
        <view
          class="period-item"
          v-for="(periodObj, idx) in billList"
          :key="idx"
        >
          <view class="top">
            <view class="left">
              <view class="period"
                >{{ periodObj.currentPeriods }}/{{
                  periodObj.totalPeriods
                }}期</view
              >
              <view class="bottom-money">
                <view class="money">¥{{ periodObj.currentPeriodsRent }}</view>
                <text class="red-text">{{ returnAddonText(periodObj) }}</text>
              </view>
            </view>
            <!-- <view class="right">
              <image src="" class="icon" />
              <image src="" class="icon" />
              <image src="" class="icon" />
            </view> -->
          </view>
          <view class="bottom">
            <text>支付时间：{{ returnPeriodPayTime(periodObj) }}</text>
            <template v-if="!checkHasPay(periodObj.status)">
              <image
                @click="toggleChooseHandler(idx)"
                :class="{
                  'check-img': true,
                  'chose-img': true,
                  hide: !checkHasChose(periodObj),
                }"
                src="/static/orderList/active.png"
              />
              <view
                @click="toggleChooseHandler(idx)"
                :class="{
                  'check-img': true,
                  unchose: true,
                  hide: checkHasChose(periodObj),
                }"
              ></view>
            </template>
            <text :class="{ hasPay: checkHasPay(periodObj.status) }">{{
              returnStatusCn(periodObj)
            }}</text>
          </view>
        </view>
      </view>
    </view>

    <BottomBtn v-if="unpayList && unpayList.length">
      <view slot="ele" class="btn-wrapper">
        <view class="left">
          总计：
          <text class="t-money">
            <text class="fuhao">¥</text>
            {{ payMoney }}
          </text>
        </view>
        <view @click="payHandler" class="right">去支付</view>
      </view>
    </BottomBtn>
  </view>
</template>

<script>
// 账单详情页面
import LiteProductShow from "../../components/liteProductShow/liteProductShow.vue"
import {
  formatStrDate,
  makeAdd,
  makeSub,
  getDateValueOf,
  getShowLoading,
  getHideLoading,
} from "../../utils/index"
import { shareConfigObj, billDetailGlobalKey, 待支付, 逾期未支付, 已支付, 逾期已支付 } from "../../utils/constant"
import BottomBtn from "../../components/bottomBtn/bottomBtn.vue"
import { tradePay } from "../../utils/platform"

const unpayStatus = [待支付, 逾期未支付] // 需要进行支付的状态列表
const haspayStatus = [已支付, 逾期已支付] // 已支付过的状态列表

export default {
  data() {
    return {
      orderObj: this.$getGlobalData(billDetailGlobalKey) || {}, // 订单对象
      queryOrderId: "", // 从上个页面所传入进来的订单ID
      showTopTip: true, // 是否显示顶部导航栏
      billList: [], // 账单列表数据，即包括未支付，也包括已支付
      haspayList: [], // 已支付的账单
      unpayList: [], // 未支付的账单
      totalMoney: 0, // 应付租金总额
      haspayMoney: 0, // 已支付租金总额
      periodList: [], // 还款期数数组
      submitting: false, // 表示正在提交中
      fromOrderDetail: false,
      payMoney: 0, // 还款总金额
    }
  },

  watch: {
    /**
     * 监听账单列表数据发生变化
     */
    billList: function (newV) {
      let total = 0
      const list = []
      for (let obj of newV) {
        if (obj.$choosed) {
          // 表明该期数据被勾选
          const { currentPeriods, currentPeriodsRent } = obj // 分别对应期数、金额
		  
          total = makeAdd(total, currentPeriodsRent)
          list.push(currentPeriods)
        }
      }
      this.payMoney = total
      this.periodList = list
    },
  },

  onLoad(opt) {
	  console.log("orderObj",this.orderObj);
    this.queryOrderId = opt && opt.orderId // 订单ID
    this.fromOrderDetail = opt && opt.fromOrderDetail == "1" // 判断是否来自订单详情页面
    if (this.$checkIsPageLessParameter(opt, ["orderId"])) return // 如果URL传参没有订单ID，那么做出提示

    this.fetchPeriodList()
  },

  onUnload() {
    this.$delGlobalData(billDetailGlobalKey)
  },

  // 监听点击小程序进行分享，这个页面就不允许进行分享了，因为它依赖上个页面所存在全局的商品数据
  onShareAppMessage() {
    return shareConfigObj
  },

  // 监听页面的下拉刷新操作
  onPullDownRefresh() {
    this.fetchPeriodList(true)
  },

  components: {
    LiteProductShow,
    BottomBtn,
  },

  methods: {
    /**
     * 做减法操作
     */
    makeSubHandler(n1, n2) {
	  if(this.orderObj?.status === '09'){
		  return 0
	  }
      return Math.abs(makeSub(n1, n2))
    },

    /**
     * 加载还款列表数据
     * @param {bool} isPullRefresh : 是否是下拉刷新引起的
     */
    fetchPeriodList(isPullRefresh) {
      this.$request(
        `/hzsx/api/orderByStages/queryOrderByStagesByOrderId?orderId=${this.queryOrderId}`,
        {},
        "get",
        true,
        true
      ).then((res) => {
        const resData = res.data // 接口返回的账单列表数据
        this.periodListHandler(resData)
        this.computeTotal(resData)
        this.computeHaspayTotalMoney()
      }).finally(() => {
        isPullRefresh && uni.stopPullDownRefresh()
      })
    },

    /**
     * 返回顶部文案
     */
    returnTopToolTip() {
      const nearestOrder = this.unpayList[0] || {} // 最近的未支付账单
      const { statementDate = "" } = nearestOrder // 最近未还款这期的还款时间以及状态
      if (nearestOrder.currentPeriods == 1) {
        return ""
      }
      const [
        firstNoPayStamp,
        firstNoPayYear,
        firstNoPayMonth,
        firstNoPayDate,
      ] = getDateValueOf(statementDate) // 获取最近这期的时间戳和月份
      const [
        currentStamp,
        currentYear,
        currentMonth,
        currentDate,
      ] = getDateValueOf() // 当前时间戳

      if (
        firstNoPayYear === currentYear &&
        firstNoPayMonth === currentMonth &&
        firstNoPayDate === currentDate
      ) {
        // 已经到还款日了
        return "今天是您的交租日，请及时支付租金，避免逾期"
      }

      // 1、判断当前的月份是否比第一期月份小
      if (firstNoPayStamp > currentStamp) {
        // 未还账单的第一期是未来的时间
        if (firstNoPayMonth > currentMonth) {
          // 当前期已还完
          return "当期租金已支付，信用满分！"
        } else {
          // 当前期还未还
          const leftTime = firstNoPayStamp - currentStamp
          let restDate = parseInt(leftTime / 1000 / 60 / 60 / 24, 10)
          restDate === 0 && (restDate = 1)
          return `距离交租日还有${restDate}天，请注意交租时间，避免逾期`
        }
      } else {
        // 不可能等于的，只有可能小于，等于已经走了最上面if的分支
        return "您的租金已逾期，请尽快交租，避免信用受损"
      }
    },

    /**
     * 计算总租金
     * @param {Object} queryOrderByStagesByOrderId接口所返回的响应数据
     */
    computeTotal(resData) {
      const someItem = (resData && resData[0]) || {} // 每一期数据上都具有总租金字段
      this.totalMoney = someItem.totalRent || 0 // 总租金
    },

    /**
     * 计算已支付的金额
     */
    computeHaspayTotalMoney() {
      if (
        Object.prototype.toString.call(this.haspayList) !== "[object Array]" ||
        !this.haspayList.length
      ) return
      const totalValue = this.haspayList.reduce(
        (begin, obj) => makeAdd(begin, obj.currentPeriodsRent),
        0
      )
      this.haspayMoney = totalValue
    },

    /**
     * 对接口返回的账单列表数据进行加工处理，待支付的必须放在前面，已经支付过的放在后面
     */
    periodListHandler(periodList) {
      if (Object.prototype.toString.call(periodList) !== "[object Array]") {
        return
      }
      const unpayListTemp = []
      const haspayListTemp = []

      periodList.forEach((obj) => {
        const { status } = obj
        if (unpayStatus.includes(status)) {
          // 需要支付
          unpayListTemp.push(obj)
        } else if (this.checkHasPay(status)) {
          // 已经支付过
          haspayListTemp.push(obj)
        }
      })

      this.unpayList = unpayListTemp // 未支付租期，为了后面确定是否逾期使用
      this.haspayList = haspayListTemp // 为了后面计算已支付租金使用

      // 参考老的实现，一个账单就只有1，2，3，4这几种状态，所以不用担心没有展示接口返回的其它数据
      this.billList = [...unpayListTemp, ...haspayListTemp]
    },

    /**
     * 判断是否需要显示额外文本，比如说已逾期；（还有3天即将还款）
     * @param {object} periodItem : 期数对象
     */
    returnAddonText(periodItem) {
      if (this.returnStatusCn(periodItem) === "已支付") return // 已支付的话，无需显示时效状态
      const createDate = new Date(periodItem.createTime.replace(/-/g, "/")) // 创建时间
      let periodPayDate = new Date(
        periodItem.statementDate.replace(/-/g, "/")
      ) // 先对接口返回的时间字符串做一个格式处理，老ios不支持实例化以-作为分隔符的date对象，不知现在如何
	  
	  // 设置时间为当天的最后一秒
	  periodPayDate.setHours(23, 59, 59);
      
      if (periodItem.currentPeriods == 1) { // 第一期不处理
        return
      }
      // if (
      //   createDate.getFullYear() == periodPayDate.getFullYear() &&
      //   createDate.getMonth() == periodPayDate.getMonth() &&
      //   createDate.getDate() == periodPayDate.getDate()
      // ) {
      //   return
      // }
      const timeGap = periodPayDate - new Date() // 两者时间之差，毫秒为单位
      if (timeGap <= 0) return "（已逾期）" // 说明已逾期
      // const max = 3 * 24 * 60 * 60 * 1000 // 3天
      // if (timeGap <= max) return "（还有3天即将还款）"
    },

    /**
     * 返回期数的支付时间
     * @param {Object} periodItem : 期数对象
     */
    returnPeriodPayTime(periodItem) {
      return formatStrDate(periodItem.statementDate || "", "yyyy年MM月dd日")
    },

    /**
     * 判断这期账单数据已经勾选
     */
    checkHasChose(periodObj) {
      return periodObj && periodObj.$choosed
    },

    /**
     * 判断账单已支付过
     */
    checkHasPay(status) {
      return haspayStatus.includes(status)
    },

    /**
     * 返回订单的中文描述
     */
    returnStatusCn(periodItem) {
      const { status } = periodItem
      if (unpayStatus.includes(status)) {
        // 未支付相关状态
        return "待支付"
      } else if (this.checkHasPay(status)) {
        return "已支付"
      }
    },

    /**
     * 勾选/取消勾选账单对象的时候触发
     */
    toggleChooseHandler(idx) {
      const obj = this.billList[idx] || {} // 账单对象
      obj.$choosed = !!!obj.$choosed
      this.$set(this.billList, idx, obj)
    },

    /**
     * 返回提交数据
     */
    returnPostData() {
      const orderId = this.queryOrderId
      const totalAmount = this.payMoney
      const periodList = this.periodList

      const postObj = { orderId, totalAmount, periodList }
      const cnMap = { orderId: "订单ID", totalAmount: "总价", periodList: "期数" }
      return this.$postDataGuard(postObj, cnMap)
    },

    /**
     * 点击支付的时候触发
     */
    payHandler() {
      const { postData, pass } = this.returnPostData()
      if (!pass) return
      if (this.submitting) return
      getShowLoading({ title: "处理中" })
      this.$request("hzsx/api/orderByStages/liteOrderByStagesPay", postData, "POST")
        .then((res) => {
          const resData = res.data || {}
          const { payUrl } = resData
          if (!payUrl) return

          return tradePay(payUrl, true)
            .then((res) => {
              getHideLoading()
              this.$eventEmitter.emit("refreshMyPageConfigData") // 刷新我的页面的配置数据，使得我的订单页面中各个类型订单气泡显示对应的数字
              if (res.resultCode === "9000") {
                // 支付成功
                setTimeout(() => {
                  uni.showToast({ title: "支付成功" })
                  this.fetchPeriodList()
                }, 1000) // 加入一点延时，避免后端接收支付宝回调不及时。若不需要，那去掉延时
              }
            })
            .catch(() => {
              // 支付失败
              getHideLoading()
              uni.showToast({ title: "支付失败" })
            })
        })
        .finally(() => {
          getHideLoading()
        })
    },

    /**
     * 判断是否需要显示弹窗信息：未关闭 且 存在未还账单
     */
    checkShowTopTip() {
      return this.showTopTip && this.returnTopToolTip()
    },

    /**
     * 返回总租金所对应的字段
     */
    returnMoney() {
      if (this.fromOrderDetail) { // 表示是从订单详情跳转过来的
        return this.$getGlobalData("zongzujinshuju0712")
      }
      return ""
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  background: #f7f8fb;
  padding-bottom: 140rpx;
  .topTip {
    height: 60rpx;
    @include global-background-color2();
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    margin-bottom: 20rpx;
    .close-icon {
      width: 26rpx;
      height: 26rpx;
    }
  }
  .product-wrapper {
    padding: 32rpx 0;
    background: #fff;
    margin-bottom: 50rpx;
    .top-item {
      padding: 0 30rpx;
      margin-bottom: 40rpx;
    }
    .bottom {
      padding: 0 46rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .top {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-bottom: 10rpx;
        }
        .b-money {
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }
  .period-wrapper {
    padding: 0 20rpx;
    .title {
      margin-bottom: 20rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .period-list {
      .period-item {
        position: relative;
        padding: 20rpx 26rpx;
        background: #ffffff;
        border-radius: 20rpx;
        .top {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20rpx;
          .left {
            .period {
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              margin-bottom: 17rpx;
            }
            .bottom-money {
              display: flex;
              align-items: center;
              font-family: PingFangSC-Regular, PingFang SC;
              .money {
                font-size: 42rpx;
                font-weight: 600;
                color: #333333;
                line-height: 59rpx;
              }
              .red-text {
                font-size: 24rpx;
                font-weight: 400;
                color: #f1192a;
              }
            }
          }
          .right {
            .icon {
              width: 50rpx;
              height: 50rpx;
            }
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
      .period-item + .period-item {
        margin-top: 20rpx;
      }
    }
  }
  .btn-wrapper {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    border: 1rpx solid #dcdcdc;
    border-left-style: none;
    border-right-style: none;
    .left {
      padding-left: 30rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      height: 100%;
      display: flex;
      align-items: center;
      flex-grow: 1;
      background: #fff;
      .t-money {
        font-size: 38rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #e52021;
        .fuhao {
          font-size: 28rpx;
        }
      }
    }
    .right {
      width: 328rpx;
      height: 100%;
      flex-shrink: 0;
      @include global-background-color2();
      @include global-border-top2(1rpx);
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .hasPay {
    color: #333 !important;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 30rpx;
  }
  .check-img {
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    right: 42rpx;
  }
  .unchose {
    width: 46rpx;
    height: 46rpx;
    border: 2rpx solid #ddd;
  }
  .hide {
    display: none;
  }
}
</style>
