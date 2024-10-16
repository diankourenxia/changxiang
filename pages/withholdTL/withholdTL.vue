<template>
	<view class="container_cer">

		<form report-submit="true" @submit="formSubmit">
			<view class="realName-page">
				<view class="contents">
					<view class="header-view"></view>

					<view class="contents-item">
						<view class="contents-item-view">
							<view>姓名</view>
							<input class="contents-item-input" placeholder="请输入持卡人姓名" name="buyerName"
								v-model="identityData.buyerName" @input="handleName" />
						</view>
					</view>
					<view class="contents-item">
						<view class="contents-item-view">
							<view>身份证号</view>
							<input class="contents-item-input" placeholder="请输入持卡人身份证号" name="pyerIDNo" type="idcard"
								v-model="identityData.pyerIDNo" @input="handleIdNo" />
						</view>
					</view>
					<view class="contents-item">
						<view class="contents-item-view">
							<view>卡号</view>
							<input class="contents-item-input" placeholder="请输入卡号" name="buyerCardNumber"
								v-model="identityData.buyerCardNumber" type="number" @input="handleAccount" />
						</view>
					</view>
					<view class="contents-item">
						<view class="contents-item-view">
							<view>持卡类型</view>
							<picker @change="event => onIndex = event.detail.value" :value="onIndex" range-key="name"
								:range="array">
								<view class="value">
									{{ returnActiveOrderContent("array", "onIndex", "name") }}
								</view>
							</picker>
						</view>
					</view>
					<view class="contents-item">
						<view class="contents-item-view">
							<view>银行名称</view>
							<input class="contents-item-input" placeholder="请输入(示例:中国银行)" name="bankName"
								v-model="identityData.bankName" @input="handleBankName" />
						</view>
					</view>
					<view class="contents-item" v-if="onIndex == 1">
						<view class="contents-item-view">
							<view :style="{
							    display: 'flex',
							    alignItems: 'center',
							  }">
								安全码
								<image src="https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/icon-wenhao.png"
									:style="{
							      display: 'block',
							      width: '14px',
							      height: '14px',
							      marginLeft: '4px',
							    }" @click="isVisible"></image>
							</view>
							<input class="contents-item-input" placeholder="请输入信用卡安全码" name="cardCvn2"
								v-model="cardCvn2" @input="handleCvv2" />
						</view>
					</view>
					<view class="contents-item" v-if="onIndex == 1">
						<view class="contents-item-view">
							<view>信用卡到期日</view>
							<picker mode="date" start="2023-09" end="2099-12" fields="month" @change="handleDateChange">
								<input class="contents-item-input" style="width: 100%;" v-model="selectedDate"
									placeholder="请选择月份" disabled />
							</picker>
						</view>
					</view>

					<view class="header-view"></view>

					<view class="contents-item">
						<view class="contents-item-view">
							<input class="contents-item-input" placeholder="请输入银行预留手机号" type="number" name="buyerMobile"
								style="text-align: left" @input="handleMobile" v-model="buyerMobile" />
						</view>
					</view>
					<view class="contents-item" :style="{ borderBottom: 0 }">
						<view class="contents-item-view">
							<view class="contents-item-inner" :style="{ flexGrow: 1 }">
								<input class="contents-item-inner-input" placeholder="请输入短信验证码" type="number"
									name="mobileVerifyCode" />
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
				<!-- <view class="header-view"></view>
				<view class="header">温馨提示：</view>
				<view class="header">请选择以下银行卡进行签约：</view> -->
				<view class="bottom-view">
					<button form-type="submit" class="bottom-button">提交</button>
				</view>
			</view>
		</form>
		<cmd-curtain :visible="visible" mode="top-right">
			<image mode="scaleToFill"
				src="https://oss.chuangliukeji.com/backstage/2023-08-31/b865dedc4e9a43ea9737fd7c313bb0c6.png"
				style="width: 100%; height: 250px"></image>
		</cmd-curtain>
	</view>
</template>

<script>
	import {
		errHandler,
		saveUserId,
		loginHandler
	} from "../../utils/index";
	import cmdCurtain from "@/components/cmd-curtain/cmd-curtain.vue";
	import {
		shareConfigObj
	} from "../../utils/constant";
	import { bankInfo } from "../../utils/bankInfo.js";

	export default {
		data() {
			return {
				array: [{
					id: '1',
					name: '储蓄卡'
				}, {
					id: '2',
					name: '信用卡'
				}],
				onIndex: undefined, // 处于焦点状态的索引位置
				identityData: {
					uid: this.$getUid(),
					orderId: '',
					buyerName: "",
					buyerCardNumber: "",
					pyerIDNo: "",
					bankName: "", //
					bankCode: "",
				},
				cardCvn2: "", //
				selectedDate: '', // 存储选中的日期
				cardExprDt: '', //提交的有效期
				count: 0,
				buyerMobile: "",
				outTradeNo: '', // 获取短信接口所返回的数据
				visible: false,
				urlClass: 'hzsx/api/order/rusteeshipSignConfirm' //提交地址
			};
		},

		onLoad(e) {
			if (e.orderId) this.identityData.orderId = this.$getPageParams(e, 'orderId');
		},

		onShareAppMessage() {
			// 禁止分享当前页面，避免提交后点击回退按钮没有反应
			return shareConfigObj;
		},

		components: {
			cmdCurtain
		},
		methods: {
			returnActiveOrderContent(listKey, activeKey, valueKey) {
				const listData = this[listKey]
				const idx = this[activeKey]
				if (listData == undefined) return "请选择"
				const activeObj = listData[idx]
				if (!activeObj) return "请选择"
				return activeObj[valueKey]
			},
			searchCardName(e) {
				const url = 'hzsx/api/order/bankConfirm';
				const getData = {
					bankCardNo: e
				}
				this.$request(
						url,
						getData,
						"GET"
					)
					.then((res) => {
						this.identityData.bankName = bankInfo[res?.data?.bank] || '';
						this.identityData.bankCode = res?.data?.bank || '';
					})
			},
			handleName(e) {
				this.identityData.buyerName = e.detail.value;
			},
			handleAccount(e) {
				this.identityData.buyerCardNumber = e.detail.value;
				const value = e.detail.value;
				if(value.length == 16 || value.length == 19){
					this.searchCardName(value);
				}
			},
			handleBankName(e) {
				this.identityData.bankName = e.detail.value;
			},
			handleIdNo(e) {
				this.identityData.pyerIDNo = e.detail.value;
			},
			handleCvv2(e) {
				this.cardCvn2 = e.detail.value;
			},
			handleDateChange(event) {
				let value = event.detail.value;
				const [year, month] = value.indexOf('-') == -1 ? value.split('/'):value.split('-');
				this.selectedDate = `${year}-${month}`;
				this.cardExprDt = `${month}${year.slice(2)}`;
			},
			handleMobile(e) {
				this.buyerMobile = e.detail.value;
			},
			formSubmit: function(e) {
				const {
					buyerName,
					buyerCardNumber,
					pyerIDNo,
				} = this.identityData;
				const {
					mobileVerifyCode
				} = e.detail.value;
				if (!buyerName) {
					uni.showToast({
						title: "请填写正确的姓名"
					});
					return;
				}
				if (!pyerIDNo) {
					uni.showToast({
						title: "请填写正确的身份证号码",
					});
					return;
				}
				if (this.onIndex == undefined) {
					uni.showToast({
						title: "请选择持卡类型"
					});
					return;
				}
				if (!buyerCardNumber) {
					uni.showToast({
						title: "请填写正确的卡号"
					});
					return;
				}
				if (this.onIndex == 1 && !this.cardCvn2) {
					uni.showToast({
						title: "请填写安全码"
					});
					return;
				}
				if (this.onIndex == 1 && !this.cardExprDt) {
					uni.showToast({
						title: "请选择信用卡到期日"
					});
					return;
				}
				//校验手机号
				if (!/^1(\d){10}$/.test(this.buyerMobile + "")) {
					uni.showToast({
						title: "请正确输入手机号"
					});
					return;
				}
				if (!mobileVerifyCode) {
					uni.showToast({
						title: "请输入短信验证码"
					});
					return;
				}
				let postData = {};
				postData = this.onIndex == 1 ? {
					...this.identityData,
					buyerType: this.onIndex + 1,
					cardCvn2: this.cardCvn2,
					cardExprDt: this.cardExprDt,
					buyerMobile: this.buyerMobile,
					outTradeNo: this.outTradeNo,
					mobileVerifyCode
				} : {
					...this.identityData,
					buyerType: this.onIndex + 1,
					buyerMobile: this.buyerMobile,
					outTradeNo: this.outTradeNo,
					mobileVerifyCode
				};
				console.log("123", postData);
				if (this.submiting) return;
				this.submiting = true;
				const url = this.urlClass;
				this.$request(
						url,
						postData,
						"POST"
					)
					.then((res) => {
						uni.showToast({
							title: '提交成功',
							duration: 2000
						});
						setTimeout(function() {
							uni.navigateBack({
								delta: 2
							});
						}, 2000);
					})
					.finally(() => {
						this.submiting = false;
					});
			},

			//打开到期身份证示意图
			isVisible() {
				this.visible = !this.visible;
			},
			//发送验证码
			getCode() {
				const {
					buyerName,
					buyerCardNumber,
					pyerIDNo,
					bankName
				} = this.identityData;
				if (!buyerName) {
					uni.showToast({
						title: "请填写正确的姓名"
					});
					return;
				}
				if (!pyerIDNo) {
					uni.showToast({
						title: "请填写正确的身份证号码",
					});
					return;
				}
				if (this.onIndex == undefined) {
					uni.showToast({
						title: "请选择持卡类型"
					});
					return;
				}
				if (!bankName) {
					uni.showToast({
						title: "请填写正确的银行名称"
					});
					return;
				}
				if (!buyerCardNumber) {
					uni.showToast({
						title: "请填写正确的卡号"
					});
					return;
				}
				if (this.onIndex == 1 && !this.cardCvn2) {
					uni.showToast({
						title: "请填写安全码"
					});
					return;
				}
				if (this.onIndex == 1 && !this.cardExprDt) {
					uni.showToast({
						title: "请选择信用卡到期日"
					});
					return;
				}
				//校验手机号
				if (!/^1(\d){10}$/.test(this.buyerMobile + "")) {
					uni.showToast({
						title: "请正确输入手机号"
					});
					return;
				}
				// 校验银行卡名称是否能用
				const postData = {
					bankName,
					buyerType: this.onIndex + 1,
				};
				this.$request(
					"hzsx/api/order/confirmBankType",
					postData,
					"get"
				).then((resBankType) => {
					if(resBankType?.data == false){
						uni.showToast({
							title: "该银行不支持代扣，请更换!"
						});
						return;
					}
					// 发送验证码
					let data = {};
					data = this.onIndex == 1 ? {
						...this.identityData,
						buyerType: this.onIndex + 1,
						cardCvn2: this.cardCvn2,
						cardExprDt: this.cardExprDt,
						buyerMobile: this.buyerMobile
					} : {
						...this.identityData,
						buyerType: this.onIndex + 1,
						buyerMobile: this.buyerMobile
					};
					this.$request(
						"hzsx/api/order/trusteeshipSign",
						data,
						"post"
					).then((res) => {
						if (res?.data?.ysepay_trusteeship_sign_response?.code !== '10000') {
							uni.showToast({
								title: "系统异常,稍后重试"
							});
							return
						}
						this.outTradeNo = res?.data?.ysepay_trusteeship_sign_response?.out_trade_no || ''; // 提交身份证信息的时候需要用到验证码数据
						let count = 59;
						this.count = count;
						this.interval = setInterval(() => {
							count -= 1;
							this.count = count;
							if (count === 0) {
								clearInterval(this.interval);
							}
						}, 1000);
						uni.showToast({
							title: "验证码已发送，10分钟内有效"
						});
					});
				});
			},
		},
	};
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

		.toOther {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 30rpx;
			width: 750rpx;
			height: 100rpx;
			@include global-background-color();
			font-size: 28rpx;
			color: #333333;
			font-weight: 400;
			margin-bottom: 20rpx;

			.toOtherBtn {
				width: 150rpx;
				height: 50rpx;
				border-radius: 49rpx;
				background: #1f2129;
				box-shadow: 0px 2px 4px 0px rgba(252, 73, 93, 0.5);
				font-size: 24rpx;
				@include global-color();
				font-weight: 400;
				line-height: 50rpx;
				text-align: center;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			background: #fff;
			box-sizing: border-box;
			padding: 20rpx 0;
			border-radius: 20rpx;

			.item {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				position: relative;
				background: #f7f8fa;
				border-radius: 10rpx;
				width: 691rpx;
				height: 307rpx;
				margin: 10rpx auto;
				box-sizing: border-box;
				padding: 30rpx 34rpx;

				.item-l {
					.item-l-title {
						font-family: PingFangSC-Medium;
						font-size: 38rpx;
						color: #333333;
						font-weight: bold;
						margin-bottom: 10rpx;
					}

					.item-l-text {
						font-family: PingFangSC-Regular;
						font-size: 24rpx;
						color: #586e98;
						font-weight: 400;
					}
				}

				.update {
					@include wh(370rpx, 243rpx);
					background: #e0f0ff;
					display: flex;
					align-items: center;
					justify-content: center;

					.update-border {
						width: 336rpx;
						height: 218rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: url("https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/man-bg.png") no-repeat;
						background-size: 100% 100%;
					}
				}

				.update-img {
					@include wh(322rpx, 204rpx);
				}
			}
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

				.imgss {
					width: 22rpx;
					height: 22rpx;
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

					.value {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						display: flex;
						align-items: center;
					}

					.picker {
						font-size: 28rpx;
						text-align: center;
					}
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

			.xieyi {
				margin: 60rpx 30rpx 20rpx 30rpx;
				font-size: 24rpx;
				color: #999;

				.libs {
					display: flex;

					margin: 0 auto;
					justify-content: center;

					.img {
						@include wh(25rpx, 25rpx);
						margin: 2rpx 5rpx 0 0;
					}
				}

				.checkbox-text {
					.text {
						color: #c43737;
					}
				}
			}

			.bottom-view {
				background-color: #f3f4f9;
				box-sizing: border-box;
				padding: 80rpx 0 30rpx 0;
			}

			.bottom-button {
				width: 650rpx;
				height: 98rpx;
				@include global-background-color();
				border-radius: 49rpx;
				font-family: PingFangSC-Regular;
				font-size: 34rpx;
				color: #333333;
				text-align: center;
				letter-spacing: 0;
				line-height: 98rpx;
				font-weight: 700;
				margin: 0 auto;
			}

			.disabled {
				background-color: #c43737;
				opacity: 0.64;
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