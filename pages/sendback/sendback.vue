<template>
<view class="wrapper">
  <!-- 商品描述区域 -->
  <view class="quanpinquanjiao product-wrapper">
    <image :src="productVO.mainImageUrl" class="product-img" />
    <view class="desc">
      <view class="product-name">{{ $uiStr(productVO.productName) }}</view>
      <view class="sku">规格：{{ $uiStr(productVO.skuTitle) }}</view>
    </view>
  </view>

  <!-- 归还地址展示区域 -->
  <view @click="goPickAddressHandler" class="address-wrapper">
    <!-- 没有选中归还地址信息时的显示 -->
    <view class="empty-wrapper" v-if="!returnAddressVal()">
      <image src="/static/sendback/address.png" class="guihuan-icon" />
      <text class="empty-text">选择归还地址</text>
      <text class="flexg" />
      <image class="chose-icon" src="/static/complain/back.png" />
    </view>

    <template v-else>
      <view class="top-item">
        <image src="/static/sendback/address.png" class="guihuan-icon" />
        <text class="name-cls">{{ getPickedAddressProperty("name") }}</text>
        <text class="phone-cls">{{ getPickedAddressProperty("telephone") }}</text>
      </view>
      <view class="bottom-item">
        {{ returnAddressVal() }}
      </view>
      <image class="chose-icon" src="/static/complain/back.png" />
    </template>
  </view>

  <!-- 归还表单区域 -->
  <view class="quanpinquanjiao form-wrapper">
    <view class="row formRow">
      <text class="formLabel">运费</text>
      <text class="formValue">{{ yunfeiMehtodText }}</text>
    </view>

    <view class="row formRow">
      <text class="formLabel">归还方式</text>
      <text class="formValue">快递归还</text>
    </view>

    <view class="row formRow">
      <text class="formLabel">物流公司</text>
      <picker @change="event => activeExpressCompanyIdx = event.detail.value" range-key="name" :range="expressCompanyList">
        <view class="value formValue">
          {{ returnFocusValue("expressCompanyList", "activeExpressCompanyIdx", "name") }}
          <image src="/static/complain/back.png" class="back-icon" />
        </view>
      </picker>
    </view>

    <view class="row formRow">
      <text class="formLabel">物流单号</text>
      <input v-model="expressNo" placeholder="请输入物流单号" class="formValue" />
    </view>
  </view>

  <view class="tips">提示：商家收到货物后，会提供结算单，请及时确认结算单</view>

  <BottomBtn text="提交" @click="submitHandler(false)" />

  <Dialog
    v-if="showDialog"
    content="您的租期尚未结束，提前归还可能会产生服务费，请联系商家确认后再归还"
    okText="归还"
    @cancel="showDialog = false"
    @ok="confirmHandler"
  />
</view>
</template>

<script>
// 归还页面，跳转到这个页面还需要携带下订单ID，订单ID是为了归还时传给接口；简版小程序不存在购买商品，所以就不再加入一个表示是否是直购商品的参数了
import BottomBtn from "../../components/bottomBtn/bottomBtn.vue"
import { sendbackPageProductGlobalKey, shareConfigObj, selectAddressObjKey, yunfeiReturnMap, EMPTY_PLACEHOLDER } from "../../utils/constant"
import { getAddressDescStr } from "../../utils/index"
import Dialog from "../../components/dialog/dialog.vue"
import { notifyTopPageRefresh } from "../../components/orderItem/orderActionBtns/utils/checkShowBtn"

const placeholder = "请选择"

export default {
  data() {
    return {
      productVO: this.$getGlobalData(sendbackPageProductGlobalKey) || {}, // 从全局数据中取出上个页面所埋下的商品数据
      orderId: "", // 订单ID
      expressCompanyList: [], // 物流公司列表
      activeExpressCompanyIdx: undefined, // 处于焦点的物流公司索引位置
      activeAddressObj: {}, // 选中的地址对象，这个地址对象来自/giveBack/queryOrderGiveBackAddress接口
      expressNo: "", // 物流单号
      showDialog: false, // 是否显示弹窗
      submiting: false, // 是否正在提交中
      yunfeiMehtodText: "", // 运费的中文描述
    }
  },

  components: {
    Dialog,
    BottomBtn,
  },

  onLoad(opt) {
    this.orderId = opt && opt.orderId

    if (
      this.$checkIsPageLessParameter(opt, ["orderId"])
    ) return // 页面链接中缺少订单ID或者从全局中取不到商品详情对象

    this.fetchExpressCompanyListHandler().then(this.fetchYunfeiMethod)

    this.eventId = this.$eventEmitter.subscribe("feedbackSelectAddress_ndsjk19", this.refreshAddress) // 监听选中了地址的事件
  },

  onUnload() {
    this.$delGlobalData(sendbackPageProductGlobalKey) // 清掉选中的商品数据
    this.$delGlobalData(selectAddressObjKey) // 清理掉选中的地址
    this.$eventEmitter.removeHandler("feedbackSelectAddress_ndsjk19", this.eventId)
  },

  // 监听点击小程序进行分享，这个页面就不允许进行分享了，因为它依赖上个页面所存在全局的商品数据
  onShareAppMessage() {
    return shareConfigObj
  },

  methods: {
    /**
     * 更新所选中的地址
     */
    refreshAddress() {
      this.activeAddressObj = this.$getGlobalData(selectAddressObjKey) || {}
    },

    /**
     * 加载物流公司列表数据
     */
    fetchExpressCompanyListHandler() {
      return this.$request("hzsx/aliPay/platformExpress/selectExpressList",{},"get",false,true).then(resData => {
        this.expressCompanyList = resData || []
      })
    },

    /**
     * 返回picker组件需要显示的值，注：一开始这个方法不仅用来取物流公司picker的数据，而且还用来取地址picker的数据，后者没有使用场景了
     * @param {String} listKey : 列表数据的字段名称
     * @param {String} idxKey : 表示索引下标的字段
     * @param {String} contentKey : 内容值的字段
     */
    returnFocusValue(listKey, idxKey, contentKey) {
      const list = this[listKey]
      const index = this[idxKey]
      if (index == undefined) return placeholder
      const obj = list[index]
      return obj[contentKey]
    },

    /**
     * 点击提交的时候触发
     * @param {Bool} isChecked : 是否已经进行过弹窗的二次确认
     */
    submitHandler(isChecked) {
      if (!isChecked && this.checkIsBefore()) { // 如果是提前归还的话，那么进行弹窗提示
        this.showDialog = true
        return
      }

      const { postData, pass } = this.generatePostData()
      if (!pass) return // 校验失败的话，那么返回

      if (this.submiting) return // 已处于提交中状态的话，那么返回
      this.submiting = true

      this.$request("hzsx/api/order/giveBack/userOrderBackSubmitConfirm", postData, "POST").then(() => {
        uni.showToast({ title: "操作成功" })
        setTimeout(() => {
          notifyTopPageRefresh.apply(this) // 通知订单列表页面、订单详情页面进行刷新操作
          uni.navigateBack() // 回退到上一页面
        }, 800)
      }).finally(() => {
        this.submiting = false
      })
    },

    /**
     * 弹窗的确认点击方法
     */
    confirmHandler() {
      this.showDialog = false
      this.submitHandler(true)
    },

    /**
     * 判断是否是提前归还
     */
    checkIsBefore() {
      const { endTime } = this.productVO
      const endStamp = new Date(endTime).valueOf()
      const currentStamp = Date.now()
      return endStamp - currentStamp > 0
    },

    /**
     * 返回所选中的地址对象
     */
    getPickedAddressProperty(key) {
      const obj = this.activeAddressObj || {}
      return obj[key] || ""
    },

    /**
     * 返回所选中地址的字符串表示
     */
    returnAddressVal() {
      return getAddressDescStr(this.activeAddressObj)
    },

    /**
     * 选中地址的时候触发
     */
    goPickAddressHandler() {
      let basicUrl = `/pages/sendbackAddress/sendbackAddress?orderId=${this.orderId}`
      // 取出地址ID，如果存在的话，那么携带到下一个页面，借此实现默认选中的效果
      const aid = this.getPickedAddressProperty("id")
      aid && (basicUrl += `&aid=${aid}`)
      this.$onTo(basicUrl)
    },

    /**
     * 生成提交数据
     */
    generatePostData() {
      const orderId = this.orderId
      const addressId = this.getPickedAddressProperty("id")
      let expressId = this.returnFocusValue("expressCompanyList", "activeExpressCompanyIdx", "id")
      expressId === placeholder && (expressId = "")
      const postObj = { orderId, addressId, expressId, expressNo: this.expressNo }
      const cnMap = { orderId: "订单ID", addressId: "归还地址", expressId: "物流公司", expressNo: "物流单号" }
      return this.$postDataGuard(postObj, cnMap)
    },

    /**
     * 加载运费方式数据
     */
    fetchYunfeiMethod() {
      const { productId } = this.productVO // 商品ID
      if (!productId) {
        uni.showToast({ title: "缺少商品ID" })
        return
      }
      return this.$request(`hzsx/aliPay/product/getReturnFreightType?productId=${productId}`).then(res => {
        const resData = res.data || ""
        const uiStr = yunfeiReturnMap[resData]
        this.yunfeiMehtodText = uiStr || EMPTY_PLACEHOLDER
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  background: #F7F8FB;
  box-sizing: border-box;
  padding-top: 20rpx;
}
.product-wrapper {
  background: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .product-img {
    width: 144rpx;
    height: 144rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }
  .desc {
    flex-grow: 1;
    overflow: hidden;
    .product-name {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 20rpx;
    }
    .sku {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 30rpx;
    }
  }
}
.address-wrapper {
  background: #fff;
  padding: 35rpx 30rpx;
  border-radius: 20rpx;
  position: relative;
  margin-bottom: 20rpx;
  .top-item, .empty-wrapper {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333;
    line-height: 33rpx;
    margin-bottom: 10rpx;
    .guihuan-icon {
      width: 24rpx;
      height: 24rpx;
      display: block;
      margin-right: 10rpx;
    }
    .name-cls {
      margin-right: 20rpx;
    }
  }
  .bottom-item {
    padding-left: 34rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999;
    line-height: 33rpx;
  }
  .chose-icon {
    position: absolute;
    width: 10rpx;
    height: 16rpx;
    top: 50%;
    transform: translateY(-50%);
    right: 30rpx;
  }
  .empty-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    .empty-text {
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333;
    }
  }
}
.form-wrapper {
  background: #fff;
  margin-bottom: 20rpx;
  .row {
    padding: 0 30rpx;
    .back-icon {
      width: 10rpx;
      height: 16rpx;
      margin-left: 10rpx;
    }
  }
}
.tips {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 1.3em;
  padding: 0 30rpx;
}
.submit {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98rpx;
  @include global-background-color();
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>
