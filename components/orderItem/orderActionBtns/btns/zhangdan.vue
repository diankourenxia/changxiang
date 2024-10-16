<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
    @click.stop="clickHandler"
  >账单</view>
</template>

<script>
// 账单按钮组件
import { checkPosition, getOrderId } from "../utils/checkShowBtn"
import { billDetailGlobalKey } from "../../../../utils/constant"

export default {
  name: "zhangdan",
  
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
    }, // 商品对象
  },
  
  data() {
    return {}
  },

  computed: {
    position: function() {
      return checkPosition.zhangdan(this.order, this.isUsedInList)
    }
  },

  methods: {
    /**
     * 按钮的点击处理方法
     */
    clickHandler() {
      this.$setGlobalData(billDetailGlobalKey, this.product || this.order) // 将商品数据保存到全局
      const isFromOrderDetail = !!this.product ? 1 : 0 // 判断是否是在订单详情页面点的查看账单按钮
      this.$onTo(`/pages/billDetail/billDetail?orderId=${getOrderId(this.order)}&fromOrderDetail=${isFromOrderDetail}`)
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
