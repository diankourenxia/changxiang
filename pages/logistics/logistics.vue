<template>
  <view>
    <view class="express">
      <view class="item" style="margin: 0">
        配送快递：
        <text style="font-weight: 700; margin-left: 10rpx">{{ companyName }}</text>
      </view>
      <view class="item">
        订单编号：
        <text style="font-weight: 700; margin-left: 10rpx">{{ wuliuNo }}</text>
        <text class="copy" @click="copy(wuliuNo)">复制</text>
      </view>
    </view>
    <!-- 收货地址 -->
    <view class="content">
      <view>
        <view class="flex list">
          <view class="time"></view>
          <view class="info"><view class="title">[收货地址]</view></view>
        </view>
        <view class="flex list" v-for="(item, index) in wuliuList" :key="index">
          <view :class="{ one: index === 0, info: true }">
            <view
              class="title address"
              :style="{
                color: index !== 0 ? '#999' : '#333',
              }"
            >
              {{ item.remark }}
              <view class="time">{{ item.datetime }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      wuliuDetailData: {}, // /api/order/userGetExpressByOrderId接口所返回的物流信息数据
    }
  },

  onLoad(e) {
    if (this.$checkIsPageLessParameter(e, ["orderId"])) return // 如果URL传参没有订单ID，那么做出提示
    this.orderId = e?.orderId
    this.fetchWuliuDetail()
  },

  computed: {
    // 物流公司
    companyName: function() {
      return this.wuliuDetailData?.company || ""
    },

    // 物流编号
    wuliuNo: function() {
      return this.wuliuDetailData?.no || ""
    },

    // 物流列表数据
    wuliuList: function() {
      return this.wuliuDetailData?.list || []
    }
  },

  methods: {
    //复制
    copy(oId) {
      if (!oId) return
      uni.setClipboardData({
        data: oId,
        success: function () {
          uni.showToast({ title: "复制成功", icon: "success" })
        },
      })
    },

    /**
     * 加载物流信息数据
     */
    fetchWuliuDetail() {
      this.$request(`hzsx/api/order/userGetExpressByOrderId?orderId=${this.orderId}`, {}, "GET", false, true).then(res => {
        const resData = res.data
        if (!resData?.result) {
          uni.showModal({
            title: "提示",
            content: resData?.reason,
            showCancel: false,
          })
        }
        this.wuliuDetailData = resData?.result || {}
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: row;
}
.express {
  border-radius: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  margin-top: 20rpx;
  .item {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-top: 30rpx;
  }
  .copy {
    border-radius: 14rpx;
    border: 1rpx solid #333333;
    font-size: 18rpx;
    font-weight: 400;
    color: #333333;
    display: inline-block;
    text-align: center;
    margin-left: 20rpx;
    padding: 1px 5px;
  }
}
//收货地址
.content {
  margin-top: 20rpx;
  border-radius: 20rpx;
  padding: 20rpx 40rpx 0;
  background-color: #fff;
  .list {
    &:first-child {
      .info::before {
        bottom: -20rpx;
        margin-top: 40rpx;
        border-left: 1px solid #e5e5e5;
      }

      .title {
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        line-height: 40rpx;
        &::before {
          width: 42rpx;
          height: 42rpx;
          left: -21rpx;
          background: url("../../static/express/express.png") no-repeat center;
          background-size: 42rpx 42rpx;
        }
      }
    }

    &:last-child {
      .info::before {
        height: 10rpx;
      }
    }
  }

  .info {
    position: relative;
    color: #999;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      width: 0;
      border-left: 1px solid #e5e5e5;
    }
    &.one {
      .title {
        &::before {
          content: "";
          position: absolute;
          left: -2px;
          top: 0;
          bottom: 0;
          z-index: 1;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          @include global-background-color();
        }
      }
      &.address {
        color: #333333;
      }
    }

    .title {
      position: relative;
      margin-bottom: 54rpx;
      padding-left: 32rpx;
      font-size: 24rpx;
      font-weight: 400;
      line-height: 33rpx;
      &::before {
        content: "";
        position: absolute;
        left: -2px;
        top: 0;
        bottom: 0;
        z-index: 1;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #cecece;
      }

      &.address {
        font-size: 24rpx;
        color: #999999;
      }
      .time {
        font-weight: 500;
        color: #848484;
        line-height: 33rpx;
      }
    }
  }
}
</style>
