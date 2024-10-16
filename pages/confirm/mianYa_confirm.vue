<template>
	<view class="confirm">
		<!-- 收货地址，续租功能不展示 -->
		<view v-if="notXuzuFeature()" class="quanpinquanjiao address fxpad" @click="umenPlus1()">
			<view class="left" v-if="address">
				<view class="item1">
					{{ address.realname }}
					{{ address.telephone }}
				</view>
				<view class="item2">
					{{ address.provinceStr }}{{ address.cityStr }}{{ address.areaStr
          }}{{ address.street }}
				</view>
			</view>
			<view v-else class="left2">
				<image style="width: 36rpx; height: 36rpx; margin-right: 10rpx" src="../../static/product/diz.png"
					mode="scaleToFill"></image>
				请填写收货地址
			</view>
			<image mode="scaleToFill" class="iocn" src="../../static/my/jiantou.png"></image>

			<image src="../../static/product/dw.png" mode="scaleToFill" class="bottom-backgroind"></image>
		</view>

		<!-- 商品描述 -->
		<view class="quanpinquanjiao product-wrapper">
			<image :src="productDescDetail.productImage" class="product-img" />
			<view class="desc">
				<view class="product-name">{{ productDescDetail.productName }}</view>
				<view class="sku">规格：{{ productDescDetail.specName }}</view>
				<view class="rent">
					<text class="text1">首期租金</text>
					<text class="text2">￥{{ orderPrices.firstPeriodsRentPrice }}</text>
				</view>
			</view>
		</view>

		<!-- 优惠券，续租功能不展示 -->
		<view v-if="notXuzuFeature()" class="coupon quanpinquanjiao fxpad">
			<view class="item1">优惠券</view>
			<view class="item2" @click="$refs.couponList.show()">
				<text class="text" v-if="!reduction">{{ orderCouponLength }}张可用</text>
				<text v-else class="text2">{{ reduction }}</text>
				<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
			</view>
		</view>

		<!-- 增值服务 -->
		<view class="container quanpinquanjiao" v-if="services.length">
			<view v-for="(item, index) in services" :key="index" class="item fxpad">
				<view class="left">
					{{ item.shopAdditionalServices.name }}
					<image @click="getServicesData(item.shopAdditionalServices)" src="../../static/product/sm.png"
						mode="scaleToFill" class="sm"></image>
				</view>
				<view class="right">
					￥{{ item.shopAdditionalServices.price }}
					<image src="/static/orderList/inactive.png" :class="{
              checkIcon: true,
              hide:
                servicesId.findIndex(
                  (id) => id === item.shopAdditionalServices.id
                ) > -1,
            }" @click="addSrvicesId(item.shopAdditionalServices.id)" style="margin-left: 10rpx" />
					<image src="/static/orderList/active.png" @click="deleteSrvicesId(item.shopAdditionalServices.id)"
						style="margin-left: 10rpx" :class="{
              checkIcon: true,
              hide:
                servicesId.findIndex(
                  (id) => id === item.shopAdditionalServices.id
                ) === -1,
            }" />
				</view>
			</view>
		</view>

		<!-- 订单金额等一些数据的展示 -->
		<view class="container quanpinquanjiao">
			<view class="item fxpad" v-if="orderPrices.otherPeriodsPrice && notXuzuFeature()">
				<view class="left leftBold">首期实付</view>
				<view class="right" @click="$refs.eachIssue.show()">
					￥{{ orderPrices.firstPeriodsPrice }}
				</view>
			</view>
			<view class="item fxpad" v-if="orderPrices.otherPeriodsPrice && notXuzuFeature()">
				<view class="left">剩余租金计划</view>
				<view class="right" @click="$refs.eachIssue.show()">
					￥{{ orderPrices.otherPeriodsPrice }}*{{ orderPrices.restPeriods }}期
					<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
				</view>
			</view>
			<view class="item fxpad" v-if="productDescDetail.isBuyOutSupported">
				<!-- <view class="left">到期买断价</view> -->
				<view class="left">到期价</view>
				<view class="right">￥{{ orderPrices.expireBuyOutPrice }}</view>
			</view>
			<view class="item fxpad">
				<view class="left">总租金</view>
				<view class="right">￥{{ orderPrices.totalRent }}</view>
				<!-- <view class="right">￥{{ orderPrices.orderAmount }}</view>  这个是算上增值服务的总租金-->
			</view>
			<view v-if="notXuzuFeature()" class="item fxpad">
				<view class="left">运费</view>
				<view class="right">{{
          freightType[productDescDetail.productFreightType]
        }}</view>
			</view>
			<!-- <view class="item fxpad">
				<view class="left">
					商品押金
					<text class="futit">凭芝麻信用最高可全免</text>
				</view>
				<view class="right">￥{{ orderPrices.depositAmount }}</view>
			</view> -->
		</view>
		<!-- 实名认证 -->
		<view class="authentication quanpinquanjiao fxpad" v-if="!loadingShiming && !hasCertification">
			<view>实名认证</view>
			<view class="item2" @click="umenPlus2()">
				<text>请认证</text>
				<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
			</view>
		</view>
		<!-- 芝麻免押 -->
		<view class="container quanpinquanjiao">
			<view class="item fxpad">
				<view class="left leftBlock">
					<view class="zMBox">
						<image class="zMLogo" src="https://oss.chuangliukeji.com/backstage/2024-04-15/7bb84939225a413d9088111dbc567da4.jpg" mode="widthFix"></image>
						<text class="zMtext1">芝麻信用 | 免押金</text>
						<text class="zMtext2">芝麻分≥550可享</text>
					</view>
					<view style="font-size: 20rpx;">
						点击下方“去免押”, 最高可全免
					</view>
				</view>
				<view class="rightBlock">
					<view>￥{{ orderPrices.depositAmount }}</view>
					<view class="rightBlockToip">99.16%用户可全免</view>
				</view>
			</view>
		</view>
		<!-- 留言 -->
		<view class="message quanpinquanjiao">
			<input placeholder="买家留言" class="text-area" @input="getRemark" />
		</view>
		<!-- 协议 -->
		<view class="agreement">
			<image src="/static/orderList/active.png" :class="{
          checked: true,
          hide: !isChecked,
        }" mode="scaleToFill" @click="getChecked"></image>
			<image :class="{
          checked: true,
          hide: isChecked,
        }" src="/static/orderList/inactive.png" mode="scaleToFill" @click="getChecked"></image>
			<text @click="seeXieyiHandler">我已阅读并同意签署<text class="xieyi">《租赁服务协议》</text></text>
		</view>
		<!-- 底部支付 -->
		<view class="footer">
			<!-- ==========需求-为了展示押金的1元 -->
			<view class="left" v-if="orderPrices.otherPeriodsPrice && notXuzuFeature()">
				首期实付:
				<view class="price-area">
					<view class="left">
						<text class="m">¥</text>
						<!-- <text class="l">0</text>
						<text class="d">.</text>
						<text class="r">00</text> -->
						<!-- <text class="l">{{getPartMoney(true, orderPrices.depositAmount)}}</text>
						<text class="d">.</text>
						<text class="r">{{getPartMoney(false, orderPrices.depositAmount)}}</text> -->
						<text class="l">{{getPartMoney(true, orderPrices.firstPeriodsPrice)}}</text>
						<text class="d">.</text>
						<text class="r">{{getPartMoney(false, orderPrices.firstPeriodsPrice)}}</text>
					</view>
				</view>
			</view>
			<!-- ========================= -->
			<view class="left" v-else>
				实付金额:
				<view class="price-area">
					<view class="left">
						<text class="m">¥</text>
						<text class="l">{{
              getPartMoney(true, orderPrices.firstPeriodsPrice)
            }}</text>
						<text class="d">.</text>
						<text class="r">{{
              getPartMoney(false, orderPrices.firstPeriodsPrice)
            }}</text>
					</view>
				</view>
			</view>
			<!-- <view class="right" @click="gotoAddress"> 确认支付 </view> -->
			<view class="right" @click="gotoAddress"> 去免押 </view>
			<!-- <button class="right" open-type="getAuthorize" scope="phoneNumber" @getAuthorize="onGetPhone" @error="handleAuthError">
				确定支付
			</button> -->
			<!-- 信用授权支付 -->
		</view>
		<!-- 增值服务详情 -->
		<wyb-popup ref="serviceDetails" type="bottom" width="500" radius="6" :showCloseIcon="true"
			:title="serviceDetailsTitle" bgColor="rgba(247, 248, 251, 1)">
			<view class="servicesContent">{{ serviceDetailsContent }}</view>
		</wyb-popup>
		<!--  -->
		<wyb-popup ref="eachIssue" type="bottom" width="500" radius="6" :showCloseIcon="true" title="租金支付计划"
			bgColor="rgba(247, 248, 251, 1)">
			<view class="eachIssueTitle">可提前主动支付</view>
			<view class="eachIssue">
				<view class="item" v-for="(item, index) in orderPrices.orderByStagesDtoList" :key="index">
					<view class="mark" v-if="index === 0">今日支付</view>
					<view class="text1">第{{ item.currentPeriods }}期</view>
					<view class="text2">￥{{ item.currentPeriodsRent }}</view>
					<view class="text3">{{ item.statementDate }}</view>
				</view>
			</view>
		</wyb-popup>
		<!-- 可用优惠券 -->
		<wyb-popup ref="couponList" type="bottom" width="500" radius="6" :showCloseIcon="true" title="可用优惠券"
			bgColor="rgba(247, 248, 251, 1)">
			<view class="coupons">
				<view class="coupon-item" v-for="(item, index) in orderCouponList" :key="index"
					@click="onIsCheck(index, item)">
					<view class="item-left" v-if="item.discountRate == null">
						<view>
							<view class="title">
								<text style="font-size: 24rpx">￥</text>
								{{ item.discountAmount }}
							</view>
						</view>
						<view class="item-content">
							<view class="title" v-if="item.scene !== 'FIRST_MONTH_FIXED_COUPON'">
								满{{ item.minAmount }}减{{ item.discountAmount }}
							</view>
							<view class="title" v-else>
								首月定额{{ item.discountAmount }}元
							</view>
							<view class="fu">{{ item.endTime }}到期</view>
						</view>
					</view>
					<view class="item-left" v-else>
						<view>
							<view class="title">{{ item.discountRate }}
								<text style="font-size: 24rpx">折</text>
							</view>
						</view>
						<view class="item-content">
							<view class="title">
								满{{ item.minAmount }}打{{ item.discountRate }}折
							</view>
							<view class="fu">{{ item.endTime }}到期</view>
						</view>
					</view>

					<view class="item-right">
						<image src="/static/orderList/inactive.png" :class="{
                checkIcon: true,
                hide: item.check,
              }" />
						<image src="/static/orderList/active.png" :class="{
                checkIcon: true,
                hide: !item.check,
              }" />
					</view>
				</view>
			</view>
		</wyb-popup>
		<XieYiComp v-if="productId || xuzuGlobalData.detailDto.productId" :show="showXieyiModal" :productId="productId || xuzuGlobalData.detailDto.productId"
			:xYReqParams="xYData" @hide="showXieyiModal = false" @ok="xieyiOkHandler" />
	</view>
</template>

<script>
	import {
		getZWZUserDetail,
		checkHasPhone,
		loginHandler,
		returnChannelId,
		backUserUpload
	} from "@/utils/index.js";
	import {
		tradePay,
		startAPVerify
	} from "@/utils/platform.js";
	import wybPopup from "@/components/wyb-popup/wyb-popup.vue";
	import {
		xYUrl
	} from "../../utils/constant";
	import XieYiComp from "../../components/xieyiComp/index.vue";
	export default {
		data() {
			return {
				duration: 1, //	租用天数
				skuId: 42819, //商品规格ID
				orderCouponLength: 0, //优惠券多少条
				orderCouponList: [], //优惠券列表
				reduction: 0, //优惠券减免
				services: [], //增值服务列表
				servicesId: [], //增值服务列表id
				serviceDetailsTitle: "", //增值服务标题
				serviceDetailsContent: "", //增值服务内容
				freightType: {
					//运费类型判断
					FREE: "商家包邮",
					PAY: "用户支付",
					SELF: "自提",
				},
				orderLocationAddress: {}, //地址信息
				antiCheatingLevel: "", //营销反作弊字段
				nsfLevel: "", //用户风险
				couponId: "", //优惠券code
				isChecked: false, //是否签署协议
				//需要重新渲染数据
				orderPrices: {}, //金额数据
				address: {}, //收货地址
				remark: "", //用户留言
				hasCertification: false, //是否实名认证过
				loadingShiming: true, // 正在加载实名认证信息
				isXuzu: false, // 判断是续租
				productDescDetail: {}, // 商品描述对象
				xuzuGlobalData: {}, // 续租功能的hzsx/api/orderRelet/userOrderReletConfirm接口所返回的数据
				showXieyiModal: false, // 是否显示协议模态
				isAgree: false, // 是否同意协议
				xYData: {},
				productId: "",
				orderIdEZB: '', //用于e租宝的订单id
				choiceTime: '', //起租时间
				servicesIdCons: 0, //为了增值服务的记录次数
				userAuth:'',//权限
			};
		},
		components: {
			wybPopup,
			XieYiComp,
		},
		onLoad(e) {
			this.productId = this.$getPageParams(e, "productId");

			this.isXuzu = e.isXuzu == "1"; // 判断是否是续租功能
			this.duration = e.duration;
			this.skuId = e.skuId;
			this.shopId = e.shopId;
			this.choiceTime = e.choiceTime == 1 ? null : e.choiceTime;
			this.onConfirm();
			this.getPreventCheatAndNsf();
			if (this.isXuzu) {
				// 表明是来自续租页面，那么此时进行一些数据的初始化相关工作
				this.xuzuDataInit();
			}
		},

		onShareAppMessage() {
			return {
				title: this.$getGlobalData("information").appTitle,
				desc: `来${this.$getGlobalData("information").appTitle}，租好物`,
				path: "pages/index/index",
			};
		},
		onShow(e) {
			let that = this;
			this.address = this.$getGlobalData("address");
			setTimeout(function() {
				that.loadingShiming = true;
				that
					.$request(
						"/hzsx/userCertification/hasCertification", {},
						"get",
						true,
						true
					)
					.then((res) => {
						const canxiadan = ["UN_UPLOAD", "FINISH"]; // 前者表示未上传照片，后者表示已认证
						that.hasCertification = canxiadan.includes(res.data);
					})
					.finally(() => {
						that.loadingShiming = false;
					});
			}, 300);
		},

		methods: {
			/**
			 * 友盟接口-记录点击去添加地址行为
			 */
			umenPlus1() {
				if(!this.address){
					this.$uma.trackEvent('1',{ path: '设置地址' });
				}
				this.$onTo('pages/address/address')
			},
			umenPlus2() {
				this.$uma.trackEvent('2',{ path: '去实名认证' });
				this.$onTo('pages/certificates/certificates')
			},
			// 
			
			//提交订单
			onConfirm() {
				if (this.isXuzu) return; // 续租的话就不请求了
				this.$request(
					"hzsx/liteUserOrders/confirm", {
						skuId: this.skuId,
						duration: this.duration,
						selectionTime: this.choiceTime,
						uid: this.$getUid(),
					},
					"post"
				).then((res) => {
					this.productDescDetail = res.data;
					this.orderCouponLength = res.data.orderCouponList.length;
					this.orderCouponList = res.data.orderCouponList;
					this.services = res.data.additionalServices;
					this.orderIdEZB = res.data.orderId;
					/**
					 * 加上默认勾选（增值服务），可注释this.geTrail();
					 * 反正，取消默认勾选>>注释默认勾选代码>>须加上this.geTrail();
					 */
					// 默认勾选
					this.servicesId = res.data.additionalServices.map(
					  (item) => item.shopAdditionalServicesId
					);
					// this.geTrail(); //这里是为了取消了默认勾选加的更新价格
					this.address = res.data.address;
					this.orderPrices = res.data.orderPrices;
					this.$setGlobalData("address", res.data.address);
				});
			},

			//选择优惠券
			onIsCheck(index, red) {
				let goodList = this.orderCouponList;
				if (goodList[index]["check"]) {
					goodList[index]["check"] = false;
					this.reduction = 0;
					this.couponId = "";
					this.$refs.couponList.hide();
					this.geTrail();
				} else {
					let indexCheck = goodList.findIndex((item) => item.check === true);
					if (indexCheck !== -1) {
						goodList[indexCheck]["check"] = false;
					}
					this.$refs.couponList.hide();
					if (red.discountRate == null) {
						this.reduction = red.scene !== 'FIRST_MONTH_FIXED_COUPON' ? `-` + red.discountAmount : `首期定额` + red
							.discountAmount + `元`
					} else {
						this.reduction = red.discountRate + `折`;
					}
					this.couponId = red.code;
					goodList[index]["check"] = true;
					this.geTrail();
				}
				this.orderCouponList = goodList;
			},
			//取消增值服务
			deleteSrvicesId(id) {
				let _servicesId = this.servicesId;
				this.servicesId = _servicesId.filter((item) => item !== id);
				this.geTrail();
			},
			//增加增值服务
			addSrvicesId(id) {
				let _servicesId = this.servicesId;
				_servicesId.push(id);
				this.servicesId = _servicesId;
				this.geTrail();
			},
			getServicesData(val) {
				this.serviceDetailsTitle = val.name;
				this.serviceDetailsContent = val.content;
				this.$refs.serviceDetails.show();
			},
			//获取营销反作弊用户数据和用户风险
			getPreventCheatAndNsf() {
				// #ifdef MP-ALIPAY

				//营销反作弊
				if (my.canIUse("ap.preventCheat")) {
					my.ap.preventCheat({
						pid: this.$getGlobalData("information").pid,
						appId: my.getAppIdSync().appId,
						bizContext: {
							service: "marketing",
							risk_type: "riskinfo_anticheat_common",
							pid: this.$getGlobalData("information").pid,
							mobile_no: getZWZUserDetail().telephone,
						},
						success: (e) => {
							let riskResultDesc = JSON.parse(e.riskResultDesc);
							let riskResultDescDate = Object.keys(riskResultDesc);
							this.antiCheatingLevel = riskResultDescDate[0];
						},
					});
				}

				//用户风险
				if (my.canIUse("ap.nsf")) {
					my.ap.nsf({
						pid: this.$getGlobalData("information").pid,
						appId: my.getAppIdSync().appId,
						bizContext: {
							risk_type: "riskinfo_nsf_common",
							pid: this.$getGlobalData("information").pid,
							user_id: getZWZUserDetail().thirdId,
							mobile_no: getZWZUserDetail().telephone,
							cert_no: "null",
							lbs: "null",
							sales_amount: "null",
						},
						success: (e) => {
							let riskResultDesc = JSON.parse(e.riskResultDesc);
							let riskResultDescDate = Object.keys(riskResultDesc);
							this.nsfLevel = riskResultDescDate[0];
						},
					});
				}
				// #endif
			},
			//获取地区信息
			// gotoAddress() {
			//   my.getLocation({
			//     type: 2,
			//     success: (res) => {
			//       let _streetNumber = "";
			//       let _orderLocationAddress = res;
			//       _orderLocationAddress.streetNumber = `${res.streetNumber.street}${res.streetNumber.number}`;
			//       _orderLocationAddress.pois = "";
			//       this.orderLocationAddress = { ..._orderLocationAddress };
			//       this.onOk();
			//     },
			//     fail: (res) => {
			//       this.onOk();
			//     },
			//   });
			// },
			
			/**
			 * 保存用户是否拒绝授权
			 */
			saveUser() {
				this.$request(
					"hzsx/userPoint/saveUserRejectAuth", {
						type:true
					},
					"get",
					true
				).then((res) => {
					console.log("用户拒绝授权",res);
				});
			},
			gotoAddress() {
				const _this = this;
				function selectUser() {
					return _this.$request(
						"hzsx/userPoint/queryUserRejectAuth", {
							type:true
						},
						"get",
						true
					)
				};
				async function func(){
					let res = await selectUser()
					if(res.responseType === 'SUCCESS' && !res.data){
						my.getLocation({
							type: 2,
							success: (res) => {
								let _streetNumber = "";
								let _orderLocationAddress = res;
								_orderLocationAddress.streetNumber =
									`${res.streetNumber.street}${res.streetNumber.number}`;
								_orderLocationAddress.pois = "";
								_this.orderLocationAddress = {
									..._orderLocationAddress
								};
								_this.onOk();
							},
							fail: (err) => {
								if([2001,2002,2003].includes(err?.error)){
									_this.saveUser();
								}
								_this.onOk();
							},
						});
					}else{
						_this.onOk();
					}
					
				};
				func();
			},
			// gotoAddress() {
			// 	const _this = this;
			// 	function selectUser() {
			// 		return _this.$request(
			// 			"hzsx/userPoint/queryUserRejectAuth", {
			// 				type:true
			// 			},
			// 			"get",
			// 			true
			// 		)
			// 	};
			// 	async function func(){
			// 		let res = await selectUser()
			// 		if(res.responseType === 'SUCCESS' && res.data){
			// 			my.getLocation({
			// 				type: 2,
			// 				success: (res) => {
			// 					console.log("locationRes",res);
			// 					let _streetNumber = "";
			// 					let _orderLocationAddress = res;
			// 					_orderLocationAddress.streetNumber =
			// 						`${res.streetNumber.street}${res.streetNumber.number}`;
			// 					_orderLocationAddress.pois = "";
			// 					_this.orderLocationAddress = {
			// 						..._orderLocationAddress
			// 					};
			// 					_this.onOk();
			// 				},
			// 				fail: (err) => {
			// 					if([2001,2002,2003].includes(err?.error)){
			// 						_this.saveUser();
			// 					}
			// 					_this.onOk();
			// 				},
			// 			});
			// 		}else{
			// 			_this.onOk();
			// 		}
					
			// 	};
			// 	func();
			// },
			//获取手机号
			onGetPhone() {
				let isPhone = checkHasPhone();
				if (isPhone) {
					this.gotoAddress();
				} else {
					my.getPhoneNumber({
						success: (res) => {
							//进行留资回传的处理方法-手机号授权
							backUserUpload('221');
							//
							let encryptedData = res.response;
							this.sucHandler(encryptedData);
						},
						fail: () => {
							uni.showToast({
								title: "授权失败",
								icon: "none",
							});
						},
					});
				}
			},
			//获取到用户的手机号码
			sucHandler(encryString) {
				this.$request(
					"hzsx/api/components/decrypt", {
						content: encryString
					},
					"get",
					true
				).then((res) => {
					let resObj = JSON.parse(res.data);
					if (resObj.code === "10000") {
						let obj = {
							telephone: resObj.mobile,
						};
						loginHandler(true, obj, this.onConfirm, true);
					}
				});
			},
			//拒绝授权手机号
			handleAuthError() {
				// uni.showToast({
				// 	title: "授权拒绝",
				// 	icon: "none",
				// });
			},

			//切换isChecked
			getChecked() {
				// 跳转签署协议

				const orderIdEZB = this.orderIdEZB;
				const productId = this.productId;
				const shopId = this.shopId;
				const amount = this.orderPrices.totalRent;
				// if(this.isChecked == false){
				// 	this.$onTo(`pages/webview/webview?orderId=${orderIdEZB}&productId=${productId}&shopId=${shopId}&amount=${amount}`);
				// }

				this.isChecked = !this.isChecked;
				//const  = uniCloud.importObject('')��署协议

			},
			//价格试算
			geTrail() {
				this.$request(
					"/hzsx/liteUserOrders/trail", {
						skuId: this.skuId,
						duration: this.duration,
						uid: this.$getUid(),
						additionalServicesIds: this.servicesId,
						couponId: this.couponId,
						selectionTime: this.choiceTime,
					},
					"post"
				).then((res) => {
					this.orderPrices = res.data;
				});
			},
			/**
			 * 获取金额的小数点前、后的数据
			 * @param {Boolean} isFront : 是否是前半部分
			 */
			getPartMoney(isFront, price) {
				const _price = price || "";
				if (!_price) return "-";
				const list = _price.toString().split(".");
				const result = isFront ? list[0] : list[1];
				return result || 0;
			},

			//获取用户留言
			getRemark(e) {
				this.remark = e.detail.value;
			},

			//提交支付
			onOk() {
				if (!this.isChecked) {
					uni.showToast({
						title: "请阅读左下方协议并同意",
					});
					return;
				}
				if (!this.hasCertification) {
					uni.showToast({
						title: "请完成实名认证",
					});
					return;
				}
				if (!this.isXuzu && (!this.address || !this.address.id)) {
					// 正常下单需校验地址；续租的话沿用老地址
					uni.showToast({
						title: "请填写收货地址"
					});
					return;
				}
				// if(this.services.length !==0&&this.servicesId.length == 0){
				//  if(this.servicesIdCons == 0){
				//   uni.showToast({ title: "请勾选增值服务" });
				//   this.servicesIdCons = 1;
				//   return;
				//  }
				// }

				uni.showLoading()
				const {
					url,
					data
				} = this.generateOrderSubmitUrlAndData();

                 /**
				 * 拉起免押，下单
				 */
				// 
				const _this = this;
				_this.$request(
				  "hzsx/api/order/getFaceAuthCertifyUrl",
				  { orderId: _this.productDescDetail.orderId, uid:_this.$getUid() }, // 正常下单和续租都是这个订单ID
				  "post"
				).then((res) => {
				  //拉起人脸
				  startAPVerify(res.data).then((res) => {
				    uni.hideLoading()
					console.log("res",res);
				    if (res.resultStatus === "9000") {
				      //同步人脸识别结果
				      _this.$request(
				        "hzsx/api/components/faceAuthInitAsync",
				        { certifyId: res.result.certifyId },
				        "get",
				        true
				      );
					  // 下单
					  _this.$request(url, data, "post").then((res) => {
						  if (res.data.freezeUrl)
						  tradePay(res.data.freezeUrl).then((res) => {
					        _this.$eventEmitter.emit("refreshMyPageConfigData"); // 刷新我的页面的配置数据，使得我的订单上的气泡上的数字会显示相应的值
					        if (res.resultCode === "9000") {
					          //跳商品详情页
					          _this.$onTo("pages/orderList/orderList", false, true);
					        } else {
					          //不免押按照0元下单，直接审核中
					          _this.$request(
					            "hzsx/api/order/orderFree",
					            { orderId: _this.productDescDetail.orderId },
					            "get",
					            true
					          );
					          // 告知弹窗
					          uni.showModal({
					          	title: '申请免押额度协助',
					          	content: '提交订单信息，由客服进行免押审核。',
					  			showCancel: false,
					          	success: function (res) {
					          		//跳商品详情页
					          		_this.$onTo("pages/orderList/orderList", false, true);
					          	}
					          });
					        }
					      });
					  });
				    }
				  });
				});
				
				// const _this = this;
				// this.$request(url, data, "post").then((res) => {
				//   if (res.data.freezeUrl)
				//     //用户支付api
				//     tradePay(res.data.freezeUrl).then((res) => {
				//       _this.$eventEmitter.emit("refreshMyPageConfigData"); // 刷新我的页面的配置数据，使得我的订单上的气泡上的数字会显示相应的值
				//       if (res.resultCode === "9000") {
				//         _this.$request(
				//           "hzsx/api/order/getFaceAuthCertifyUrl",
				//           { orderId: _this.productDescDetail.orderId }, // 正常下单和续租都是这个订单ID
				//           "post"
				//         ).then((res) => {
				//           //支付成功后人脸识别
				//           startAPVerify(res.data).then((res) => {
				//             uni.hideLoading()
				//             if (res.resultStatus === "9000") {
				//               //同步人脸识别结果
				//               _this.$request(
				//                 "hzsx/api/components/faceAuthInitAsync",
				//                 { certifyId: res.result.certifyId },
				//                 "get",
				//                 true
				//               );
				//               //跳商品详情页
				//               _this.$onTo("pages/orderList/orderList", false, true);
				//             } else {
				//               _this.$onTo("pages/orderList/orderList", false, true);
				//             }
				//           });
				//         });
				//       } else {
				//         //不免押按照0元下单，直接审核中
				//         _this.$request(
				//           "hzsx/api/order/orderFree",
				//           { orderId: _this.productDescDetail.orderId },
				//           "get",
				//           true
				//         );
				//         // 告知弹窗
				//         uni.showModal({
				//         	title: '申请免押额度协助',
				//         	content: '提交订单信息，由客服进行免押审核。',
				// 			showCancel: false,
				//         	success: function (res) {
				//         		//跳商品详情页
				// 				_this.$request(
				// 				  "hzsx/api/order/getFaceAuthCertifyUrl",
				// 				  { orderId: _this.productDescDetail.orderId }, // 正常下单和续租都是这个订单ID
				// 				  "post"
				// 				).then((res) => {
				// 				  //支付成功后人脸识别
				// 				  startAPVerify(res.data).then((res) => {
				// 				    uni.hideLoading()
				// 				    if (res.resultStatus === "9000") {
				// 				      //同步人脸识别结果
				// 				      _this.$request(
				// 				        "hzsx/api/components/faceAuthInitAsync",
				// 				        { certifyId: res.result.certifyId },
				// 				        "get",
				// 				        true
				// 				      );
				// 				      //跳商品详情页
				// 				      _this.$onTo("pages/orderList/orderList", false, true);
				// 				    } else {
				// 				      _this.$onTo("pages/orderList/orderList", false, true);
				// 				    }
				// 				  });
				// 				});
				//         	}
				//         });
				//       }
				//     });
				// });
				
				/**
				 * 不拉起支付，下单
				 */
				// this.$request(url, data, "post").then((res) => {
				// 	console.log("res", res);
				// 	if (res.data.status) {
				// 		// 成功及刷新进入人脸认证===>订单列表
				// 		this.$eventEmitter.emit("refreshMyPageConfigData"); // 刷新我的页面的配置数据，使得我的订单上的气泡上的数字会显示相应的值
				// 		this.$request(
				// 			"hzsx/api/order/getFaceAuthCertifyUrl", {
				// 				orderId: this.productDescDetail.orderId
				// 			}, // 正常下单和续租都是这个订单ID
				// 			"post"
				// 		).then((res) => {
				// 			//支付成功后人脸识别
				// 			startAPVerify(res.data).then((res) => {
				// 				uni.hideLoading()
				// 				if (res.resultStatus === "9000") {
				// 					//同步人脸识别结果
				// 					this.$request(
				// 						"hzsx/api/components/faceAuthInitAsync", {
				// 							certifyId: res.result.certifyId
				// 						},
				// 						"get",
				// 						true
				// 					);
				// 					//跳商品详情页
				// 					this.$onTo("pages/orderList/orderList", false, true);
				// 				} else {
				// 					this.$onTo("pages/orderList/orderList", false, true);
				// 				}
				// 			});
				// 		});
				// 	} else {
				// 		this.$onTo("pages/orderList/orderList", false, true);
				// 	}
				// });
			},
			// 协议组件的确定点击监听
			xieyiOkHandler() {
				// this.isAgree = true;
				this.isChecked = true;
				this.showXieyiModal = false;
			},

			/**
			 * 返回提交订单所对应的接口名以及数据
			 */
			generateOrderSubmitUrlAndData() {
				let url = "";
				let data;
				if (this.isXuzu) {
					// 续租功能
					url = "hzsx/api/orderRelet/liteUserOrderReletSubmit";
					const xuzuDetail = this.xuzuGlobalData || {};
					// const services = xuzuDetail.additionalServicesDtoList || []
					// const serviceIds = services.map(obj => obj.id)
					data = {
						originalOrderId: xuzuDetail.originalOrderId,
						orderId: xuzuDetail.orderId,
						originalPrice: xuzuDetail.orderPricesDto?.skuPrice,
						price: xuzuDetail.orderPricesDto?.skuPrice,
						productId: xuzuDetail.detailDto?.productId,
						start: xuzuDetail.start,
						end: xuzuDetail.end,
						duration: xuzuDetail.duration,
						num: 1,
						skuId: xuzuDetail.detailDto?.skuId,
						monthRentAmount: xuzuDetail.orderPricesDto?.originalMonthRentPrice,
						deposit: xuzuDetail.orderPricesDto?.depositAmount,
						rentAmount: xuzuDetail.orderPricesDto?.rentPrice,
						installmentCount: xuzuDetail.orderPricesDto?.totalPeriods,
						additionalServicesIds: [],
						remark: this.remark,
						channelId: returnChannelId(),
						uid: this.$getUid(),
					};
				} else {
					url = "hzsx/liteUserOrders/submit";
					data = {
						orderId: this.productDescDetail.orderId,
						addressId: this.address.id,
						nsfLevel: this.nsfLevel,
						antiCheatingLevel: this.antiCheatingLevel,
						skuId: this.skuId,
						duration: this.duration,
						couponId: this.couponId,
						additionalServicesIds: this.servicesId,
						uid: this.$getUid(),
						remark: this.remark,
						orderLocationAddress: this.orderLocationAddress,
						selectionTime: this.choiceTime
					};
				}

				return {
					url,
					data
				};
			},

			/**
			 * 如果是来自续租的话，那么对数据进行初始化
			 */
			xuzuDataInit() {
				const globalSavedData = this.$getGlobalData("xuzuProductDetail") || {};
				const productDescObj = globalSavedData?.detailDto || {}; // 商品的描述对象
				const orderPricesDto = globalSavedData?.orderPricesDto || {}; // 订单的描述对象
				// const additionalServicesDtoList = globalSavedData?.additionalServicesDtoList || [] // 增值服务数据，还需确定一下是否可原数据一样

				productDescObj.productImage = productDescObj.mainImageUrl; // 图片替换
				productDescObj.specName = productDescObj.skuTitle; // 商品规格字段替换
				productDescObj.isBuyOutSupported = globalSavedData.isBuyOutSupported; // 是否支持买断替换
				productDescObj.orderId = globalSavedData?.orderId; // 新订单的ID
				productDescObj.productFreightType = productDescObj.returnfreightType; // 归还规则

				orderPricesDto.expireBuyOutPrice = globalSavedData.expireBuyOutPrice; // 买断价

				this.productDescDetail = productDescObj;
				this.orderPrices = orderPricesDto;
				this.xuzuGlobalData = globalSavedData;
				console.log("续租的数据", globalSavedData);
				// this.services = additionalServicesDtoList
			},

			/**
			 * 除开续租模块外都进行显示
			 */
			notXuzuFeature() {
				if (this.isXuzu) return false;
				return true;
			},

			seeXieyiHandler() {
				const pid = this.productId; // 商品ID
				const xYData = {
					orderId: this.productDescDetail?.orderId, //订单编号
					reciveCity: `${this.address?.provinceStr}${this.address?.cityStr}${this.address?.areaStr}`, //收货省收货城市
					reciveAddress: this.address?.street, //收货详细地址
					reciveName: this.address?.realname, //收货姓名
					skuTitle: this.productDescDetail.specName.toString(), //商品规格
					totalPeriod: this.productDescDetail?.totalPeriods, //总期数
					totalRent: this.orderPrices?.totalRent, //总租金
					salePrice: this.productDescDetail?.salePrice, //销售价
					buyOutPrice: this.orderPrices?.expireBuyOutPrice, //买断价
					orderByStagesDtoList: this?.orderPrices?.orderByStagesDtoList, //账期
				};
				this.xYData = xYData;
				this.showXieyiModal = true;
				// const url = "hzsx/api/sysConfig/cacheConfirmData";
				// this.$request(url, xYData, "post", true).then((res) => {
				//   let xieyiUrl = `${xYUrl}?channelId=000&uid=${this.$getUid()}&productId=${pid}&tempOrderId=${
				//     res.data
				//   }`;
				//   this.$setGlobalData("xieyiUrl@xieyi", xieyiUrl);
				//   this.$onTo(`/pages/xieyi/xieyi`);
				// });
			},
		},
	};
</script>

<style lang="scss">
	page {
		padding-bottom: 150rpx;
	}

	.confirm {
		padding-top: 20rpx;

		.address {
			background: #ffffff;
			margin: 20rpx 0;
			margin-top: 0;
			height: 120rpx;
			position: relative;

			.iocn {
				width: 12rpx;
				height: 18rpx;
			}

			.left2 {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
			}

			.item1 {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
			}

			.item2 {
				font-size: 24rpx;
				font-weight: 400;
				color: #333333;
				margin-top: 19rpx;
			}

			.bottom-backgroind {
				position: absolute;
				height: 8rpx;
				width: 100%;
				bottom: 0;
				left: 0px;
			}
		}

		.fxpad {
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.product-wrapper {
			background: #fff;
			padding: 30rpx;
			display: flex;
			align-items: center;

			margin-bottom: 20rpx;

			.product-img {
				width: 216rpx;
				height: 216rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.desc {
				overflow: hidden;
				width: 484rpx;

				.product-name {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 20rpx;
				}

				.sku {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 30rpx;
					height: 60rpx;
				}

				.rent {
					display: flex;
					justify-content: space-between;
					margin-top: 24rpx;

					.text1 {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
					}

					.text2 {
						font-size: 24rpx;
						font-weight: 400;
						color: #e52021;
					}
				}
			}
		}

		.coupon {
			background: #ffffff;

			.item1 {
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
			}

			.item2 {
				.text {
					font-size: 22rpx;
					font-weight: 400;
					color: #e52021;
					background-color: #fbedeb;
					border-radius: 5rpx;
					padding: 2rpx 8rpx;
				}

				.text2 {
					font-size: 24rpx;
					font-weight: 400;
					color: #e52021;
				}
			}
		}

		.arrow {
			width: 10rpx;
			height: 16rpx;
			margin-left: 12rpx;
		}

		.container {
			background: #fff;
			margin-top: 20rpx;

			.item {
				.left {
					font-size: 26rpx;
					font-weight: 400;
					color: #999999;
					display: flex;
					align-items: center;

					.sm {
						width: 30rpx;
						height: 30rpx;
						margin-left: 10rpx;
					}

					.futit {
						font-size: 20rpx;
						font-weight: 400;
						color: #fff2c5;
						background: #1f2129;
						border-radius: 15rpx;
						padding: 1px 12rpx;
						margin-left: 10rpx;
					}
				}
				
				.leftBlock{
					display: block;
					.zMBox{
						display: flex;
						justify-content: flex-start;
						margin-bottom: 12rpx;
						.zMLogo{
							width: 25rpx;
							margin-right: 10rpx;
						}
						.zMtext1{
							font-weight: bold;
							color: #000000;
						}
						.zMtext2{
							font-size: 20rpx;
							margin-left: 8rpx;
							color: #1677FF;
							border: 1rpx solid #1677FF;
							padding: 0 6rpx;
							border-radius: 8rpx;
						}
					}
				}
				
				.rightBlock{
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					text-align: right;
					.rightBlockToip{
						background-color: #F98365;
						color: #fff;
						font-size: 20rpx;
						padding: 4rpx 10rpx;
						border-radius: 6rpx;
						margin-top: 8rpx;
						position: relative;
					}
					.rightBlockToip::before {
						content: '';
						position: absolute;
						top: -20rpx; /* 控制三角形位置 */
						left: 80%; /* 控制三角形水平位置 */
						transform: translateX(-50%); /* 将三角形水平居中 */
						border-width: 10rpx; /* 控制三角形大小 */
						border-style: solid;
						border-color: transparent transparent #F98365 transparent; /* 控制三角形颜色 */
					}
				}

				.leftBold {
					font-size: 28rpx;
					font-weight: bold;
				}

				.right {
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					display: flex;
					align-items: center;

					.checkIcon {
						width: 28rpx;
						height: 28rpx;
					}
				}
			}
		}

		.servicesContent {
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			text-align: center;
			padding: 55rpx 0;
			min-height: 120rpx;
		}

		.coupons {
			max-height: 750rpx;
			overflow: auto;
			padding-bottom: 30rpx;

			.coupon-item {
				width: 650rpx;
				height: 170rpx;
				background: #ffffff;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 20rpx;
				padding: 0 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-left {
					text-align: center;
					display: flex;

					.title {
						font-size: 62rpx;
						font-weight: 500;
						color: #ff4a26;
					}
				}

				.item-content {
					margin-left: 47rpx;
					text-align: left;

					.title {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						margin-bottom: 10rpx;
					}

					.fu {
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
						display: flex;
						align-items: center;
					}
				}

				.item-right {
					.checkIcon {
						width: 36rpx;
						height: 36rpx;
						margin-right: 20rpx;
					}
				}
			}
		}

		.hide {
			display: none;
		}

		.eachIssueTitle {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			margin-top: 10rpx;
			margin-bottom: 30rpx;
			text-align: center;
		}

		.eachIssue {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			padding: 0 30rpx;
			padding-bottom: 60rpx;

			.item {
				width: 334rpx;
				height: 129rpx;
				background: #ffffff;
				border-radius: 10rpx;
				margin-bottom: 22rpx;
				text-align: center;
				position: relative;

				.mark {
					width: 93rpx;
					height: 28rpx;
					@include global-background-color();
					border-radius: 10rpx 0px 20rpx 0px;
					text-align: center;
					line-height: 28rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #333333;
					position: absolute;
					top: 0;
					left: 0;
				}

				.text1 {
					font-size: 24rpx;
					font-weight: 500;
					color: #333333;

					line-height: 33rpx;
					margin-top: 10rpx;
				}

				.text2 {
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
					line-height: 40rpx;
				}

				.text3 {
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
					line-height: 30rpx;
				}
			}
		}

		.message {
			box-sizing: border-box;
			margin-bottom: 30rpx;
			background: #fff;
			padding: 20rpx 30rpx;
			margin-top: 20rpx;

			.text-area {
				box-sizing: border-box;
				//   min-height: 180rpx;
				width: 100%;
				font-size: 24rpx;
				font-weight: 500;
				color: #333333;
				// padding: 20rpx 0;
			}
		}

		.agreement {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;

			.checked {
				border: 10rpx solid transparent;
				width: 28rpx;
				height: 28rpx;
				margin-left: 20rpx;
			}
		}

		.authentication {
			background: #fff;
			margin-top: 20rpx;

			.item1 {
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
			}

			.item2 {
				font-size: 26rpx;
				font-weight: 400;
				color: #e52021;
			}
		}

		.footer {
			width: 750rpx;
			height: 98rpx;
			background: #ffffff;
			padding-left: 30rpx;
			position: fixed;
			bottom: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				align-items: flex-end;
				font-size: 24rpx;
				font-weight: 500;
				color: #333333;

				.price-area {
					.left {
						color: #e52021;
						margin-left: 6rpx;

						.m {
							font-size: 28rpx;
							margin-right: 6rpx;
							font-weight: 500;
						}

						.l {
							font-size: 38rpx;
							font-weight: 500;
						}

						.d {
							font-size: 28rpx;
						}

						.r {
							font-size: 28rpx;
							font-weight: 500;
						}
					}
				}
			}

			.right {
				width: 328rpx;
				height: 98rpx;
				@include global-background-color();
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 98rpx;
				text-align: center;
			}
		}

		.xieyi {
			color: #586e98;
		}

		.an {
			height: 97rpx;
			@include global-background-color();

			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			position: fixed;
			bottom: 50rpx;
			border: beige;
			width: 690rpx;
			height: 90rpx;
			border-radius: 20rpx;
			line-height: 90rpx;
		}
	}
</style>