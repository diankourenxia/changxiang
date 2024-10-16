<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
    @click.stop="clickHandler"
  >
    归还
  </view>
</template>

<script>
// 归还按钮
import { checkPosition, getOrderId } from "../utils/checkShowBtn.js"
import { sendbackPageProductGlobalKey } from "../../../../utils/constant"

export default {
  name: "guihuan",
  
  props: {
    order: {
      type: Object,
      default: {},
    }, // 订单对象
    isUsedInList: {
      type: Boolean,
      default: true,
    }, // 是否使用在订单列表页面
    product: {
      type: Object,
      default: null,
    }
  },

  data() {
    return {}
  },

  computed: {
    position: function() {
      return checkPosition.guihuan(this.order, this.isUsedInList)
    }
  },
  
  methods: {
    /**
     * 点击按钮时的回调方法
     */
    clickHandler() {
      this.$setGlobalData(sendbackPageProductGlobalKey, this.product || this.order) // 将商品数据保存到全局，供归还页面反显商品信息数据
      this.$onTo(`/pages/sendback/sendback?orderId=${getOrderId(this.order)}`)
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
