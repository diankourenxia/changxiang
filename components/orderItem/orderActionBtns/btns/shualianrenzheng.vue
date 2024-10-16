<template>
  <view
    @click.stop="clickShualianBtnHandler"
    :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
    v-if="$orderModuleShowActionBtn(position)"
  >
    刷脸认证
  </view>
</template>

<script>
// 刷脸认证按钮
import { checkPosition, getOrderId, notifyTopPageRefresh } from "../utils/checkShowBtn"
import { startAPVerify } from "../../../../utils/platform"

export default {
  name: "shualianrenzheng",

  data() {
    return {}
  },

  props: {
    order: {
      type: Object,
      default: {},
    }, // 订单对象
    isUsedInList: {
      type: Boolean,
      default: true,
    }, // 是否使用在订单列表页面
  },

  computed: {
    position: function() {
      return checkPosition.shualianrenzheng(this.order, this.isUsedInList)
    }
  },

  methods: {
    /**
     * 监听点击刷脸认证按钮
     */
    clickShualianBtnHandler() {
      if (this.fetching) return // 已经处于请求中状态
      this.fetching = true
      const postObj = { orderId: getOrderId(this.order) }
      const cnMap = { orderId: "订单ID" }
      const { postData, pass } = this.$postDataGuard(postObj, cnMap)
      if (!pass) return // 缺少了订单ID参数
      // 首先获取刷脸链接以及id
      this.$request("hzsx/api/order/getFaceAuthCertifyUrl", { ...postData, uid: this.$getUid()}, "post").then(res => {
        const faceParamsData = res.data
        return faceParamsData
      }).then(faceParams => {
        // 然后接着利用接口返回的参数唤醒支付宝的人脸
        return startAPVerify(faceParams).then(verifyResult => {
          // 参考老版本的逻辑是不论人脸认证成功与否，都将人脸结果上报给后端了；但是对于简版小程序来说，问过后端之后只有成功时才需要调用
          if (verifyResult.resultStatus === "9000") { // 表明刷脸认证成功
            // 在然后把人脸验证结果同步给后端
            const cid = verifyResult && verifyResult.result && verifyResult.result.certifyId
            if (!cid) return
            const queryData = { certifyId: cid, passed: true }
            return this.$request("hzsx/api/components/faceAuthInitAsync", queryData, "get").then(() => {
              notifyTopPageRefresh.apply(this)
              uni.showToast({ title: "认证成功" })
              return
            })
          }
        })
      }).finally(() => {
        this.fetching = false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
	.actionBtn {
		width: 138rpx;
		height: 56rpx;
		border-radius: 30rpx;
		border: 1px solid #C0C0C0; // 1rpx 在高分辨率设备上可能会遇到显示不出来的问题，所以这里改成1px
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-left: 24rpx;
		flex-shrink: 0;
		position: absolute;
	}
	
	.actionBtn0 {
		@include global-background-color2();
		color: #ffffff;
		border: none;
		right: 0;
	}
	
	.actionBtn1 {
		right: 162rpx;
	}
	
	.actionBtn2 {
		right: 324rpx;
	}
	
	.actionBtn3 {
		right: 486rpx;
	}
</style>