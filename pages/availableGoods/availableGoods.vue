<template>
  <view>
    <view class="productList">
      <view v-for="(obj, idx) in list" :key="idx" class="product-item">
        <ProductItem :productObj="obj" :showTag="true" :isWaterfallFlow="false">
          <XinjiuSlot slot="topLeft" :productObj="obj"></XinjiuSlot>
        </ProductItem>
      </view>
    </view>
  </view>
</template>

<script>
import ProductItem from "../../components/productItem/productItem.vue"
import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue"
export default {
  data() {
    return {
      list: [],
      pageNumber: 0,
      pageSize: 10,
      total: 0,
      templateId: null,
    }
  },
  components: {
    ProductItem,
    XinjiuSlot,
  },
  onLoad(e) {
    this.templateId = e.id
    this.getList()
  },
  onReachBottom() {
    if (this.total <= 10) {
      uni.showToast({
        title: "没有更多啦～",
      })
      return
    }
    this.getList()
  },
  methods: {
    getList() {
      if (this.pageNumber * this.pageSize - this.total >= 10) {
        uni.showToast({
          title: "没有更多啦～",
        })
        return
      }
      this.pageNumber += 1
      this.$request("/hzsx/lite/couponCenter/getCouponProduct", {
        templateId: this.templateId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      },"get",true,true).then((res) => {
        this.list = this.list.concat(res.data.records || [])
        this.total = res.data.total
      })
    },
  },
}
</script>

<style lang="scss" >
.productList {
  padding: 20rpx;
  column-count: 2;
  column-gap: calc(100% - 344rpx * 2);
  .product-item {
    width: 344rpx;
    break-inside: avoid; // 这个属性很重要，可以避免首位塌陷
  }
}
</style>
