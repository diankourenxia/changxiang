<template>
  <view>
    <view class="collection quanpinquanjiao" v-if="list.length">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="$onTo(`/pages/product/product?productId=${item.productId}`)"
      >
        <view class="left">
          <image :src="item.image" mode="scaleToFill" class="img"></image>
        </view>
        <view
        
          class="right"
          :style="{
            paddingBottom: list.length-1 === index ? 0 : null,
            borderBottom: list.length- 1 === index ? '0px solid #f2f2f2' : null,
          }"
        >
          <view class="content1">
            <view class="title">
              <text class="title-tops">{{
                getOldNewText(item.oldNewDegree)
              }}</text>
              {{ item.name }}
            </view>
            <view class="fu"> {{ item.collectNum }}人收藏 </view>
          </view>
          <view class="content2">
            <view class="texts">
              <text class="m">¥</text>
              <text class="l">{{ getPartMoney(true, item.minPrice) }}</text>
              <text class="d">.</text>
              <text class="r">{{ getPartMoney(false, item.minPrice) }}</text>
              <text class="r">/天</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="placeholder" v-if="list.length === 0">
      <image
        src="../../static/product/collection.png"
        mode="scaleToFill"
        class="img"
      ></image>
      <view class="title"> 暂无收藏 </view>
      <view class="fu"> 一个收藏都没有 </view>
      <view class="an" @click="$onTo('/pages/classified/classified', true)">
        去逛逛
      </view>
    </view>
  </view>
</template>

<script>
import { OLD_NEW_MAP, EMPTY_PLACEHOLDER } from "../../utils/constant.js"
export default {
  data() {
    return {
      list: [],
    }
  },
  onShow() {
    this.$request(
      "/hzsx/userCollection/getProductCollection",
      {},
      "get",
      true,
      true
    ).then((res) => {
      this.list = res.data || []
    })
  },
  methods: {
    getOldNewText(oldNewDegree) {
      const level = parseInt(oldNewDegree) // 新旧程度标识
      return OLD_NEW_MAP[level] || EMPTY_PLACEHOLDER
    },
    /**
     * 获取金额的小数点前、后的数据
     * @param {Boolean} isFront : 是否是前半部分
     */
    getPartMoney(isFront, price) {
      const _price = price || ""
      if (!_price) return EMPTY_PLACEHOLDER
      const list = _price.toString().split(".")
      const result = isFront ? list[0] : list[1]
      return result || 0
    },
  },
}
</script>

<style lang="scss" scoped>
.collection {
  margin-top: 20rpx;
  background-color: #ffffff;
  padding: 20rpx 0 20rpx 30rpx;
  .item {
    display: flex;
    margin-bottom: 20rpx;
    .left {
      width: 180rpx;
      height: 180rpx;
      margin-right: 46rpx;
      .img {
        width: 180rpx;
        height: 180rpx;
      }
    }
    .right {
      height: 180rpx;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 20rpx;
      width: 100%;
      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 45rpx;
        word-break: break-all;
        padding-top: 20rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #333333;
        .title-tops {
          height: 45rpx;
          font-size: 22rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 45rpx;
          padding: 2rpx 5rpx 2rpx 5rpx;
          @include global-background-color2();
          border-radius: 5rpx;
          margin-right: 8rpx;
          margin-bottom: 3rpx;
        }
      }

      .fu {
        font-size: 22rpx;
        font-weight: 400;
        color: #999999;
        line-height: 30rpx;
        margin-top:20rpx;
      }
      .content2 {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        .texts {
          color: #e43d3d;
          .m {
            font-size: 20rpx;
            margin-right: 6rpx;
          }
          .l {
            font-size: 32rpx;
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
      }
    }
  }
}
.placeholder {
  text-align: center;
  padding-top: 300rpx;
  .img {
    width: 230rpx;
    height: 253rpx;
  }
  .title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    margin-top: 46rpx;
  }
  .fu {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    margin-top: 10rpx;
  }
  .an {
    width: 138rpx;
    height: 56rpx;
    line-height: 56rpx;
    @include global-background-color2();
    border-radius: 43rpx;
    text-align: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #ffffff;
    margin: 0 auto;
    margin-top: 30rpx;
  }
}
</style>
