<template>
  <!-- 搜索 -->
  <view
    class="inp"
    @="$onTo(`/pages/search/search?swiperData=${swiperData}`)"
  >
    <input type="text" class="search" disabled :style="{ width: width }" />
    <image
      src="https://oss.changxiangwl.cn/api/2024-09-27/aa03677a22e24a509bd4eb720baf01de.png"
      mode="scaleToFill"
      class="icon"
    ></image>
    <swiper
      class="swiper_zi"
      vertical="true"
      autoplay="true"
      circular="true"
      interval="3000"
      @change="getItem"
    >
      <swiper-item
        v-for="(item, index) in hotList"
        :key="index"
        :item-id="item"
      >
        <view class="zimubox">
          <view class="swiper_item">{{ item }}</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
// 这个路由拦截库和小程序搭配有问题，在还没有登录时，还没有触发页面的onLoad，就已经触发了子组件的created了
export default {
  name: "swiperSearchClass",
  props: {
    width: {
      type: String,
      default: "170rpx",
    },
  },

  data() {
    return {
      hotList: [],
      swiperData: "",
    };
  },

  created() {
    // 搜索页面数据获取
    this.fetchHistorySearch().catch((err) => {
      if (err === "no uid") {
        this.eventId = this.$eventEmitter.subscribe(
          "successLoginThenReFetch",
          this.fetchHistorySearch
        ); // 登录成功时重新加载一下历史搜索数据
      }
    });
  },

  destroyed() {
    this.eventId &&
      this.$eventEmitter.removeHandler("successLoginThenReFetch", this.eventId);
  },

  methods: {
    /**
     * 请求历史搜索
     */
    fetchHistorySearch() {
      return this.$request(
        "hzsx/userWordHistory/searchPage",
        {},
        "get",
        true
      ).then((res) => {
        this.hotList = res.data?.hotSearchList || [];
        this.swiperData = res.data?.hotSearchList[0] || "";
      });
    },

    getItem(vla, it) {
      this.swiperData = this.hotList[vla.detail.current];
    },
  },
};
</script>

<style lang="scss" scoped>
.inp {
  /* background-color: #ffffff; */
  display: flex;
  // justify-content: center;
  padding-left: 100rpx;
  position: relative;
  z-index: 9999 !important;
  .search {
    width: 600rpx;
    height: 56rpx;
    // background: #f9f9f9;
    border-radius: 12rpx;
	// @include global-border2(1rpx);
    // margin: 8rpx 0 26rpx 0;
    padding: 0 60rpx;
  }
  .icon {
    width: 29rpx;
    height: 29rpx;
    position: absolute;
    top: 16rpx;
    left: 120rpx;
  }
}
.swiper_zi {
  position: absolute;
  width: 50%;
  height: 34rpx;
  top: 16rpx;
  left: 160rpx;
  .zimubox {
    height: 34rpx;
    .swiper_item {
      font-size: 24rpx;
      font-weight: 500;
      color: #ababba;
    }
  }
}
</style>
