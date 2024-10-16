<template>
  <view class="address">
    <view class="title">
      <view class="left">收件地址</view>
      <view class="right" @click="$onTo('pages/setAddress/setAddress')"
        >+新增地址</view
      >
    </view>
    <uni-swipe-action>
      <uni-swipe-action-item
        :right-options="options"
        @click="onClick(item.id)"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="item">
          <view @click="getAddress(item)">
            <view class="text1">
              {{ item.realname }} {{ item.telephone }}
              <text class="mr" v-if="item.isDefault">默认</text>
            </view>

            <view class="text2"
              >{{ item.provinceStr }}{{ item.cityStr }}{{ item.areaStr
              }}{{ item.street }}</view
            >
          </view>
          <image
            src="../../static/product/edi.png"
            mode="scaleToFill"
            class="iocn"
            @click="$onTo(`pages/setAddress/setAddress?id=${item.id}`)"
          ></image>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <view v-if="list.length === 0" class="wsh">
      <image
        src="../../static/product/wsh.png"
        mode="scaleToFill"
        class="img"
      ></image>
      <view class="text1"> 暂无收货地址 </view>
      <view class="text2"> 快去添加收货地址吧 </view>
    </view>
    <view style="display: flex; justify-content: center;"
      ><view class="footer" @click="alipayAddress">获取支付宝地址</view></view
    >
  </view>
</template>

<script>
import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue"
import uniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue"
export default {
  data() {
    return {
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#1F2129",
          },
        },
      ],
      list: [],
    }
  },
  components: { uniSwipeAction, uniSwipeActionItem },
  onShow() {
    this.onList()
  },
  methods: {
    onList() {
      this.$request("hzsx/userAddress/getUserAddress", {}, "get", true).then(
        (res) => {
          this.list = res.data
        }
      )
    },
    onClick(id) {
      this.$request(
        "hzsx/userAddress/deleteUserAddress",
        { id },
        "get",
        true
      ).then((res) => {
        this.onList()
      })
    },
    //获取搜获地址
    getAddress(data) {
      this.$setGlobalData("address", data)
      uni.navigateBack({
        delta: 1,
      })
    },
    //获取支付宝收货地址
    alipayAddress() {
      if (my.canIUse("getAddress")) {
        my.getAddress({
          success: (res) => {
            const obj = res.result
            if (obj) {
              this.$request(
                "hzsx/userAddress/addUserAddress",
                {
                  areaStr: obj.area,
                  cityStr: obj.city,
                  isDefault: 0,
                  provinceStr: obj.prov,
                  realname: obj.fullname,
                  street: obj.address,
                  telephone: obj.mobilePhone,
                  uid: this.$getUid(),
                },
                "post"
              ).then((res) => {
                this.onList()
              })
            }
          },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.address {
  padding-bottom: 130rpx;
  .title {
    padding: 30rpx 40rpx 34rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }
    .right {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
    }
  }
  .item {
    height: 170rpx;
    background-color: #ffffff;
    border-bottom: 1px solid #f2f2f2;
    width: 100%;
    padding-left: 28rpx;
    padding-right: 59rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text1 {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      display: flex;
      align-items: center;
    }
    .text2 {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      margin-top: 19rpx;
      width: 500rpx;
    }
    .mr {
      width: 70rpx;
      height: 34rpx;
      @include global-background-color2();
      border-radius: 17rpx;
      text-align: center;
      line-height: 34rpx;
      font-size: 22rpx;
      font-weight: 500;
      color: #ffffff;
      display: inline-block;
      margin-left: 10rpx;
    }
    .iocn {
      width: 37rpx;
      height: 36rpx;
    }
  }
  .wsh {
    text-align: center;
    .img {
      width: 230rpx;
      height: 254rpx;
      margin-top: 200rpx;
    }
    .text1 {
      font-size: 28rpx;
      margin-top: 48rpx;
      font-weight: 500;
      color: #333333;
    }
    .text2 {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 33px;
    }
  }
  .footer {
    @include global-background-color2();
    text-align: center;
    line-height: 98rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #ffffff;
    position: fixed;
    bottom: 30rpx;
    width: 690rpx;
    height: 90rpx;
    border-radius: 20rpx;
    line-height: 90rpx;
  }
}
</style>
