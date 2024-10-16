<template>
	<view style="overflow: auto;">
		<!-- <FillBackground :height="menuHeight+menuTop+9+'px'">
		</FillBackground> -->
		<view class="fixedHeader" :style="{'paddingTop': menuHeight+menuTop+9}">
			<view style="height: 284rpx;">
				<AuthButton :needRefresh="needRefreshAuthBtn" @successAuth="successAuthHandler">
							<view slot="content" class="username-wrapper">
								<view class="wrapper_user">
									<image :src="userDetail.avatar || 'https://oss.chuangliukeji.com/backstage/2024-04-22/0f551676bbc54d59984a3072c85ee816.png'" class="userAvatar"></image>
									<view class="right-area">
										<text class="user-name">{{ userDetail.nickName || "点击登录" }}</text>
										<view :class="{'renzhengSuccess': true, 'hide': !isRenZheng}" @click="goRenzhengSuccessHandler">
											<image src="../../static/my/renzhengSuccess.png"></image>
											<text>已实名认证</text>
										</view>
										<view @click="goRenzhengHandler" :class="{'renzhengBtn': true, 'hide': isRenZheng}">
											未认证
										</view>
									</view>
									<view @click="goRenzhengHandler" :class="{'wrapper_info': true, 'hide': isRenZheng}">
										身份认证
									</view>
								</view>
								<view class="wrapper_card">
									<view class="card_list" @click="this.$onTo('/pages/collection/collection')">
										<image src="../../static/my/shouCang.png" class="card_list_img1"></image>
										<text class="card_list_text">我的收藏</text>
										<!-- <image src="../../static/my/my_jiantou.png" class="card_list_img2"></image> -->
									</view>
									<view class="card_line"></view>
									<view class="card_list" @click="this.$onTo('pages/coupon/coupon')">
										<image src="../../static/my/youHuiQuan.png" class="card_list_img2"></image>
										<text class="card_list_text">我的卡券</text>
										<!-- <image src="../../static/my/my_jiantou.png" class="card_list_img2"></image> -->
									</view>
								</view>
							</view>
						</AuthButton>
			</view>
		</view>
		

		<view class="content-container">
			<!-- 我的订单模块 -->
			<AuthButton :needRefresh="needRefreshAuthBtn" @successAuth="successAuthHandler">
				<view slot="content" class="unit order-wrapper">
					<view class="top-area" style="margin-bottom: 24rpx;">
						<text style="font-weight: bold;">我的订单</text>
						<view class="see-all-cls" @click="seeAllOrderHandler">
							<text class="span2">查看全部</text>
							<image class="arrow" src="../../static/my/jiantou.png"></image>
						</view>
					</view>
					<view class="icon-wrapper">
						<view v-for="(menuObj, idx) in orderMenus" :key="idx"
							:class="{ 'icon-unit': true, nomr: idx > 0 && (idx + 1) % 5 == 0 }"
							@click="clickOrderMenu(menuObj)">
							<image :src="menuObj.fileUrl" class="icon"></image>
							<text v-if="menuObj.showNum && checkHasUserinfo" class="bubble">{{ menuObj.showNum }}</text>
							<text class="text">{{ menuObj.describeInfo }}</text>
						</view>
					</view>
				</view>
			</AuthButton>

			<!-- 我的服务模块 -->
			<AuthButton :needRefresh="needRefreshAuthBtn" @successAuth="successAuthHandler">
				<view slot="content" class="unit service-wrapper">
					<view class="top-area" style="margin-bottom: 18rpx;">我的服务</view>
					<view class="icon-wrapper" style="padding: 0 44rpx;">
						<view :class="{ 'icon-unit2': true, nomr: idx > 0 && (idx + 1) % 4 == 0 }"
							v-for="(menuObj, idx) in serviceMenus" :key="idx" @click="clickServiceHandler(menuObj)">
							<image :src="menuObj.fileUrl" class="icon"></image>
							<text v-if="menuObj.showNum" class="bubble">{{ menuObj.showNum }}</text>
							<text class="text" style="color: #0F2250;">{{ menuObj.describeInfo }}</text>
						</view>
					</view>
				</view>
			</AuthButton>

			<view class="title-area">
				<view class="round round1"></view>
				<view class="round round2"></view>
				<view class="round round3"></view>
				<view class="title">
					<image src="../../static/my/tuijianXX.png"></image>
					<text>为您推荐</text>
				</view>
				<view class="round round4"></view>
				<view class="round round5"></view>
				<view class="round round6"></view>
			</view>

			<view class="productList-area">
				<div class="left">
					<view class="item" v-for="(productObj, idx) in productList" :key="idx">
						<productItem productNameKey="productName" v-if="idx % 2 == 0" :productObj="productObj"
							:showTag="true">
							<JiangpaiSlot v-if="idx < 3" :role="returnRole(idx)" slot="topLeft" />
						</productItem>
					</view>
				</div>

				<div clas="right">
					<view class="item" v-for="(productObj, idx) in productList" :key="idx">
						<productItem productNameKey="productName" v-if="idx % 2 == 1" :productObj="productObj"
							:showTag="true">
							<JiangpaiSlot v-if="idx < 3" :role="returnRole(idx)" slot="topLeft" />
						</productItem>
					</view>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	// 个人中心-我的页面
	import ProductItem from "../../components/productItem/productItem.vue"
	import JiangpaiSlot from "../../components/productItem/slots/jiangpai.vue"
	import AuthButton from "../../components/authButton/authButton.vue"
	import FillBackground from "../../components/fillBackground/fillBackground.vue"
	import {
		request,
		getZWZUserDetail,
		checkHasUserBasicInfo,
		checkHasShiMingRenZheng
	} from "@/utils"
	import {
		ALL_ORDER_ID
	} from "../../utils/constant"
	import {
		resetLocalAuth
	} from "../../utils/platform"

	export default {
		data() {
			return {
				avatar: "",
				userName: "", // 用户名
				orderMenus: [], // 订单栏的菜单列表
				serviceMenus: [], // 我的服务栏的菜单列表
				productList: [], // 更多热销商品
				userDetail: {}, // 用户详情数据
				needRefreshAuthBtn: false, // 是否需要强制authButton组件进行刷新
				isRenZheng: false, // 表示是否已实名认证，默认没有
				idCard: "", //身份证信息
				first: true, // 第一次拉数据
				checkHasUserinfo: false,
				menuTop: 0,
				menuHeight: 0
			}
		},

		components: {
			ProductItem,
			JiangpaiSlot,
			AuthButton,
			FillBackground
		},

		onLoad() {
			this.setUserDetail();
			this.getMenu(); //自定义顶部胶囊位置
		},

		onShow() {
			this.fetchConfigureDataHandler()
			this.fetchShimingRenZhengStatus()
			// 页面显示时判断一下用户是否有解除授权，不放到onLoad的原因是为了避免解除授权之后在回到小程序还是显示头像
			// 这样做的代价就是每次显示都得执行，花费大概3ms左右
			const sucCb = () => {
				this.needRefreshAuthBtn = !this.needRefreshAuthBtn
				this.isRenZheng = false // 取消授权后，将认证状态清一下
				this.setUserDetail()
			}
			// 无论如何resetLocalAuth都是会调用的
			if (this.first) {
				const cb = () => {
					this.first = false
					resetLocalAuth(sucCb) // 注：该方法只是删了本地的头像以及昵称，但其实这些信息还是保留在租物租服务器的
				}
				this.fetchShimingRenZhengStatus(
					cb
				) // 之所以resetLocalAuth需要在加载到接口返回数据之前执行，是因为需要解决这种问题：用户在租物租已经实名认证过，但是解除拉授权，那么此时打开我的页面，异步请求和onshow之间顺序不确定
			} else {
				resetLocalAuth(sucCb) // 注：该方法只是删了本地的头像以及昵称，但其实这些信息还是保留在租物租服务器的
			}
		},

		methods: {
			/**
			 * 加载实名认证的状态
			 */
			fetchShimingRenZhengStatus(cb) {
				checkHasShiMingRenZheng().then(obj => {
					this.idCard = obj.idCard
					this.isRenZheng = obj.checkResult
				}).catch(() => {
					this.isRenZheng = false
				}).finally(() => {
					cb && cb()
				})
			},

			/** 设置用户详细数据 */
			setUserDetail() {
				this.checkHasUserinfo = checkHasUserBasicInfo()
				this.userDetail = getZWZUserDetail()
			},

			// 监听点击去认证
			goRenzhengHandler() {
				this.stopActionWhenNoAuth().then(() => {
					this.$onTo("/pages/certificates/certificates?type=my")
				})
			},

			// 已认证的话跳转到认证成功页面
			goRenzhengSuccessHandler() {
				this.stopActionWhenNoAuth().then(() => {
					this.$onTo(`/pages/certificatesSuccess/certificatesSuccess?idCard=${this.idCard}`)
				})
			},

			/**
			 * 当用户未进行授权操作时，拦截接下来的点击行为
			 */
			stopActionWhenNoAuth() {
				return new Promise((resolve, reject) => {
					if (this.checkHasUserinfo) resolve()
					else reject()
				})
			},

			/**
			 * 点击订单栏各个图标的时候触发，对于订单模块来说，忽略后台所配置的跳转链接
			 */
			clickOrderMenu(menuObj = {}) {
				this.stopActionWhenNoAuth().then(() => {
					const {
						extCode
					} = menuObj
					if (!extCode) {
						this.$errHandler("不存在extCode")
						return
					}
					this.$onTo(`pages/orderList/orderList?tab=${extCode}`)
				})
			},

			/**
			 * 点击服务的时候触发
			 */
			clickServiceHandler(serviceItem) {
				const link = serviceItem?.link
				if (!link) return
				this.stopActionWhenNoAuth().then(() => {
					this.$onTo(link)
				})
			},

			/**
			 * 加载这个页面的配置信息数据
			 */
			fetchConfigureDataHandler() {
				return request("/hzsx/aliPay/index/myPage", {}, "GET", true, true).then(res => {
					const resData = res && res.data
					this.orderMenus = resData.orders || [] // 订单菜单项
					this.serviceMenus = resData.services || [] // 服务菜单项
					this.productList = resData.products || [] // 商品列表数据
				})
			},

			/**
			 * 返回奖牌的种类
			 */
			returnRole(idx) {
				const roleList = ["金", "银", "铜"]
				return roleList[idx]
			},

			/**
			 * 查看所有订单
			 */
			seeAllOrderHandler() {
				this.stopActionWhenNoAuth().then(() => {
					this.$onTo(`pages/orderList/orderList?tab=${ALL_ORDER_ID}`)
				})
			},

			/**
			 * 成功登录之后的回调方法
			 */
			successAuthHandler() {
				this.setUserDetail()
			},

			//
			getMenu() {
				const {
					height,
					top
				} = uni.getMenuButtonBoundingClientRect();
				this.menuTop = top;
				this.menuHeight = height;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hide {
		display: none !important;
	}
	view {
		box-sizing: border-box;
	}
	.fixedHeader {
		// position: fixed;
		position: relative;
		// top: 0;
		// left: 0;
		width: 100%;
		background: url('https://oss.changxiangwl.cn/api/2024-09-30/acb7b9e3496c45cd9d5e5628742ba3c5.png');
		background-size: 100% 100%;
		border: none;
		z-index: 1;
		@include global-color2();
	}
	.username-wrapper {
		// height: 226rpx;
		width: -webkit-fill-available;
		padding-top: 40rpx;
		border-radius: 12rpx;
		margin: 0 30rpx;
		background: #ffffff;
		position: absolute;
		left: 0;
		bottom: 0;
		
		.wrapper_user {
			width: 100%;
			height: 108rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-left: 26rpx;
			
			.userAvatar {
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.right-area {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
			
				.user-name {
					font-family: PingFangSC-Medium, PingFang SC;
					font-size: 34rpx;
					font-weight: bold;
					line-height: 50rpx;
					color: #333333;
					margin-bottom: 10rpx;
					text-align: left;
				}
				
				.renzhengSuccess {
					width: 162rpx;
					height: 34rpx;
					// background: #E7F1FF;
					// border-radius: 4rpx 4rpx 4rpx 4rpx;
					font-size: 24rpx;
					color: #b1b5bd;
					display: flex;
					justify-content: center;
					align-items: center;
					
					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 6rpx;
					}
				}
			
				.renzhengIcon {
					width: 131rpx;
					height: 49rpx;
				}
			
				.renzhengBtn {
					width: 95rpx;
					height: 34rpx;
					background: #FFE8E9;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-size: 22rpx;
					color: #F93A4A;
					line-height: 40rpx;
					text-align: center;
					position: relative;
			
					.backIcon {
						width: 10rpx;
						height: 16rpx;
						margin-left: 5rpx;
					}
				}
			}
			.wrapper_info {
				width: 144rpx;
				height: 60rpx;
				background: #1677FF;
				font-size: 26rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 60rpx;
				border-radius: 16rpx 0rpx 0rpx 16rpx;
			}
		}
		.wrapper_card {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 32rpx;
			.card_list{
				width: 276rpx;
				height: 72rpx;
				// margin-right: 30rpx;
				background: rgba(255,255,255,0.6);
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #0F2250;
				.card_list_text{
					margin: 0 16rpx;
				}
				.card_list_img1{
					width: 24rpx;
					height: 24rpx;
				}
				.card_list_img2{
					width: 26rpx;
					height: 22rpx;
				}
			}
			.card_line {
				width: 2rpx;
				height: 34rpx;
				border-radius: 10rpx;
				background-color: #e6eaf3;
			}
		}
	}

	.content-container {
		// background: #f7f7f7;
		padding: 16rpx 24rpx;
	}

	.unit {
		padding: 30rpx 0;
		background: #ffffff;
		border-radius: 20rpx;
		box-sizing: border-box;
		min-height: 220rpx;

		.top-area {
			height: 45rpx;
			padding: 0 30rpx;
			padding-right: 0;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: bold;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.see-all-cls {
				border-right: 30rpx solid transparent;
				border-left: 30rpx solid transparent;
				height: 45rpx;
				line-height: 45rpx;
			}

			.span2 {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				margin-right: 10rpx;
			}

			.arrow {
				width: 12rpx;
				height: 18rpx;
			}
		}

		.icon-wrapper {
			padding: 0 30rpx;
			display: flex;
			flex-wrap: wrap;

			.icon-unit {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #787f91;
				width: 4em;
				margin-right: calc((100% - 20em) / 4);
				margin-top: 40rpx;
				position: relative;

				.icon {
					width: 52rpx;
					height: 52rpx;
					margin-bottom: 8rpx;
				}

				.bubble {
					position: absolute;
					background: #1F2129;
					border-radius: 13rpx;
					border: 2rpx solid #FFFFFF;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					background-color: #F93A4A;
					color: #ffffff;
					padding: 2rpx 10rpx;
					z-index: 5;
					height: 26rpx;
					line-height: 26rpx;
					top: -14rpx;
					right: -14rpx;
				}
			}

			.icon-unit:nth-child(-n + 5) {
				margin-top: 0;
			}
			
			.icon-unit2 {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #787f91;
				width: 4em;
				margin-right: calc((100% - 16em) / 3);
				margin-top: 40rpx;
				position: relative;
			
				.icon {
					width: 94rpx;
					height: 94rpx;
					margin-bottom: 4rpx;
				}
			
				.bubble {
					position: absolute;
					background: #1F2129;
					border-radius: 13rpx;
					border: 2rpx solid #FFFFFF;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					background-color: #F93A4A;
					color: #ffffff;
					padding: 2rpx 10rpx;
					z-index: 5;
					height: 26rpx;
					line-height: 26rpx;
					top: -14rpx;
					right: -14rpx;
				}
			}
			
			.icon-unit2:nth-child(-n + 4) {
				margin-top: 0;
			}
			
			.nomr {
				margin-right: 0;
			}
		}
	}

	.order-wrapper {
		margin-bottom: 20rpx;
	}

	.title-area {
		height: 90rpx;
		// background: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;

		.round {
			border-radius: 50%;
			background: linear-gradient(180deg, #1677FF 0%, #3a8fff 100%);
			margin-right: 10px;
		}

		.round1,
		.round6 {
			width: 5rpx;
			height: 5rpx;
		}

		.round2,
		.round5 {
			width: 8rpx;
			height: 8rpx;
		}

		.round3,
		.round4 {
			width: 12rpx;
			height: 12rpx;
			margin-right: 21rpx;
		}

		.title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
			margin-right: 21rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			image {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.round6 {
			margin-right: 0;
		}
	}

	.productList-area {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.left,
		.right {
			display: flex;
			flex-direction: column;
		}

		.item {
			width: 344rpx;
		}
	}
</style>