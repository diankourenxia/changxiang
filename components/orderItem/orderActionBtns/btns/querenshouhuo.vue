<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
    @click.stop="showDialog = true"
  >
    确认收货
    <Dialog
      v-if="showDialog"
      content="确认已收到商品？"
      @cancel="showDialog = false"
      @ok="submitHandler"
    />
  </view>
</template>

<script>
// 确认收货按钮
import { checkPosition, getOrderId, notifyTopPageRefresh } from "../utils/checkShowBtn.js"
import Dialog from "../../../dialog/dialog.vue"

export default {
  name: "querenshouhuo",
  
  components: {
    Dialog,
  },

  props: {
    order: {
      type: Object,
      default: {},
    }, // 订单对象
    isUsedInList: {
      type: Boolean,
      default: true,
    }, // 是否使用在订单列表页面
  },
  
  data() {
    return {
      showDialog: false, // 是否显示弹窗
      submiting: false, // 是否正在提交中
    }
  },

  computed: {
    position: function() {
      return checkPosition.querenshouhuo(this.order, this.isUsedInList)
    }
  },
  
  methods: {
    /**
     * 确定收货的回调方法
     */
    submitHandler() {
      const postObj = { orderId: getOrderId(this.order) }
      const cnMap = { orderId: "订单ID" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return // 缺少了订单ID

      if (this.submiting) return // 正在请求中
      this.submiting = true
      this.$request("hzsx/api/order/userConfirmReceipt", postData, "POST").then(() => {
        notifyTopPageRefresh.apply(this)
        uni.showToast({ title: "操作成功" })
      }).finally(() => {
        this.submiting = false
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
