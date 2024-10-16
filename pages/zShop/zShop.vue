<template>
  <view class="zshop">
    <view class="top">
      <view class="title"> 江小租 </view>
    </view>
    <view class="content">
      <view class="title"> 江小租诚邀你的加入 </view>
      <view class="biaot">
        <view v-for="(item, index) in biaotList" :key="index" class="item">
          <image :src="item.img" mode="scaleToFill" class="s" />
          <view class="t">
            {{ item.value }}
          </view>
        </view>
      </view>
    </view>
    <view class="form">
      <form @submit="formSubmit">
        <view v-for="(item, index) in intList" :key="index" class="inp">
          <input
            type="text"
            :name="item.name"
            class="search"
            :placeholder="item.placeholder"
          />
          <image :src="item.icon" mode="scaleToFill" class="icon"></image>
        </view>
        <button form-type="submit" class="submit">申请入驻</button>
      </form>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      biaotList: [
        {
          img: "../../static/shop/ll.png",
          value: "平台流量扶持",
        },
        {
          img: "../../static/shop/ydy.png",
          value: "一对一服务",
        },
      ],
      intList: [
        {
          icon: "../../static/shop/dp.png",
          placeholder: "请输入店铺名称",
          name: "shopName",
        },
        {
          icon: "../../static/shop/sj.png",
          placeholder: "请输入联系电话",
          name: "telephone",
        },
      ],
    };
  },
  methods: {
    formSubmit({ detail: { value } }) {
      if (!value.shopName) {
        uni.showToast({ title: "请输入店铺名称" });
        return;
      }

      if (value.telephone.length !== 11) {
        uni.showToast({ title: "请输入正确的手机号" });
        return;
      }
      this.$request("hzsx/shop/settle/add", value, "post", false, true).then(
        (res) => {
          console.log(res);
          uni.showToast({ title: "提交成功" });
        }
      );
    },
  },
};
</script>

<style lang="scss">
.zshop {
  .top {
    @include bg("../../static/shop/top.png");
    width: 100%;
    height: 680rpx;
    .title {
      width: 314rpx;
      height: 80rpx;
      background: #ffffff;
      border-radius: 0px 0px 30rpx 30rpx;
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      text-align: center;
      line-height: 80rpx;
      margin: 0 auto;
    }
  }
  .content {
    width: 670rpx;
    height: 276rpx;
    background: #ffffff;
    box-shadow: 0px 2rpx 24rpx 0px rgba(0, 0, 0, 0.1);
    border-radius: 40rpx;
    margin: 0 auto;
    margin-top: -113rpx;
    .title {
      width: 384rpx;
      height: 80rpx;
      background: linear-gradient(180deg, #ffd358 0%, #fd9602 100%);
      border-radius: 0px 0px 30rpx 30rpx;
      font-size: 36rpx;
      font-weight: 500;
      color: #ffffff;
      margin: 0 auto;
      text-align: center;
      line-height: 80rpx;
    }
    .biaot {
      display: flex;
      justify-content: space-around;

      .item {
        text-align: center;
        .s {
          width: 60rpx;
          height: 60rpx;
          margin: 30rpx 0;
        }
        .t {
          font-size: 28rpx;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  .form {
    width: 670rpx;
    height: 462rpx;
    background: #ffffff;
    box-shadow: 0px 2rpx 24rpx 0px rgba(0, 0, 0, 0.1);
    border-radius: 40rpx;
    margin: 0 auto;
    margin-top: 40rpx;
    .inp {
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      position: relative;
      .search {
        width: 400rpx;
        border-radius: 35rpx;
        margin-top: 40rpx;
        padding: 0 100rpx;
        height: 86rpx;
        background: #f7f8fa;
        border-radius: 8px;
      }
      .icon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        top: 65rpx;
        left: 65rpx;
      }
    }
    .submit {
      width: 540rpx;
      height: 80rpx;
      background: #ffd358;
      box-shadow: 0px 10rpx 20rpx 0px rgba(255, 203, 57, 0.4);
      border-radius: 20rpx;
      line-height: 80rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 0 auto;
      margin-top: 50rpx;
    }
  }
}
</style>
