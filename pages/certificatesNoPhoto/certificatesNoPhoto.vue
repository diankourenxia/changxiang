<template>
  <view class="container_cer">
    <view class="header-view"></view>
    <form report-submit="true" @submit="formSubmit">
      <view class="realName-page">
        <view class="contents">
          <view
            class="contents-item"
            style="border-radius: 20rpx 20rpx 0px 0px"
          >
            <view class="contents-item-view">
              <view>姓名</view>
              <input
                class="contents-item-input"
                placeholder="请输入姓名"
                name="userName"
              />
            </view>
          </view>
          <view
            class="contents-item"
            style="border-radius: 0px 0px 20rpx 20rpx"
          >
            <view class="contents-item-view">
              <view>身份证号</view>
              <input
                class="contents-item-input"
                placeholder="请输入身份证号码"
                name="idCard"
              />
            </view>
          </view>

          <view class="header-view"></view>
          <view
            class="contents-item"
            style="border-radius: 20rpx 20rpx 0px 0px"
          >
            <view class="contents-item-view">
              <input
                class="contents-item-input"
                placeholder="请输入手机号"
                type="number"
                name="telephone"
                style="text-align: left"
                @input="handleMobile"
                v-model="telephone"
              />
            </view>
          </view>
          <view
            class="contents-item"
            style="border-radius: 0px 0px 20rpx 20rpx"
          >
            <view class="contents-item-view">
              <view class="contents-item-inner" :style="{ flexGrow: 1 }">
                <input
                  class="contents-item-inner-input"
                  placeholder="请输入短信验证码"
                  type="number"
                  name="smsCode"
                />
                <view v-if="count" class="contents-item-inner-small">
                  {{ count }}S
                </view>
                <view class="contents-item-inner-small" v-else @click="getCode">
                  获取验证码
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="header-view"></view>
        <view class="header">温馨提示：</view>
        <view class="header"
          >请输入本人身份证信息，非本人信息无法通过审核</view
        >
        <view class="bottom-view">
          <button
            class="bottom-tobutton"
            @click="backHandler"
          >
            去上传身份证照片
          </button>
          <button form-type="submit" class="bottom-button">提交</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script>
import { shareConfigObj } from "../../utils/constant"
import { loginHandler, saveUserId } from "../../utils/index"

export default {
  data() {
    return {
      frontUrl: null,
      backUrl: null,
      identityData: {
        idCardNo: "",
        limitDate: "",
        userName: "",
      },
      codeKey: "",
      codeTime: "",
      count: 0,
      telephone: "",
    }
  },

  onLoad(e) {
    this.fromPage = e.from
  },

  onShareAppMessage() { // 禁止分享当前页面，避免提交后点击回退按钮没有反应
    return shareConfigObj
  },

  methods: {
    formSubmit: function (e) {
      const { userName, idCard, telephone, smsCode } = e.detail.value
      if (!userName) {
        uni.showToast({ title: "身份信息有误，请检查后重新上传" })
        return
      }
      if (!idCard || idCard.length !== 18) {
        uni.showToast({ title: "身份信息有误，请检查后重新上传" })
        return
      }
      if (!telephone || telephone.length !== 11) {
        uni.showToast({ title: "请输入正确的手机号" })
        return
      }
      if (!smsCode) {
        uni.showToast({ title: "请输入短信验证码" })
        return
      }
      this.$request("hzsx/userCertification/userCertificationAuth", {
        userName,
        idCard,
        telephone,
        smsCode,
        uid: this.$getUid(),
        codeKey: this.codeKey,
        codeTime: this.codeTime,
      },"post").then(res => {
        if (this.fromPage === "cyclePayment") {
          this.$onTo("/pages/cyclePaymentOrderList/cyclePaymentOrderList", false, true)
        }
        const newUid = res.data // 用户新的uid
        if (newUid) { // 更新uid，多平台渠道的话可以进行用户整合
          saveUserId(newUid) // 注意这里只更新了localStorage中单独的uid数据，并没有更新localStorage中userDetail里面的uid，所以在取uid的时候最好使用单独的uid字段
        }
        loginHandler(true, {}, null, true, false) // 实名认证后调用登录接口获取用户最新的信息然后保存到localStorage，避免实名认证后除非重新登录了否则获取不到身份证姓名的情况
        this.$eventEmitter.emit("refreshShiminRenZhengStatus") // 通知我的页面重新判断一下实名认证状态
        this.$eventEmitter.emit("refreshMyPageConfigData") // 通知我的页面重新拉取一下订单，以防止在其它平台下了单，实名认证回到我的页面订单气泡还是没变
        uni.navigateBack({ delta: 2 })
	  })
    },
    handleMobile(e) {
      this.telephone = e.detail.value
    },
    //发送验证码
    getCode() {
      //校验手机号
      if (!/^1(\d){10}$/.test(this.telephone + "")) {
        uni.showToast({ title: "请正确输入手机号" })
        return
      }
      this.$request(
        "hzsx/userCertification/sendSmsCode",
        { mobile: this.telephone },
        "get",
        true
      ).then((res) => {
        this.codeKey = res.data.codeKey
        this.codeTime = res.data.codeTime
        let count = 59
        this.count = count
        this.interval = setInterval(() => {
          count -= 1
          this.count = count
          if (count === 0) {
            clearInterval(this.interval)
          }
        }, 1000)
        uni.showToast({ title: "验证码已发送，5分钟内有效" })
      })
    },

    /**
     * 监听点击上传身份证照片
     */
    backHandler() {
      uni.navigateBack() // 关闭了分享，只有可能从这个身份证实名认证页面进入；回退可以防止页面栈中出现两个身份证实名认证页面
    }
  },
}
</script>

<style lang="scss">
.container_cer {
  @include wh(100%, 100vh);
  background: #f5f5f5;
  font-family: PingFangSC-Regular;
  padding-top: 1rpx;
  .header-view {
    height: 20rpx;
    background: #f3f4f9;
  }
  .realName-page {
    @include wh(100%, 100%);

    .contents {
      .brb {
        border-bottom: 1rpx rgba(240, 240, 240, 1) solid;
      }
      .mt20 {
        margin: 20rpx 0 0 0;
      }

      .contents-item-view {
        height: 100rpx;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        color: #333333;
        font-size: 30rpx;
        padding: 20rpx 0;
      }
      &-item {
        height: 100rpx;
        .phone-btn {
          color: #fc766b;
          font-family: PingFangSC-Regular;
          border: none;
          font-size: 30rpx;
          height: 45rpx;
          width: 200rpx;
          line-height: 45rpx;
        }
        .contents-item-input,
        .contents-item-inputs {
          text-align: right;
          padding-left: 0;
        }
        .contents-item-inner-input {
          padding-left: 0;
        }
        box-sizing: border-box;
        background-color: #fff;

        font-family: PingFangSC-Regular;
        color: #333333;
        font-size: 30rpx;
        padding: 0 30rpx;

        &-input {
          text-align: left;
          font-size: 30rpx;
          width: calc(100% - 200rpx);
        }
        &-inputs {
          text-align: left;
          font-size: 30rpx;
          width: calc(100% - 255rpx);
        }
        &-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-input {
            text-align: left;
            font-size: 30rpx;
            width: 280rpx;
          }
          &-image {
            height: 64rpx;
            width: 160rpx;
          }
          &-small {
            color: #fc766b;
            font-size: 28rpx;
          }
        }
      }
    }
    .forget {
      text-align: right;
      padding: 30rpx;
      font-family: PingFangSC-Regular;
      color: #666666;
      font-size: 26rpx;
      &-text {
        color: #fc766b;
      }
    }

    .bottom-view {
      background-color: #f3f4f9;
      box-sizing: border-box;
      padding: 304rpx 0 0 0;
      .bottom-button {
        width: 650rpx;
        height: 98rpx;
        @include global-background-color2();
        border-radius: 49rpx;
        font-family: PingFangSC-Regular;
        font-size: 34rpx;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0;
        line-height: 98rpx;
        font-weight: 700;
        margin: 0 auto;
        margin-top: 30rpx;

      }
      .bottom-tobutton {
        width: 650rpx;
        height: 98rpx;
        @include global-border2(1px);
        border-radius: 49rpx;
        font-family: PingFangSC-Regular;
        font-size: 34rpx;
        color: #333333;
        text-align: center;
        letter-spacing: 0;
        line-height: 98rpx;
        font-weight: 500;
        margin: 0 auto;
background: #f5f5f5;
      }
    }

    .bottom-view {
      font-size: 28rpx;
      color: #999;
      text-align: center;
      &-text {
        color: #00a0ff;
      }
    }
    .header {
      background: #f3f4f9;
      font-family: PingFangSC-Regular;
      font-size: 24rpx;
      color: #999999;
      letter-spacing: 0;
      font-weight: 400;
      padding: 4rpx 0 4rpx 30rpx;
    }
  }
}
</style>
