<template>
	<view
	  :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
	  style="width:158rpx ;"
	  v-if="$orderModuleShowActionBtn(position)"
	  @click.stop="clickHandler"
	>查看代扣合同</view>
</template>

<script>
	import { checkPosition, getOrderId } from "../utils/checkShowBtn"
	import { getAppId } from "@/utils/platform.js"
	export default {
		name: "daikouhetong",
		data() {
			return {
				
			}
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
		  product: {
		    type: Object,
		    default: null,
		  }, // 商品对象
		  orderDeatil: {
		    type: Object,
		    default: null,
		  }
		},
		computed: {
		  position: function() {
		    return checkPosition.daikouhetong(this.order, this.isUsedInList, this.orderDeatil)
		  }
		},
		methods: {
			clickHandler () {
				const postData = {
					orderId: this.order.orderId
				}
				this.$request("hzsx/api/order/contractDocument", postData, "POST").then(res => {
				  const resData = res.data || {}
				console.log(resData)
				this.openPDF(resData.docs[0].fileUrl)
				}).finally(() => {
				})
			},
			openPDF(url) {
			  uni.downloadFile({
			    url,
			    success: function (res) {
			      let filePath = res.tempFilePath;
			      uni.openDocument({
			        filePath: filePath,
			        fileType: "pdf",
			        success: function (res) {},
			      });
			    },
			  });
			},
		}
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
