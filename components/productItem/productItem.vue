<template>
  <view class="product-wrapper" @click="onTo">
    <!-- 左上角的插槽，内容交给父组件来自定义 -->
    <view class="top-left"><slot name="topLeft"></slot></view>

    <!-- 商品图 -->
    <image
      lazy-load="true"
      mode="scaleToFill"
      :src="productObj.image || productObj.imageSrc || productObj.src"
      class="product-img"
    ></image>

    <!-- 商品名区域 -->
    <view
      class="productName-area plr20"
      :style="{
        height: isWaterfallFlow ? '' : '76rpx',
      }"
    >
      <!-- 新旧标签区域 -->
      <template v-if="showXinjiu">
        <text class="xinjiuTag">{{ getOldNewText() }}</text>
      </template>
      <text class="product-name">{{ productObj[productNameKey] }}</text>
    </view>

    <!-- 商品标签区域 -->
    <view v-if="checkIsShowTagList()" class="bottomTag plr20">
      <text v-for="(tag, idx) in productObj.labels" :key="idx" class="tagItem">
        {{ tag }}
      </text>
    </view>

    <!-- 最底部的商品价格区域 -->
    <view class="price-area plr20">
      <view class="left">
        <text class="m">¥</text>
        <text class="l">{{ getPartMoney(true) }}</text>
        <text class="d">.</text>
        <text class="r">{{ getPartMoney(false) }}</text>
        <text class="r">/天</text>
      </view>
      <view class="right" v-if="productObj.minRentCycle">{{ productObj.minRentCycle}}天起租</view>
    </view>
  </view>
</template>

<script>
// 商品组件
import { OLD_NEW_MAP, EMPTY_PLACEHOLDER } from "../../utils/constant.js";
export default {
  name: "productItem",

  props: {
    productObj: {
      type: Object,
      default: {},
    }, // 商品描述对象
    showXinjiu: {
      type: Boolean,
      default: true,
    }, // 是否在商品名的前面显示新旧程度
    showTag: {
      type: Boolean,
      default: false,
    }, // 是否在商品名的下一行显示商品标签
    //判断瀑布流
    isWaterfallFlow: {
      type: Boolean,
      default: true,
    },
    productNameKey: {
      type: String,
      default: "name",
    }, // 商品名所对应的字段名称
  },

  data() {
    return {
      cl: "fcc",
    };
  },

  methods: {
    /**
     * 获取新旧程序的标识
     */
    getOldNewText() {
      const level = this.productObj.oldNewDegree; // 新旧程度标识

      return OLD_NEW_MAP[level] || EMPTY_PLACEHOLDER;
    },
    //跳转商品页
    onTo() {
      this.$onTo(
        `/pages/product/product?productId=${
          this.productObj.productId || this.productObj.itemId
        }`
      );
    },
    /**
     * 获取金额的小数点前、后的数据
     * @param {Boolean} isFront : 是否是前半部分
     */
    getPartMoney(isFront) {
      const price = String(
        this.productObj.price ||
          this.productObj.lowestSalePrice ||
          this.productObj.minPrice ||
          ""
      ); // 接口返回的价格不一定是字符串，所以这里做一个强制转换
      if (!price) return EMPTY_PLACEHOLDER;
      const list = price.split(".");
      const result = isFront ? list[0] : list[1];
      return result || 0;
    },

    /**
     * 判断是否显示商品标签列表数据，即取决于父组件props，也取决于是否存在数据
     */
    checkIsShowTagList() {
      const labels = this.productObj.labels;
      return this.showTag && labels && labels.length;
    },
  },
};
</script>

<style lang="scss">
.product-wrapper {
  background: #ffffff;
  border-radius: 20rpx;
  position: relative;
  margin-bottom: 16rpx;
  padding-bottom: 20rpx;
  // box-shadow: 0rpx 0rpx 20rpx #445668;
  .top-left {
    position: absolute;
    z-index: 3;
  }
  .plr20 {
    padding-left: 20rpx;
    padding-right: 20rpx;
    box-sizing: border-box;
  }
  .product-img {
    width: 344rpx;
    height: 344rpx;
    background: #ffffff;
    margin-bottom: 10rpx;
    border-radius: 0.2rem 0.2rem 0 0;
  }
  .productName-area {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-bottom: 10rpx;
    .xinjiuTag {
      height: 28rpx;
      line-height: 28rpx;
      @include global-background-color();
      border-radius: 5rpx;
      padding: 0 6rpx;
      padding-left: 10rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-right: 10rpx;
    }
    .product-name {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      font-family: Arial;
      word-break: break-all;
    }
  }
  .bottomTag {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 10rpx;
    .tagItem {
      height: 30rpx;
      line-height: 30rpx;
      border-radius: 5rpx;
      border: 1px solid #e52021;
      font-size: 22rpx;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #e52021;
      padding: 0 4rpx;
      margin-right: 10rpx;
      margin-bottom: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .price-area {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    .left {
      color: #e52021;
      .m {
        font-size: 20rpx;
        margin-right: 6rpx;
      }
      .l {
        font-size: 38rpx;
        font-weight: 500;
      }
      .d {
        font-size: 36rpx;
      }
      .r {
        font-size: 20rpx;
        font-weight: 500;
      }
    }
    .right {
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      margin-bottom: 3rpx;
    }
  }
}
</style>
