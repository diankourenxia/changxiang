<template>
  <view class="commodityCls">
    <view>
      <view
        class="commodity_list"
        v-for="(item, index) in leftProducts"
        :key="index"
      >
        <ProductItem
          :productObj="item"
          :showXinjiu="false"
          :showTag="true"
          :needMaidian="needUploadEvent"
          :tabName="tabName"
          :sortIdx="returnSortIdx(true, index)"
          :showXinJiuInTopRight="showXinjiuSlot"
        />
      </view>
    </view>
    <view>
      <view
        class="commodity_list"
        v-for="(item, index) in rightProducts"
        :key="index"
      >
        <ProductItem
          :productObj="item"
          :showXinjiu="false"
          :showTag="true"
          :needMaidian="needUploadEvent"
          :tabName="tabName"
          :sortIdx="returnSortIdx(false, index)"
          :showXinJiuInTopRight="showXinjiuSlot"
        />
      </view>
    </view>
  </view>
</template>

<script>
// 商品瀑布流组件
import ProductItem from "../productItem/productItem.vue"

export default {
  name:"productFlow",

  data() {
    return {}
  },

  components: {
    ProductItem,
  },

  computed: {
    // 左侧商品列表
    leftProducts: function() {
      const arr = this.productList || []
      return arr.filter((_, i) => i % 2 == 0)
    },

    // 右侧商品列表
    rightProducts: function() {
      const a2 = this.productList || []
      return a2.filter((_, i) => i % 2 != 0)
    }
  },

  props: {
    productList: {
      type: Array,
      default: [],
    }, // 产品列表

    showXinjiuSlot: {
      type: Boolean,
      default: true,
    }, // 是否显示新旧标签

    needUploadEvent: {
      type: Boolean,
      default: false,
    }, // 是否需要上传埋点数据

    tabName: {
      type: String,
      default: "",
    }, // 菜单名，用于首页点击商品时的埋点，非必传，大部分使用场景都不用传
  },

  methods: {
    /**
     * 返回商品出现的位置
     * @param {bool} isLeft : 是否出现在左边位置
     * 0 0 -> 1 2 ; vLeft = idx(0) * 2 + 1; vRight = vLeft + 1
     * 1 1 -> 3 4 ; vLeft = idx(1) * 2 + 1; vRight = vLeft + 1
     * 2 2 -> 5 6 ; vLeft = idx(2) * 2 + 1; vRight = vLeft + 1
     */
    returnSortIdx(isLeft, idx) {
      const vLeft = idx * 2 + 1
      if (isLeft) return vLeft
      return vLeft + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.commodityCls {
  display: flex;
  justify-content: space-between;
  .commodity_list {
    break-inside: avoid;
    width: 344rpx;
  }
}
</style>
