<template>
  <view class="tag">{{ getTagName() }}</view>
</template>

<script>
// 新旧slot
import { OLD_NEW_MAP, EMPTY_PLACEHOLDER } from "../../../utils/constant.js"

export default {
  name: "xinjiuSlot",

  props: {
    productObj: {
      type: Object,
      default: {}
    }, // 商品描述数据
  },
  
  data() {
    return {
      corlo:"#9acbd0"
    }
  },
  
  methods: {
    getTagName() {
      const level = this.productObj.oldNewDegree // 新旧程度标识
      return OLD_NEW_MAP[level] || EMPTY_PLACEHOLDER
    }
  }
}
</script>

<style lang="scss">
.tag {
  // height: 36rpx;
  // line-height: 36rpx;
  // @include global-background-color2();
  width: 84rpx;
  height: 38rpx;
  background: url('https://oss.changxiangwl.cn/api/2024-09-29/d87897e48c374ce987f4913b56468a5b.png');
  background-size: 100% 100%;
  // padding: 4rpx 16rpx;
  font-size: 22rpx;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 38rpx;
  // border-radius: 20rpx 0rpx 100rpx 0rpx;
  box-sizing: border-box;
}
</style>
