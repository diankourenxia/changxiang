<template>
  <view class="goodsList">
    <view class="commodity">
      <view>
        <view class="commodity_list" v-for="(item, index) in list" :key="index">
          <ProductItem
            v-if="index % 2 === 0"
            :productObj="item"
            :showXinjiu="false"
            :showTag="true"
          >
            <XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
          </ProductItem>
        </view>
      </view>
      <view>
        <view class="commodity_list" v-for="(item, index) in list" :key="index">
          <ProductItem
            v-if="index % 2 !== 0"
            :productObj="item"
            :showXinjiu="false"
            :showTag="true"
          >
            <XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
          </ProductItem>
        </view>
      </view>
    </view>
    <view class="placeholder" v-if="list.length === 0">
      <image
        src="../../static/product/xjsp.png"
        mode="scaleToFill"
        class="img"
      ></image>
      <view class="title"> 暂无商品 </view>
      <view class="fu"> 去其他类目看看吧 </view>
      <view class="an" @click="$onTo('/pages/classified/classified', true)">
        去逛逛
      </view>
    </view>
  </view>
</template>

<script>
import ProductItem from "../../components/productItem/productItem.vue";
import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue";
export default {
  data() {
    return {
      pageNumber: 0,
      pageSize: 10,
      list: [],
      total: 0,
      content: "",
      name: "",
    };
  },
  onLoad(e) {
    this.name = this.$getPageParams(e, "name");
    this.content = this.$getPageParams(e, "content");

    uni.setNavigationBarTitle({
      title: this.name,
    });

    this.onQuery();
  },
  onReachBottom() {
    if (this.total <= 10) {
      uni.showToast({
        title: "没有更多啦～",
      });
      return;
    }
    this.onQuery();
  },
  components: {
    ProductItem,
    XinjiuSlot,
  },
  methods: {
    //搜索页面商品列表
    onQuery() {
      if (this.pageNumber * this.pageSize - this.total >= 10) {
        uni.showToast({
          title: "没有更多啦～",
        });
        return;
      }
      this.pageNumber += 1;
      if (this.name === "更多") {
        this.$request(
          "hzsx/aliPay/product/liteIndexMore",
          {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          },
          "get",
          false,
          true
        ).then((res) => {
          this.list = this.list.concat(res.data.records || []);
          this.total = res.total;
        });
      } else {
        this.$request(
          "hzsx/aliPay/product/searchProduct",
          {
            content: this.content,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            uid: this.$getUid(),
          },
          "post",
          false,
          true
        ).then((res) => {
          this.list = this.list.concat(res.records || []);
          this.total = res.total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.goodsList {
  padding-top: 20rpx;
  // background: linear-gradient(#17355b, #9acbd0);
  // min-height: 100vh;
  .commodity {
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    .commodity_list {
      break-inside: avoid;
      width: 344rpx;
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
      color: #fff;
      margin: 0 auto;
      margin-top: 30rpx;
    }
  }
}
</style>
