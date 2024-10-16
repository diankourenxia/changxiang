<template>
	<view class="">
		<web-view :src="link" id="webview" @message="onWebviewMessage"></web-view>
		<!-- <web-view src="https://h5.asign.cn/web/short/y2ueEb303179" id="webview" @message="onWebviewMessage"></web-view> -->
	</view>

</template>

<script>
	import { request } from "@/utils"
	export default {
		data(){
			return {
				orderId:'',//订单id
				link:'',//链接
				productId:"",
				shopId:'',
				amount:''
			}
		},
		onLoad(e) {
			this.orderId = this.$getPageParams(e,'orderId');
			this.productId = this.$getPageParams(e,'productId');
			this.shopId = this.$getPageParams(e,'shopId');
			this.amount = this.$getPageParams(e,'amount');
			this.selectFashionList();
		},
		methods:{
			// e签宝链接
			selectFashionList(){
				const id = this.orderId;
				const productId = this.productId;
				const shopId = this.shopId;
				const amount = this.amount;
				// return request("/hzsx/liteUserOrders/getFlowUrl",{'orderId':id},//e签宝
				return request("/hzsx/liteUserOrders/getAqFlowUrl",{'orderId':id,'shopId':shopId,'productId':productId,'amount':amount},//爱签宝
				"GET", true, true).then(res=>{
					this.link = res.data;
				})
			},
			onWebviewMessage(message) {
				
			    console.log('onWebviewMessage>>>>>2', message)
			    const { detail: { type, token, url ,authFlowId} } = message
			    //授权认证流程才返回authFlowId
			    if (type === 'IDENTITY_ALI_FACE_AWAKE') {
			      my.startAPVerify({
			      url,
			      certifyId: token,
			      success: function (res) {
			        console.log('success', res)
			      },
			      fail: function (res) {
			        console.log('fail', res)
			      },
			      complete: function (res) {
			        console.log('complete', res)
			      }
			    })
			    return
			    }
			    if (type === 'WILL_DONE') {
			      console.log('WILL_DONE>>do something')
			
			      return
			    }
			    if (type === 'RN_DONE') {
			      console.log('RN_DONE>>do something')
			    
			      return
			    }
			    if (type === 'E_AUTH_FINISHED') {
			      console.log('RN_DONE>>do something')
			      console.log("authFlowId",authFlowId)
			      // 要跳转的页面或进行其他操作
			// my.navigateTo({
			//   url: '/pages/index/index',
			//   });
			      return
			    }
			},
			
		}
	}
</script>

<style>
</style>