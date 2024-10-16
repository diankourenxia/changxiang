<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
    @click.stop="payMoneyHandler"
  >
    {{ btnTxt }}
  </view>
</template>

<script>
// 去支付 & 确认支付 按钮
import { checkPosition, checkOrderSettleNeedPay, notifyTopPageRefresh } from "../utils/checkShowBtn.js"
import { tradePay } from "../../../../utils/platform"

export default {
  name: "quzhifu",
  
  props: {
    order: {
      type: Object,
      default: {},
    }, // 订单对象
    isUsedInList: {
      type: Boolean,
      default: true,
    }, // 是否使用在订单列表页面
    userOrderCashDto: {
      type: Object,
      default: null,
    }
  },
  
  data() {
    return {}
  },

  computed: {
    position: function() {
      return checkPosition.quzhifu(this.order, this.isUsedInList)
    },
    btnTxt: function() {
      if (checkOrderSettleNeedPay(this.order)) {
        return "确认支付"
      }
      return "去支付"
    }
  },
  
  methods: {
	
	// //免押取消支付，(在走交易组件的情况下) 直接调用关单接口
	cencelOrder(postData) {
		const _this = this;
		_this.$request(
			"hzsx/api/order/userCancelOrder", {
				...postData,
				cancelReason: '免押取消支付关单'
			},
			"post"
		);
		// 告知弹窗
		uni.showModal({
			title: '取消免押支付',
			content: '您已取消支付，订单将会关闭',
			showCancel: false,
			success: function(res) {
				setTimeout(() => {
				  notifyTopPageRefresh.apply(_this) // 通知顶层页面刷新数据
				}, 1000) // 加入一点延时，避免后端接收支付宝回调不及时。若不需要，那去掉延时
			}
		});
	},
	
    /**
     * 点击去支付按钮的时候触发
     */
    payMoneyHandler() {
      const orderId = this.order && this.order.orderId
      const postObj = { orderId }
      const cnMap = { orderId: "订单ID" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return

      let url = "hzsx/api/order/userFreezeAgain"

      const isJiesuan = checkOrderSettleNeedPay(this.order)

      if (isJiesuan) { // 结算待支付时的支付
        let v
        if (this.userOrderCashDto) v = this.userOrderCashDto.settlementRent
        else v = this.order.settlementRent
        postData.amount = v
        url = "hzsx/api/order/settlement/liteUserPaySettlement"
      }

      this.$request(url, postData, "POST").then(res => {
        const resData = res.data || {}
        let data
        if (isJiesuan) data = [resData.payUrl, true] // 结算待支付时的支付
        else data = [resData.freezeAgainUrl]
        tradePay(...data).then(res => {
          this.$eventEmitter.emit("refreshMyPageConfigData") // 刷新我的页面的配置数据，使得我的订单页面中各个类型订单气泡显示对应的数字
          if (res.resultCode === "9000") { // 支付成功
            setTimeout(() => {
              notifyTopPageRefresh.apply(this) // 通知顶层页面刷新数据
              uni.showToast({ title: "支付成功" })
            }, 1000) // 加入一点延时，避免后端接收支付宝回调不及时。若不需要，那去掉延时
          }else {
			//免押取消支付，(在走交易组件的情况下) 直接调用关单接口
			this.cencelOrder(postData);
		  }
        }).catch(() => { // 支付失败
          // uni.showToast({ title: "支付失败" })
		  
		  //免押取消支付，(在走交易组件的情况下) 直接调用关单接口
		  this.cencelOrder(postData);
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.actionBtn {
		width: 138rpx;
		height: 56rpx;
		border-radius: 30rpx;
		border: 1px solid #C0C0C0; // 1rpx 在高分辨率设备上可能会遇到显示不出来的问题，所以这里改成1px
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-left: 24rpx;
		flex-shrink: 0;
		position: absolute;
	}
	
	.actionBtn0 {
		@include global-background-color2();
		color: #ffffff;
		border: none;
		right: 0;
	}
	
	.actionBtn1 {
		right: 162rpx;
	}
	
	.actionBtn2 {
		right: 324rpx;
	}
	
	.actionBtn3 {
		right: 486rpx;
	}
</style>
