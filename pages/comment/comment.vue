<template>
<view class="comment-page-container">
  <view class="textarea-wrapper">
    <textarea
      v-model="content"
      placeholder="请留下您的宝贵意见让我们改进！"
      class="tc"
      auto-height
      maxlength="200"
      placeholder-style="color:#333;font-size:24rpx;font-weight:500;opacity:0.6;"
    />
  </view>

  <!-- 评论打星星组件 -->
  <view class="star-container">
    <text class="t1">总体</text>
    <Rate :value="starCountService" @change="starChangeHandler" />
  </view>

  <view @click="goTousuHandler" class="tousu">我要投诉</view>

  <BottomBtn @click="submitHandler" text="发表" />
</view>
</template>

<script>
// 针对小程序整体服务发表评论的页面
// 功能入口在我的页面中我的服务模块
import BottomBtn from "../../components/bottomBtn/bottomBtn.vue"
import Rate from "../../components/rate/rate.vue"
import { getZWZUserDetail } from "../../utils/index"
import { shareConfigObj } from "../../utils/constant"

export default {
  data() {
    return {
      content: "",
      starCountService: "",
      submiting: false, // 是否正在提交中
    }
  },

  components: {
    BottomBtn,
    Rate,
  },

  onShareAppMessage() {
    return shareConfigObj
  },

  methods: {
    /**
     * 修改打分的时候触发
     */
    starChangeHandler(obj) {
      this.starCountService = obj.value
    },

    /**
     * 提交的时候触发
     */
    submitHandler() {
      const { userName, nickName, telephone } = getZWZUserDetail()
      const name = userName || nickName // 优先取userName字段（实名认证之后的姓名），取不到的话再取nickName，这是支付宝昵称
      const postObj = {
        uid: this.$getUid(),
        name,
        telphone: telephone,
        content: this.content,
        starCountService: this.starCountService,
      }
      const cnMap = { uid: "用户ID", name: "用户名", telphone: "手机号码", content: "评价内容", starCountService: "评分" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return
      if (this.submiting) return
      this.submiting = true
      this.$request("hzsx/aliPay/appletsComment/addAppletsComment", postData, "post", false, true).then(res => {
        if (res.data) { // 评论成功的话才清除数据
          this.content = ""
          this.starCountService = ""
          uni.showToast({ title: "评论成功" })
          setTimeout(() => {
            uni.navigateBack()
          }, 800)
        }
      }).finally(() => {
        this.submiting = false
      })
    },

    // 跳转投诉页面
    goTousuHandler() {
      this.$onTo("/pages/complain/complain")
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-page-container {
  min-height: 100vh;
  box-sizing: border-box;
  background: #F7F8FB;
  padding-top: 20rpx;
  .textarea-wrapper {
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    background: #fff;
    .tc {
      padding: 20rpx 30rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 33rpx;
    }
  }
  .star-container {
    height: 100rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    .t1 {
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-right: 20rpx;
    }
  }
  .tousu {
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    bottom: 160rpx;
  }
}
</style>
