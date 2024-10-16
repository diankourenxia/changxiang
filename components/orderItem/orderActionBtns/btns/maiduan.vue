<template>
  <!-- <view
    @click.stop="gotoMaiduanPage"
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
  >
    买断
  </view> -->
  <view
    @click.stop="gotoMaiduanPage"
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
  >
    买断
  </view>
</template>

<script>
import { checkPosition, getOrderId } from "../utils/checkShowBtn.js"

export default {
  name: "maiduan",
  
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
      return checkPosition.maiduan(this.order, this.isUsedInList)
    }
  },
  
  methods: {
    /**
    ** 点击按钮跳进行页面跳转
     */
    gotoMaiduanPage() {
      this.$onTo(`/pages/maiduan/maiduan?orderId=${getOrderId(this.order)}`)
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
