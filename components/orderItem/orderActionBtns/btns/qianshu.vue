<template>
	<view
	  :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
	  
	  v-if="$orderModuleShowActionBtn(position)"
	  @click.stop="clickHandler"
	>签约代扣</view>
	<!-- <view
	  :class="{actionBtn: true, actionBtn0: position == 0, actionBtn1: position == 1, actionBtn2: position == 2, actionBtn3: position == 3 }"
	  style="width:178rpx ;"
	  v-if="$orderModuleShowActionBtn(position)"
	  @click.stop="clickHandler"
	>蚂蚁链合同签约</view> -->
</template>

<script>
	import { checkPosition, getOrderId } from "../utils/checkShowBtn"
	import { getAppId } from "@/utils/platform.js"
	export default {
		name: "qianshu",
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
		    return checkPosition.qianshu(this.order, false, this.orderDeatil)
		  }
		},
		methods: {
			// clickHandler () {
			// 	let mylContractSignUrl = this.orderDeatil && this.orderDeatil.userOrdersDto.mylContractSignUrl
			// 	// 使用 scheme 跳转小程序
			// 	function navigateToMiniProgramScheme({ scheme, success, fail }) {
			// 	  var { params, message } = schemeToParams(scheme);
			// 	  if (params) {
			// 	    my.navigateToMiniProgram({ ...params, success, fail });
			// 	  } else {
			// 	    fail && fail({ error: -1, errorMessage: `无效的小程序 scheme ${scheme}: ${message}` });
			// 	  }
			// 	}
			// 	// 将 scheme 转换为 my.navigateToMiniProgram 的参数
			// 	function schemeToParams(scheme) {
			// 	  if (!scheme.startsWith('alipays:')) {
			// 	    return { message: '! 非 alipays: 开头' };
			// 	  }
			// 	  var params = {};
			// 	  var parseQuery = (str) => {
			// 	    return str.replace(/^.*?\?/, '').split('&').map(s => {
			// 	      var p = s.includes('=') ? s.indexOf('=') : s.length;
			// 	      return [s.slice(0, p), s.slice(p + 1)].map(decodeURIComponent);
			// 	    });
			// 	  };
			// 	  for (var [k, v] of parseQuery(scheme)) {
			// 	    if (k == 'appId') {
			// 	      if (v.length != 16) {
			// 	        return { message: `! 非 16 位 appId '${v}'` };
			// 	      }
			// 	    } else if (k == 'page') {
			// 	      k = 'path';
			// 	    } else if (k == 'query') {
			// 	      var o = {};
			// 	      for (var [x, y] of parseQuery(v)) {
			// 	        o[x] = y;
			// 	      }
			// 	      v = o;
			// 	    } else {
			// 	      return { message: `! 不支持参数 '${k}' ` };
			// 	    }
			// 	    params[k] = v;
			// 	  }
			// 	  return { params };
			// 	}
			// 	var scheme = mylContractSignUrl
			// 	navigateToMiniProgramScheme({
			// 	  scheme,
			// 	  fail: (res) => my.alert({ title: 'navigateToMiniProgramScheme failed', content: JSON.stringify(res) }),
			// 	});
			// },
			
			// 通联代扣签署
			// clickHandler(){
			// 	const id = this.order.orderId;
			// 	this.$onTo(`pages/withholdTL/withholdTL?orderId=${id}`);
			// },
			
			/**
			 * 银行卡-蚂蚁链签署 
			 */
			clickHandler () {
				// contractDeductSignStatus 蚂蚁链签署状态：1为待签署
				if (this.orderDeatil.userOrdersDto.contractDeductSignStatus == 1) {
					// let mylContractSignUrl = this.orderDeatil && this.orderDeatil.userOrdersDto.mylContractSignUrl;
					const { env, signerId } = this.orderDeatil;
					const { flowId } = this.orderDeatil.userOrdersDto;
					my.navigateTo({
					  url: `plugin://esign/esign?env=${env}&flowId=${flowId}&signerId=${signerId}&skipResult=true&`,
					})
				}
				// 银行卡签约
				if (this.orderDeatil.userOrdersDto.ysStatus == 1){
					const id = this.order.orderId;
					this.$onTo(`pages/withholdTL/withholdTL?orderId=${id}`);
				}
				
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
