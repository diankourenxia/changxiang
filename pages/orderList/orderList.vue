<template>
<view class="pageWrapper">
  <!-- 顶部tab滑动区域 -->
  <view class="topTabs">
    <v-tabs
      lineHeight="6rpx"
      :lineScale=".4"
      paddingItem="0 24rpx"
      :bold="true"
      v-model="activeTab"
      field="text"
      :tabs="tabList"
      @change="changeTab"
    ></v-tabs>
  </view>

  <!-- 订单列表数据 -->
  <scroll-view
    v-if="orderList.length"
    scroll-y="true"
    @scrolltolower="scrolltoBottomHandler"
    class="orderListWrapper"
  >
    <!-- 押金入口区域 -->
    <view v-if="checkShowTopTips()" class="toptip-wrapper">
      <view class="topText">完成以下操作，即可极速发货：</view>
      <view class="item-wrapper">
        <!-- 身份认证的入口 -->
        <view
          v-if="showAuthenticateEntry()"
          @click="onPushIdcard"
          class="item"
        >
          <image
            class="icon"
            src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/orderList0615/%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%402x%20%281%29.png"
          />
          <text class="desc-text">身份认证</text>
        </view>

        <!-- 支付押金的入口 -->
        <view
          v-if="showZhifuYajinEntry()"
          @click="goYaJinHandler"
          class="item"
        >
          <image
            class="icon"
            src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/orderList0615/%E6%94%AF%E4%BB%98%E6%8A%BC%E9%87%91%402x%20%281%29.png"
          />
          <text class="desc-text">支付押金</text>
        </view>

        <!-- 签约周期扣款 -->
        <view
          v-if="showZhouqiKoukuangEntry()"
          @click="goZhouqiHandler"
          class="item"
        >
          <image
            class="icon"
            src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/orderList0615/%E7%AD%BE%E7%BA%A6%E5%91%A8%E6%9C%9F%E6%89%A3%E6%AC%BE%402x%20%281%29.png"
          />
          <text class="desc-text">签约周期扣款</text>
        </view>
      </view>
    </view>

    <OrderItem
      v-for="(orderObj, idx) in orderList"
      :key="idx"
      :orderObj="orderObj"
    >
    </OrderItem>
    <view class="be-end" v-if="hasBeenEnd && !loading">已经到底了~</view>
  </scroll-view>

  <view v-if="!loading && !orderList.length" class="emptyOrderListWrapper">
    <image class="empty-icon" src="https://zuwuzuwebs.oss-cn-beijing.aliyuncs.com/jianbanMini/orderList/%E6%9A%82%E6%97%A0%E8%AE%A2%E5%8D%95%402x%20%281%29.png"></image>
    <text class="empty-title">暂无{{ returnTxt() }}订单</text>
    <text class="empty-desc">快去看看喜欢的商品吧</text>
    <view @click="goSeeHandler" class="see-btn">去看看</view>
  </view>
</view>
</template>

<script>
// 订单列表页面
import VTabs from "../../components/v-tabs/v-tabs.vue"
import { TABS, ALL_ORDER_ID, ALL_ORDER_TEXT } from "../../utils/constant.js"
import OrderItem from "../../components/orderItem/orderItem.vue"
import { zhouqiKouKuanClickHandler } from "../../utils/index"

export default {
  data() {
    return {
      tabList: TABS, // 所有列表数据
      activeTab: 0, // 处于焦点状态下的订单分类，是个索引
      orderListApiRes: {}, // 订单列表/userOrderList接口所返回的数据
      pageNumber: 1,
      pageSize: 10,
      loading: true, // 请求页面数据中
      hasIdCardFlag: true, // 表示是否绑定了身份证，默认认为已经绑定了身份证，避免经常发生闪现
      topConfigObj: {}, // 用来判断是否需要显示支付押金和签约周期扣款
    }
  },
  
  components: {
    VTabs,
    OrderItem,
  },
  
  onLoad(opt) {
    this.activeTab = this.findTabIdxFromTabList(opt && opt.tab)
    this.fetchOrderList()
    this.eventId = this.$eventEmitter.subscribe("refreshOrderList", this.refreshHandler) // 监听是否需要刷新订单列表事件
    this.fetchUserHasBindIdCard()
    this.fetchShowYaJinAndCyclePaymentHandler()
  },

  onUnload() {
    this.$eventEmitter.removeHandler("refreshOrderList", this.eventId)
  },

  // 监听页面的下拉刷新操作
  onPullDownRefresh() {
    this.refreshHandler(true)
  },

  computed: {
    // 加工过后订单列表数据，不管接口返回如何，一定能确保其数据类型是数组，使用方无需检测
    orderList: function() {
      const resObj = this.orderListApiRes || {}
      return (resObj && resObj.records) || []
    },
    // 判断是否已经到最后一页了
    hasBeenEnd: function() {
      const totalPages = this.orderListApiRes?.pages || 2 // 这里把初始值设置为2，是为了避免一开始就不请求（这样写不太好）
      return this.pageNumber >= totalPages
    },
  },

  methods: {
    /**
     * 身份证上传照片认证
     */
    onPushIdcard() {
      this.$onTo("/pages/certificates/certificates")
    },

    /**
     * 跳转押金充值页面
     */
    goYaJinHandler() {
      this.$onTo("/pages/depositRecharge/depositRecharge")
    },

    /**
     * 进行周期扣款的签约，先判断一下是否有进行身份证绑定，如果绑定过那么直接跳转到签约订单列表，否则身份绑定
     */
    goZhouqiHandler() {
      zhouqiKouKuanClickHandler()
    },

    /**
     * 加载是否需要显示押金以及周期扣款的信息
     */
    fetchShowYaJinAndCyclePaymentHandler() {
      return this.$request(
        "/hzsx/api/order/queryOrderPaySignInfo",
        {},
        "GET",
        true
      ).then((res) => {
        const resData = res.data || {}
        this.topConfigObj = resData
      })
    },

    /**
     * 判断是否需要显示身份认证 || 支付押金 || 签约周期扣款这块区域；注：只有当是租赁订单模块时才有机会显示
     */
    checkShowTopTips() {
      // return (
      //   this.showAuthenticateEntry() ||
      //   this.showZhifuYajinEntry() ||
      //   this.showZhouqiKoukuangEntry()
      // )
	  return false
    },

    /**
     * 判断是否显示支付押金的入口
     */
    showZhifuYajinEntry() {
      return this.topConfigObj?.showDepositIcon
    },

    /**
     * 判断是否显示周期扣款的入口
     */
    showZhouqiKoukuangEntry() {
      return this.topConfigObj?.showCyclePayIcon
    },

    /**
     * 判断是否显示身份认证的入口
     */
    showAuthenticateEntry() {
      return !this.hasIdCardFlag
    },

    /**
     * 获取时间的YYYYMMDD格式
     * @param {Number} type : 0表示yymmdd，1表示yy-mm-dd，2表示yy年mm月dd日
     * @returns
     */
    getDateYYMMDD(type = 0, dateObj) {
      const date = dateObj || new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month < 10) month = `0${month}`

      let day = date.getDate()
      if (day < 10) day = `0${day}`

      if (type == 0) {
        return `${year}${month}${day}`
      } else if (type == 1) {
        return `${year}-${month}-${day}`
      } else if (type == 2) {
        return `${year}年${month}月${day}日`
      }
    },

    /**
     * 判断用户是否上传身份证
     */
    fetchUserHasBindIdCard() {
      return this.$request(
        "hzsx/userCertification/getByUid",
        {},
        "GET",
        true
      ).then((res) => {
        const resData = res.data || {}
        const { idCardBackUrl, idCardFrontUrl, limitDate } = resData
        const nowYYYYMMDD = this.getDateYYMMDD()
        if (
          !idCardBackUrl ||
          !idCardFrontUrl ||
          !limitDate ||
          nowYYYYMMDD > limitDate
        ) {
          // 不存在正反面或者已过期
          this.hasIdCardFlag = false
        }
      })
    },

    /**
     * 刷新处理
     */
    refreshHandler(isPullDownRefresh) {
      this.resetHandler()
      this.fetchOrderList(isPullDownRefresh)
    },

    /**
     * 加载订单列表数据
     */
    fetchOrderList(isPullDown) {
      const stopPulldownHandler = () => {
        isPullDown && uni.stopPullDownRefresh()
      }

      if (this.hasBeenEnd) { // 已经到底部了，那么直接返回
        stopPulldownHandler()
        return
      }
      
      const postObj = {
        uid: this.$getUid(),
		// uid: `3852c6db36449293add1052b413b392808db4e99wprhvhszng9n`,
        status: this.findTabValueByIdx(),
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      if (postObj.status === ALL_ORDER_ID) delete postObj["status"] // 全部订单的话，删除status字段，非必填
      const cnMap = { uid: "用户ID", status: "订单状态", pageNumber: "页数", pageSize: "页码" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) { // 说明参数校验失败
        stopPulldownHandler()
        return
      }

      this.loading = true

      this.$request("/hzsx/liteUserOrders/userOrderList", postData, "POST",false,true).then(res => {
        const resData = res.data || {}
		resData.records.map((item,index) =>{
			if(item.status == "13" ||item.status == '14'){
				item.status = '04'
			}
		})
        resData.records = this.compositeOrderList(resData)
        this.orderListApiRes = resData
      }).finally(() => {
        this.loading = false
        stopPulldownHandler()
      })
    },

    /**
     * 合成新的订单列表数据
     * @param {newV} 新请求到的接口数据
     */
    compositeOrderList(newV) {
      const currentOrderList = this.orderList
      const newOrderList = newV?.records || []
      return [...currentOrderList, ...newOrderList]
    },

    // 初始化数据
    resetHandler() {
      this.pageNumber = 1
      this.orderListApiRes = {}
    },

    /**
     * 点击tab栏的时候触发
     */
    changeTab(idx) {
      this.resetHandler()
      this.activeTab = idx
      this.fetchOrderList()
    },

    /**
     * 根据分类的枚举值找出对应的索引
     * @param {string} atab : 处于焦点的状态栏英文
     */
    findTabIdxFromTabList(atab) {
      const idx = TABS.findIndex(obj => obj.extCode == atab)
      if (idx === -1) return 0 // 找不到，则默认所有
      return idx
    },

    /**
     * 找出当前菜单的枚举值
     */
    findTabValueByIdx() {
      const tabObj = TABS[this.activeTab] || {}
      return tabObj.id
    },

    /**
     *  根据当前菜单的索引值找出其中文
     */
    findTabTextByIdx() {
      const tabObj = TABS[this.activeTab] || {}
      return tabObj.text
    },

    /**
     * 返回文案
     */
    returnTxt() {
      const txt = this.findTabTextByIdx()
      return txt == ALL_ORDER_TEXT ? "" : txt
    },

    /**
     * 监听点击去查看
     */
    goSeeHandler() {
      this.$onTo("/pages/classified/classified", true)
    },

    /**
     * 监听滑动到底部
     */
    scrolltoBottomHandler() {
      if (this.hasBeenEnd) return
      this.pageNumber++
      this.fetchOrderList()
    }
  },
}
</script>

<style lang="scss" scoped>
.pageWrapper {
  background: #F5F5F8;
}
.topTabs {
  margin-bottom: 20rpx;
}
.emptyOrderListWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding-top: 160rpx;
  box-sizing: border-box;
  min-height: calc(100vh - 70rpx - 20rpx);
  .empty-icon {
    width: 230rpx;
    height: 266rpx;
    display: block;
    margin-bottom: 48rpx;
  }
  .empty-title {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333;
    line-height: 40rpx;
    margin-bottom: 10rpx;
  }
  .empty-desc {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666;
    line-height: 33rpx;
    margin-bottom: 30rpx;
  }
  .see-btn {
    width: 138rpx;
    height: 56rpx;
    @include global-background-color2();
    border-radius: 43rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
  }
}
.orderListWrapper {
  box-sizing: border-box;
  padding-top: 0;
  // padding-bottom: 20rpx;
  height: calc(100vh - 90rpx);
}
.be-end {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999;
}
.toptip-wrapper {
  background: #ffffff;
  border-radius: 10rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  .topText {
    margin-bottom: 30rpx;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 33rpx;
  }
  .item-wrapper {
    padding: 0 60rpx;
    box-sizing: border-box;
    display: flex;
    // justify-content: space-between;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 72rpx;
        height: 72rpx;
        margin-bottom: 10rpx;
      }
      .desc-text {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        white-space: nowrap;
      }
    }
    .item + .item {
      margin-left: 100rpx;
    }
  }
}
</style>
