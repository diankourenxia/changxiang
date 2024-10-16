<template>
  <view class="pageWrapper">
    <!-- 搜索组件 -->
    <swiper-search width="600rpx" />

    <!-- 店铺信息展示区域 -->
    <view class="topWrapper">
      <view class="left">
        <image :src="shopObj.logo" class="logo" />
        <view class="nameWrapper">
          <view class="p1">Hello, 欢迎您～</view>
          <view class="p2">{{ shopObj.name }}</view>
        </view>
      </view>

      <view class="right">
        <image class="icon" src="https://oss.zwzrent.com/buer/shop-icon.png" />
        <text>已缴纳保证金</text>
      </view>
    </view>

    <!-- banner图轮播区域 -->
    <view v-if="bannerList.length" class="banner">
      <swiper
        class="swiperbanner"
        @change="changeBannerIdxHandler"
        :current="bannerCurrentIdx"
        autoplay
        circular
      >
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <image
            lazy-load="true"
            :src="item.imgSrc"
            mode="scaleToFill"
            class="swiperbanner-item"
            @click="$onTo(item.jumpUrl)"
          ></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品展示区域 -->
    <view class="productWrapper">
      <view class="title">全部商品</view>
      <ProductFlow :productList="getProductList()" :showXinjiuSlot="false" />
    </view>
  </view>
</template>

<script>
// 店铺页面
// 增加搜点击搜索框到达现有的search页面，注意这个搜索并不需要区别只搜索本店铺商品
import { shareConfigObj } from "../../utils/constant";
import SwiperSearch from "@/components/swiper-search/swiper-search.vue";
import ProductFlow from "../../components/productFlow/productFlow.vue";
import {
		shopMaiDianHandler
	} from "../../utils/index";

export default {
  data() {
    return {
      shopId: "", // 商家ID
      bannerList: [], // banner列表数据
      productPage: {}, // 商品数据
      shopObj: {}, // 店铺详情数据
      pageNumber: 1,
      pageSize: 10,
      bannerCurrentIdx: 0, // 当前轮播banner的顺序索引
    };
  },

  components: {
    SwiperSearch,
    ProductFlow,
  },

  onLoad(e) {
    this.shopId = this.$getPageParams(e, "shopId");
    this.fetchKeyDataHandler(); // 加载关键数据的处理方法
	// 店铺渠道
	const dianpuId = this.$getPageParams(e, "subDianpuChannelId"); // 店铺渠道功能
	// const dianpuId = '25207e208cdd70e410b926347ead6b1808ede668';
	if (dianpuId) {
		this.$setGlobalData("subDianpuChannelId", dianpuId); // 存储到全局
		shopMaiDianHandler(); // 进行埋点上传
	}
  },

  // 滚动到了底部的时候触发
  onReachBottom() {
    const currentPage = this.pageNumber; // 当前加载到的数据的页码
    const totalPage = this.productPage?.pages; // 总页数数据
    if (currentPage >= totalPage) {
      // 已经到最后1页了
      uni.showToast({ title: "没有更多数据了", icon: "none" });
      return;
    }
    this.pageNumber = this.pageNumber + 1;
    this.fetchConfigObjHandler();
  },

  // 分享该页面仍旧到达店铺页面
  onShareAppMessage() {
    return {
      ...shareConfigObj,
      path: `pages/shops/index?shopId=${this.shopId}`, // 分享出去后仍旧打开当前店铺页面
    };
  },

  methods: {
    /**
     * 获取商品列表数据
     */
    getProductList() {
      return this.productPage?.records || [];
    },

    /**
     * 加载关键数据
     */
    fetchKeyDataHandler() {
      uni.showLoading({ title: "加载中" });
      const p = [
        this.fetchBannerListHandler(),
        this.fetchConfigObjHandler(false),
      ];
      Promise.all(p).then(() => {
        uni.hideLoading();
      });
    },

    /**
     * 加载banner列表数据
     */
    fetchBannerListHandler() {
      return this.$request(
        "hzsx/aliPay/product/queryOpeIndexShopBannerList",
        { shopId: this.shopId },
        "get"
      ).then((res) => {
        this.bannerList = res || [];
      });
    },

    /**
     * 加载店铺的详情数据以及店铺商品数据
     */
    fetchConfigObjHandler(showLoading = true) {
      const url = "hzsx/aliPay/product/selectShopProductListAndShopV1";
      const postData = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        shopId: this.shopId,
      };
      showLoading && uni.showLoading({ title: "加载中" });
      return this.$request(url, postData, "get")
        .then((res = {}) => {
          this.shopObj = res.shop || {}; // 店铺配置信息数据
          this.productPageGenerator(res.productPage || {});
        })
        .then(() => {
          showLoading && uni.hideLoading();
        });
    },

    /**
     * 返回新的页码数据
     */
    productPageGenerator(productPageObj) {
      const originData = this.productPage;
      if (originData.records) {
        // 是进行拼接
        const newObj = {
          ...originData,
          records: originData.records.concat(productPageObj.records || []),
        };
        this.productPage = newObj;
      } else {
        // 是第一页数据
        this.productPage = productPageObj;
      }
    },

    /**
     * 改变显示banner的时候触发
     */
    changeBannerIdxHandler(e) {
      this.bannerCurrentIdx = e.detail.current;
    },
  },
};
</script>

<style lang="scss" scoped>
.pageWrapper {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;
  padding-top: 0;
  background: #fafafa;
  .topWrapper {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .left {
      flex-grow: 1;
      display: flex;
      align-items: center;
      .logo {
        width: 84rpx;
        height: 84rpx;
        margin-right: 12rpx;
      }
      .nameWrapper {
        .p1 {
          font-size: 32rpx;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #333333;
          line-height: 44rpx;
          margin-bottom: 2rpx;
        }
        .p2 {
          font-size: 24rpx;
          font-family: PingFang-SC-Light, PingFang-SC;
          font-weight: 300;
          color: #333333;
          line-height: 34rpx;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #333333;
      .icon {
        width: 28rpx;
        height: 28rpx;
        margin-right: 10rpx;
      }
    }
  }
  .banner {
    .swiperbanner-item {
      width: calc(100vw - 48rpx);
      height: 254rpx;
      border-radius: 4rpx;
      display: block;
    }
  }
  .productWrapper {
    .title {
      height: 88rpx;
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
