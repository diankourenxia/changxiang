<template>
<view class="wrapper">
  <view class="header">
    <text class="content content1">此投诉适用于检举商户的不合规行为。我们承诺会严格保护投诉人信息。对于商户的违法违规行为，我们都将严肃核实并严格处置</text>
    <text class="content content2">此投诉适用于检举商户的不合规行为。我们承诺会严格保护投诉人信息。对于商户的违法违规行为，我们都将严肃核实并严格处置</text>
  </view>

  <view class="unit">
    <view class="item">
      <text class="label">涉诉商户订单</text>
      <picker @change="changeShopOrder($event)" :value="activeOrderIdx" range-key="contactString" :range="orderList">
        <view class="value" v-if="orderList.length !== 0">
          {{ returnActiveOrderContent("orderList", "activeOrderIdx", "contactString") }}
          <image src="/static/complain/back.png" class="back-icon" />
        </view>
		<view class="value" v-else>
			暂无可选订单
		</view>
      </picker>
    </view>

    <view class="item">
      <text class="label">涉诉类型</text>
      <picker @change="event => activeTypeIdx = event.detail.value" :value="activeTypeIdx" range-key="name" :range="typeList">
        <view class="value">
          {{ returnActiveOrderContent("typeList", "activeTypeIdx", "name") }}
          <image src="/static/complain/back.png" class="back-icon" />
        </view>
      </picker>
    </view>

    <view class="item">
      <text class="label">联系电话</text>
      <input v-model="telphone" type="number" placeholder="请输入手机号" class="input" />
    </view>
  </view>

  <view class="unit unit2">
    <textarea v-model="content" placeholder="请输入详细投诉内容，包括设计的具体时间、人员、时间、金额等" class="text-area" auto-height />
  </view>

  <view class="img-list">
    <ImgUpload :limit="4" :imgList="images" @change="newV => {this.images = newV}" />
  </view>

  <BottomBtn @click="submitHandler" text="提交投诉" />
</view>
</template>

<script>
// 投诉页面
import ImgUpload from "../../components/imgUpload/imgUpload.vue"
import BottomBtn from "../../components/bottomBtn/bottomBtn.vue"
import { getZWZUserDetail, getShowLoading, getHideLoading } from "../../utils/index"

export default {
  data() {
    return {
      orderList: [], // 用户的订单列表
      activeOrderIdx: undefined, // 处于焦点状态的订单索引位置
      typeList: [], // 投诉类型，每项数据形如{ id, name }
      activeTypeIdx: undefined, // 处于焦点状态的投诉类型索引位置
      telphone: "", // 手机号
      images: [], // 投诉的描述图片
      fromOrderId: "", // 订单ID
      content: "", // 用户输入的详细投诉内容
    }
  },

  components: {
    ImgUpload,
    BottomBtn,
  },

  onLoad(opt) {
    this.fromOrderId = opt.orderId // 从上个页面带下来的订单ID
    this.fetchOrderList().finally(this.fetchTypeList)
  },

  methods: {
    /**
     * 返回选中的订单，投诉类型
     * @param {string} listKey : 列表的字段名
     * @param {string} activeKey : 处于焦点的字段名
     * @param {string} valueKey : 字段在VO中的名字
     */
    returnActiveOrderContent(listKey, activeKey, valueKey) {
      const listData = this[listKey]
      const idx = this[activeKey]
      if (listData == undefined) return "请选择"
      const activeObj = listData[idx]
      if (!activeObj) return "请选择"
      return activeObj[valueKey]
    },

    /**
     * 获取用户可进行投诉操作的订单列表数据
     */
    fetchOrderList() {
      return this.$request("hzsx/aliPay/orderComplaints/getOrderAndShopName", {}, "get", true,true).then(res => {
        const resData = res.data || [] // 用户可投诉的订单列表数据
        this.orderList = resData
        this.findActiveOrderIdxByOrderNum(resData) // 加载完订单列表数据之后，找到处于焦点的订单号
      })
    },

    /**
     * 根据订单号找到索引值
     */
    findActiveOrderIdxByOrderNum(arr) {
      if (!this.fromOrderId) return
      
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i]
        if (obj.orderId == this.fromOrderId) {
          this.activeOrderIdx = i
          return
        }
      }
    },
	
	//
	changeShopOrder(event) {
		if(this.orderList.length == 0) {
			uni.showToast({
				title:'暂无可选订单',
				icon: 'none'
			});
			return
		}
		this.activeOrderIdx = event.detail.value
	},

    /**
     * 获取涉诉类型数据
     */
    fetchTypeList() {
      return this.$request("hzsx/aliPay/orderComplaints/getOrderComplaintsTypes", {}, "get").then(res => {
        const resData = res.data || []
        this.typeList = resData
      })
    },

    /**
     * 生成提交post接口所需要的参数
     */
    returnPostObj() {
      const { userName, nickName } = getZWZUserDetail()
      const name = userName || nickName // 优先取userName字段（实名认证之后的姓名），取不到的话再取nickName，这是支付宝昵称

      const telphone = this.telphone // 用户填写的手机号
      const content = this.content

      // 获取所投诉订单的店铺id和订单id
      const orderListArray = this.orderList || []
      const activeOrderObj = orderListArray[this.activeOrderIdx] || {}
      const { shopId, orderId } = activeOrderObj

      const typeArray = this.typeList || []
      const activeTypeObj = typeArray[this.activeTypeIdx] || {}
      const { id: typeId } = activeTypeObj

      const images = this.images

      const postObj = {
        uid: this.$getUid(),
        name,
        telphone,
        content,
        shopId,
        orderId,
        typeId,
      }
      if (images && images.length) postObj.images = images

      const cnMap = { uid: "用户ID", name: "用户ID", telphone: "联系电话", content: "投诉内容", shopId: "涉诉商户", orderId: "订单ID", typeId: "涉诉类型" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)

      return {
        postData,
        pass
      }
    },

    /**
     * 监听点击提交按钮
     */
    submitHandler() {
	  if (this.orderList.length == 0) {
		  uni.showToast({
		  	title: '暂无可选订单进行投诉',
			icon: 'none'
		  })
		  return
	  }
      const { postData, pass } = this.returnPostObj()
      if (!pass) return // 缺少参数
      if (this.posting) return // 正在提交中

      this.posting = true
      getShowLoading({ title: "提交中" })
      this.$request("hzsx/aliPay/orderComplaints/addOrderComplaints", postData, "post").then(() => {
        getHideLoading()
        uni.showToast({ title: "投诉成功" })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000) // 1秒后进行页面
      }).finally(() => {
        getHideLoading()
        this.posting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background: #F7F8FB;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 150rpx;
  .header {
    height: 60rpx;
    @include global-background-color2();
    margin-bottom: 20rpx;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    .content {
      position: absolute;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
      animation-iteration-count: infinite !important;
    }
    .content1 {
      animation: scroll1 30s linear;
    }
    .content2 {
      animation: scroll2 30s linear;
    }
  }
  .unit {
    background: #fff;
    border-radius: 20rpx;
    padding: 0 30rpx;
    .item {
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .value {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        display: flex;
        align-items: center;
      }
      .back-icon {
        width: 10rpx;
        height: 16rpx;
        margin-left: 10rpx;
      }
      .input {
        text-align: right;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
  }
  .unit+.unit {
    margin-top: 20rpx;
  }
  .unit2 {
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;
    .text-area {
      box-sizing: border-box;
      min-height: 200rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
  .img-list {
    padding: 0 30rpx;
  }
}
@keyframes scroll1 {
  0% {
    left: 0;
  }
  100% {
    left: -58em;
  }
}
@keyframes scroll2 {
  0% {
    left: 58em;
  }
  100% {
    left: 0;
  }
}
</style>
