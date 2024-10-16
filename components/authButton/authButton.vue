<template>
	<view class="wrapper">
    <button
      v-if="!checkHasUserinfo"
      class="btn"
      open-type="getAuthorize"
      @getAuthorize="onGetUserInfo"
      hover-class="none"
      scope="userInfo"
    >
      <!-- 要渲染出来的实际内容 -->
      <slot name="content"></slot>
    </button>

    <slot v-else name="content"></slot>
	</view>
</template>

<script>
/**
** 授权用户昵称以及头像等基本信息的按钮
** 授权成功之后，需重新调用一下登录接口将用户数据保存到服务端
*/
import { loginHandler, checkHasUserBasicInfo } from "../../utils/index"

export default {
  name:"authButton",

  data() {
    return {
      checkHasUserinfo: false, // 判断是否存在头像、昵称数据
    }
  },

  props: {
    needRefresh: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    needRefresh: function() { // 解除了授权信息时需要让子组件重新变为可进行授权，避免在我的页面（已授权，用户信息也存在），然后在该页面进行解除授权操作，此时在点击却不是进行授权的问题
      this.checkHasUserinfo = !!checkHasUserBasicInfo()
    }
  },

  mounted() {
    this.checkHasUserinfo = !!checkHasUserBasicInfo()
  },

  methods: {
    /**
    * 获取用户信息的回调
    */
    onGetUserInfo() {
      // #ifdef MP-ALIPAY
      my.getOpenUserInfo({
        fail: () => {
          uni.showToast({ title: "授权失败，请重新打开小程序进行尝试" })
        },
        success: (res) => {
          const userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
          const obj = {}
          const keys = ["avatar", "city", "gender", "nickName", "province"]
          keys.forEach(k => {
            const v = userInfo && userInfo[k]
            v && (obj[k] = v)
          })
          
          // 接下来进行登录流程, 没有传入的字段并不会将其覆盖更新为空
          loginHandler(true, obj, this.successLoginHandler, true)
        },
      })
      // #endif
    },

    /**
     * 成功登录之后的回调方法
     */
    successLoginHandler() {
      this.checkHasUserinfo = !!checkHasUserBasicInfo()
      this.$emit("successAuth")
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  .btn {
    height: auto;
    border: none;
    min-height: 100rpx;
    line-height: 1em !important;
    background: inherit !important;
  }
}
</style>
