<template>
  <image :src="returnImgSrc()" class="paiLogo"></image>
</template>

<script>
// 奖牌slot

export default {
  name: "jiangpai",
  
  data() {
    return {}
  },
  
  props: {
    role: {
      type: String,
      default: "金", // 可选值为金、银、铜
    }, // 表明是什么奖牌
  },
  
  methods: {
    /**
     * 返回奖牌的属性
     */
    returnImgSrc() {
      const imgMap = {
        "金": "/static/productItemComponents/jingpai.png",
        "银": "/static/productItemComponents/yingpai.png",
        "铜": "/static/productItemComponents/tongpai.png",
      }
      return imgMap[this.role] || ""
    }
  }
}
</script>

<style lang="scss">
.paiLogo {
  width: 46rpx;
  height: 56rpx;
  position: relative;
  left: 18rpx;
  top: 0;
}
</style>
