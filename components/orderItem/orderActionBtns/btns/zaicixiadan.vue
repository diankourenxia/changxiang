<template>
  <view
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position, isUsedInMore)"
    @click.stop="clickHandler"
  >
    再次下单
  </view>
  <view v-else />
</template>

<script>
// 再次下单按钮
import { checkPosition } from "../utils/checkShowBtn.js"

export default {
  name: "zaicixiadan",
  
  props: {
    order: {
      type: Object,
      default: {},
    }, // 订单对象
    isUsedInMore: {
      type: Boolean,
      default: false,
    }, // 是否使用在省略号这里
    product: {
      type: Object,
      default: null,
    }, // 商品对象数据
  },
  
  data() {
    return {}
  },

  computed: {
    position: function() {
      return checkPosition.zaicixiadan(this.order)
    }
  },
  
  methods: {
    /**
     * 按钮的点击处理事件
     * 需要注意的地方：如果是使用在订单详情页面的话，那么order对象上面没有商品ID数据
     */
    clickHandler() {
      const productObj = this.product || this.order || {} // 优先取product对象
      const { productId } = productObj
      if (!productId) return
      this.$onTo(`/pages/product/product?productId=${productId}`)
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
