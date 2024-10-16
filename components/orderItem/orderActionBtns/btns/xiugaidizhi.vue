<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
    @click.stop="clickHandler"
  >修改地址</view>
</template>

<script>
// 修改地址组件
import { checkPosition, getOrderId } from "../utils/checkShowBtn"

export default {
  name: "modifyAddress",
  
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
    return {}
  },

  computed: {
    position: function() {
      return checkPosition.xiugaidizhi(this.order, this.isUsedInList)
    }
  },
  
  methods: {
    /**
     * 按钮点击跳转到修改地址页面
     */
    clickHandler: function() {
      const orderId = getOrderId(this.order)
      this.$onTo(`/pages/setAddress/setAddress?orderId=${orderId}`)
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
