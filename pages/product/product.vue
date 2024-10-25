<template>
	<view class="product">
		<!-- 商品介绍banner -->
		<dot :info="imgList" :current="current" mode="block" backgroundColor="#fff" :marginTop="menuTop">
			<view class="header-banner">
				<!-- <view v-if="$getGlobalData('notice')" class="header-title">
					<uni-notice-bar :showClose="true"
						:scrollable="true" :showIcon="true" color="#333333" background-color="#FFCB31" single="true" :text="$getGlobalData('notice')"></uni-notice-bar>
				</view> -->

				<swiper class="swiper-img" @change="onBanner" :current="current">
					<swiper-item v-for="(item, idx) in imgList" :key="idx">
						<image :src="item.src" mode="scaleToFill" class="item" @click="previewImgHandler(idx)"></image>
					</swiper-item>
				</swiper>
				<!-- 芝麻信用免押图片 -->
				<!-- <image
          class="label"
          src="../../static/product/zhima.png"
          mode="scaleToFill"
        ></image> -->
			</view>
		</dot>
		<!-- 商品介绍 -->
		<view class="name">
			<view class="price-area">
				<view class="left">
					<text class="m">¥</text>
					<text class="l">{{ getPartMoney(true, data.lowestSalePrice) }}</text>
					<text class="d">.</text>
					<text class="r">{{ getPartMoney(false, data.lowestSalePrice) }}</text>
					<text class="r">/天</text>
					<!-- <text class="right">官方售价{{ returnMinMarketPrice() }}元起</text> -->
				</view>
				<!-- <view class="right">已租{{ data.salesVolume || 0 }}</view> -->
			</view>
			<!-- 优惠券 -->
			<view class="select_header" @click="$refs.couponList.show()">
				<view class="couponView">
					<text class="couponText">首月立减</text>
					<text v-if="couponList[0]" class="couponText">领券立减{{ couponList[0].discountAmount }}</text>
				</view>
				<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
			</view>


			<view class="title">
				<text class="title-tops">{{ getOldNewText(data.oldNewDegree) }}</text>
				<text class="title-text">{{ data.name }}</text>
			</view>
<!-- 			<view style="display: flex; margin: 20rpx 0 10rpx 0">
				<view class="labels" v-for="(item, index) in data.labels || []" :key="index">
					<view class="items">
						<text class="item">{{ item }}</text>
					</view>
				</view>
			</view> -->
			
			<!-- 芝麻免押 -->
			<view class="select_header my">
				<view style="display: flex;align-items: center;">
					<view class="header_laber">
						<image src="https://oss.chuangliukeji.com/backstage/2024-08-20/1dfd6166673d44d6930596f2996e7926.png" mode="widthFix" style="width: 129rpx;"></image>
						<!-- <view>芝麻免押</view> -->
					</view>
					<text class="laber_text">商品押金 ¥{{data.productSkuses[0].marketPrice}}</text>
				</view>
				<view class="laber_text">
					{{data.minRentCycle}}天起租·可续租·可买断
				</view>
			</view>
			<!-- 4个标签 -->
			<view class="fourLaber">
				<view class="laberView" v-for="(item, index) in laberList" :key="index">
					<image :class="`laber_img laber_img`+ index" :src="item.img"></image>
					<view>{{item.text}}</view>
					<view v-if="index < 3" class="laber_line"></view>
				</view>
			</view>
		</view>
		<!-- 服务 -->
		<view class="select-content">
			<view class="coupon">
				<view class="describe" @tap="$refs.shopService.show()">
					<text class="pd">服务</text>
					<view class="center">
						<view class="center_view">
							<image src="../../static/product/fill5.png"></image>
							<view>人工服务</view>
						</view>
						<view class="center_view">
							<image src="../../static/product/fill5.png"></image>
							<view>顺丰服务</view>
						</view>
						<view class="center_view">
							<image src="../../static/product/fill5.png"></image>
							<view>碎屏服务</view>
						</view>
					</view>
					<text class="red">
						<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
					</text>
				</view>
			</view>
			<view class="coupon" @tap="$refs.productDetails.show()">
				<view class="describe">
					<text class="pd">选择</text>
					<view class="center">
						<text class="center_text">已选择：{{SpecsText}}</text>
					</view>
					<text class="red">
						<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
					</text>
				</view>
			</view>
			<view class="coupon">
				<view class="describe baseline">
					<text>配送</text>
					<view class="center flexColumn">
						<view>
							顺丰快递｜寄出保障｜归还自付
						</view>
						<view class="laberView">
							<text class="laberText">极快发货</text>
							<text style="padding: 0rpx 8rpx;">现货，现在完成支付，24小时极速发货</text>
						</view>
					</view>
					<text class="arrow"></text>
				</view>
			</view>
			<!-- <view class="coupon">
				<view class="describe">
					<text class="pd">参数</text>
					<view class="center">
						<text>请选择：颜色；配置；租赁方案；租期</text>
					</view>
					<text class="red">
						<image mode="scaleToFill" class="arrow" src="../../static/my/jiantou.png"></image>
					</text>
				</view>
			</view> -->
			
		</view>
		
		<!-- 商品详情 -->
		<view class="details">
			<view class="tabs">
				<view v-for="(item, index) in tabs" :key="index" class="item" @tap="onSelectCurrent(index)" :style="{
            marginRight: index === 0 ? '83rpx' : 0,
            fontWeight: selectCurrent === index ? 700 : 400,
          }">
					{{ item }}
					<view class="select" v-if="selectCurrent === index"></view>
					<view class="select" style="visibility: hidden" v-else></view>
				</view>
			</view>
			<view class="parameter" v-if="selectCurrent === 0">
				<view v-if="data.parameters.length">
					商品参数
					<view class="parameterItem">
						<t-table border-color="#DEDEDE">
							<t-tr v-for="(item, index) in data.parameters" :key="index">
								<t-td width="40%">{{ item.name }}</t-td>
								<t-td width="60%">{{ item.value }}</t-td>
							</t-tr>
						</t-table>
					</view>
				</view>
				商品介绍
				<mp-html :content="data.detail" :lazy-load="true" />
			</view>
			<view class="explain" v-else>
				<image class="explain-img"
					src="https://oss.chuangliukeji.com/backstage/2023-04-04/7b4f56ae081e4671a8041cc18e0afeb9.png"
					mode="scaleToFill" :lazy-load="true"></image>
			</view>
		</view>
		<!-- 为你推荐 -->
		<view class="wntj">
			<view style="text-align: center">
				<image src="../../static/product/wntj.png" mode="scaleToFill" :lazy-load="true" class="imgtitle">
				</image>
			</view>
			<view class="productList">
				<view v-for="(obj, idx) in recommendLite" :key="idx" class="product-item">
					<productItem :productObj="obj" :showTag="true" :isWaterfallFlow="false">
						<XinjiuSlot slot="topLeft" :productObj="obj"></XinjiuSlot>
					</productItem>
				</view>
			</view>
		</view>
		<!-- 底部tab按钮功能 -->
		<view class="footer">
			<view class="home" @click="this.$onTo('/pages/index/index')">
				<image
					src="../../static/product/fill6.png"
					class="home-img"></image>
				<view class="text">首页</view>
			</view>
			<!--  @click="goShopDetail" -->
			<view class="home" @tap="$refs.contact.show()">
				<image src="../../static/product/fill7.png"
					class="home-img"></image>
				<view class="text">客服</view>
			</view>
			<view class="home">
				<image src="../../static/product/fill8.png" mode="scaleToFill"
					:class="{ 'home-img': true, hide: collected }" @click="addProductCollection"></image>
				<image src="../../static/product/fill9.png" mode="scaleToFill"
					:class="{ 'home-img': true, hide: !collected }" @click="cancelProductCollection"></image>
				<view class="text">收藏</view>
			</view>
			<!-- <view class="bot" @tap="$refs.contact.show()" style="margin-left: 32rpx">联系客服</view> -->
			<view class="bot_my" @click="productDetailssShow" style="margin-left: 100rpx">
				立即免押
			</view>
		</view>
		<!--联系客服popup       height="372"-->
		<wyb-popup ref="contact" type="bottom" height="272" width="500" radius="12" :showCloseIcon="true" title="联系客服">
			<view class="contact">
				<view class="item">
					<view class="item-left">
						<view class="title">商家客服</view>
						<view class="fu">服务时间 9:30-18:00</view>
					</view>

					<image class="item-right" @click="onPhone" src="../../static/product/sjkf.png" mode="scaleToFill">
					</image>
				</view>
				<view class="item">
					<!-- <view class="item-left">
            <view class="title">在线客服</view>
            <view class="fu">在线云客服帮您解决问题</view>
          </view> -->
					<!-- 支付宝智能客服 -->
					<!-- alipay-card-no:动值上线需要更换 -->
					<!-- <contact-button
            :tnt-inst-id="information.tntInstId"
            :scene="information.scene"
            size="32"
            :alipay-card-no="thirdId"
            icon="../../static/product/zxkf.png"
          /> -->
				</view>
			</view>
		</wyb-popup>
		<!-- 免押租popup -->
		<wyb-popup ref="productDetails" type="bottom" width="500" radius="12" :showCloseIcon="true">
			<view class="productDetails">
				<view class="shop" style="height: 170rpx">
					<image :src="data.images[0].src" mode="scaleToFill" class="img"></image>
					<view class="content">
						<view class="price-area">
							<view class="left">
								<text class="m">¥</text>
								<text class="l">{{
                  getPartMoney(true, choiceCycs.price)
                }}</text>
								<text class="d">.</text>
								<text class="r">{{
                  getPartMoney(false, choiceCycs.price)
                }}</text>
								<text class="r">/天</text>
							</view>
							<view class="area_text">
								已选：{{SpecsText}}
							</view>
							<!-- <view>
								<text class="fut">轻松续租</text>
								<text class="fut"
									v-if="buyOutSupportType[data.buyOutSupport]">{{ buyOutSupportType[data.buyOutSupport] }}</text>
								<text class="fut" v-if="returnRuleType[data.returnRule]">{{returnRuleType[data.returnRule]}}</text>
							</view> -->
						</view>
					</view>
				</view>
				<!-- 一二级规格数据 -->
				<view style="max-height: 700rpx; overflow: auto">
					<view v-for="(item, index) in getFirstAndSecondCategory()" :key="index" class="choice">
						<view class="title">{{ item.name }}</view>
						<text v-for="(itemChild, indexChild) in item.values" :key="indexChild" @click="
                handleSkuClick(
                  itemChild && itemChild.productSpecId,
                  currentSku.specAll[index].platformSpecId,
                  index === 0
                )
              " :class="{
                'title-item': true,
                'title-item-disabled':
                  index == 1 &&
                  !checkCurrentSecondCategoryExists(itemChild.productSpecId),
              }" :style="{
                border:
                  currentSku.specAll[index].platformSpecId ===
                  itemChild.productSpecId
                    ? '2rpx solid #1677FF'
                    : '2rpx solid #F5F5F5',
                background:
                  currentSku.specAll[index].platformSpecId ===
                  itemChild.productSpecId
                    ? '#E7F1FF'
                    : '#F5F5F5',
				color:
				    currentSku.specAll[index].platformSpecId ===
				    itemChild.productSpecId
				      ? '#1677FF'
				      : '#333333',
              }">
							{{ itemChild.name }}
							<!-- <text v-if="itemChild.full" class="bubble">租满即送</text> -->
							<text v-if="itemChild.full" class="bubble">正品好物</text>
						</text>
					</view>
					<view class="choice">
						<view class="title">套餐</view>
						<text v-for="(day, index) in allDays" :key="index" :class="{
                'title-item': true,
                'title-item-disabled': !checkDayIsExists(day),
              }" @click="getDays(day)" :style="{
                border:
                  choiceDays === day
                    ? '2rpx solid #1677FF'
                    : '2rpx solid #F5F5F5',
                background: choiceDays === day ? '#E7F1FF' : '#F5F5F5',
				color: choiceDays === day ? '#1677FF' : '#333333',
              }">
							<text v-if="day == 180&&data.rentRuleId == 1">6个月灵活租用</text>
							<text v-if="day == 365&&data.rentRuleId == 1">12个月灵活租用</text>
							<text v-if="data.rentRuleId !== 1">{{day == 270 || day == 600 ? '租完归还-可随时买断' : day == 365 ? '租完即送' : day + '天'}}</text>
							<image v-if="data.rentRuleId == 1" @click="getServicesData(day)"
								src="../../static/product/sm.png" mode="scaleToFill" class="sm"></image>
						</text>
						<!-- <view class="remakeTitle" v-if="choiceDays == 270 || choiceDays == 600">
							<text class="remakeText1">须知：</text>
							<text v-if="choiceDays == 270 || choiceDays == 600">租期内，请按时支付每期租金，或您可随时买断商品，获得商品所有权;如未买断，到期后您应按时归还;</text>
<text v-if="choiceDays == 365">租期内按时支付每期租金，在租至第7个月起，且当期租金已付,不存在任何逾期情形，当期租期内商品支持随时归还，无需支付违约金，当期剩余租金不退;同时您可随时买断商品，或按时支付每期租金，到期后您可0元买断商品，获得商品所有权;</text>
						</view> -->
					</view>
					<view class="choice">
						<view class="title">起租日期</view>
						<text v-for="(time, index) in data.selectionTime" :key="index" :class="{
		        'title-item': true,
		        'title-item-disabled': !checkTimeIsExists(time),
		      }" @click="getTimes(time)" :style="{
		        border:
		          choiceTime === time
		            ? '2rpx solid #1677FF'
		            : '2rpx solid #F5F5F5',
		        background: choiceTime === time ? '#E7F1FF' : '#F5F5F5',
				color: choiceTime === time ? '#1677FF' : '#333333',
		      }">
							<text v-if="time == 1">立即支付租金</text>
							<text v-else>{{time}}支付租金</text>
						</text>
					</view>
				</view>
				<view style="display: flex; justify-content: center">
					<button v-if="!submitLoading" class="an" open-type="getAuthorize" scope="phoneNumber" @getAuthorize="onGetPhone">
						确定
					</button>
					<button v-else class="an">
						确定
					</button>
				</view>
			</view>
		</wyb-popup>
		<!-- 优惠券popup -->
		<wyb-popup ref="couponList" type="bottom" width="500" radius="12" :showCloseIcon="true" title="优惠券" bgColor="rgba(255, 255, 255, 1)" closeIcon="https://oss.chuangliukeji.com/backstage/2024-04-24/5eedb31fa6e94dc7bffcf09a5b88cdd3.png" closeIconSize="48" closeIconPos="top-left">
			<view class="coupons">
				<view class="coupon-item" v-for="(item, index) in couponList" :key="index">
					<view class="item-left">
						<!-- <view style="width: 200rpx">
              <view class="title">
                <text style="font-size: 24rpx">￥</text>
                {{ item.discountAmount }}
              </view>
              <view class="fu">满{{ item.minAmount }}可用</view>
            </view> -->
						<view style="width: 200rpx" v-if="item.discountRate == null">
							<view class="title">
								<text style="font-size: 24rpx">￥</text>
								{{ item.discountAmount }}
							</view>
							<view class="fu">满{{ item.minAmount }}可用</view>
						</view>
						<view style="width: 200rpx" v-else>
							<view class="title">
								{{ item.discountRate }}
								<text style="font-size: 24rpx">折</text>
							</view>
							<view class="fu">满{{ item.minAmount }}可用</view>
						</view>
						<view class="item-content">
							<view class="title">{{ item.title }}</view>
							<view class="fu">
								<text class="b"></text>
								<text v-if="item.delayDayNum">领取后{{ item.delayDayNum }}天有效</text>
								<text v-else>{{ item.time }}</text>
							</view>
							<view class="fu">
								<text class="b"></text>
								{{ item.rangeStr }}
							</view>
						</view>
					</view>

					<view class="item-right">
						<view class="bindno" v-if="!item.bind" @click="onBindCoupon(item.templateId)">
							领取
						</view>
						<view v-else class="bindyes">去使用</view>
					</view>
				</view>
			</view>
		</wyb-popup>
		<!-- 增值服务详情 -->
		<wyb-popup ref="serviceDetails" type="bottom" width="500" radius="6" :showCloseIcon="true" title="租用说明"
			bgColor="rgba(247, 248, 251, 1)">
			<view class="flex_class">
				<view class="title_garden"></view>
				<text>起租{{serviceDetailsTitle}}期</text>
			</view>
			<view class="flex_class">
				<view class="title_garden"></view>
				<text>到期可选</text>
			</view>
			<view class="flex_type">
				<view class="type_title">续租</view>
				<view class="type_content">
					最长可续{{serviceDetailsTitle}}期，续租期间内可以随时买断和归还，续租期满{{serviceDetailsTitle}}个月可拥有此商品</view>
			</view>
			<view class="flex_type">
				<view class="type_title">买断</view>
				<view class="type_content">只需一次性支付即可拥有此商品(买断金为当前该商品的剩余市场价值)</view>
			</view>
			<view class="flex_type" style="margin-bottom: 50rpx;">
				<view class="type_title">续租</view>
				<view class="type_content">可在订单到期时申请归还，以物流签收为实际归还时间，如归还逾期需支付当月租金</view>
			</view>

		</wyb-popup>
		
		<!-- 服务-popup -->
		<wyb-popup ref="shopService" type="bottom" width="500" radius="12" :showCloseIcon="true" title="商品服务" bgColor="rgba(255, 255, 255, 1)" closeIcon="https://oss.chuangliukeji.com/backstage/2024-04-24/5eedb31fa6e94dc7bffcf09a5b88cdd3.png" closeIconSize="48" closeIconPos="top-left">
			<view class="shopService">
				<view class="shopService_list">
					<view class="shopService_list_title">
						<image src="../../static/product/fill5.png"></image>
						<text>人工服务</text>
					</view>
					<view>工作日9:00-18:00内，如遇到任何问题，都可联系客服进行反馈解决，客服电话:18969032669</view>
				</view>
				<view class="shopService_list">
					<view class="shopService_list_title">
						<image src="../../static/product/fill5.png"></image>
						<text>顺丰包邮</text>
					</view>
					<view>寄出提供顺丰快递（或其他优质快递）包邮直达服务，让您更快时间收到货；</view>
				</view>
				<view class="shopService_list">
					<view class="shopService_list_title">
						<image src="../../static/product/fill5.png"></image>
						<text>碎屏服务</text>
					</view>
					<view>自签收后且属于在租期间，若设备出现符合「质量保修范围」内的碎屏服务，用户可要求申请1次「免费维修」服务。</view>
				</view>
			</view>
		</wyb-popup>
	</view>
</template>

<script>
	import dot from "@/components/uni-swiper-dot/uni-swiper-dot.vue";
	import tTable from "@/components/t-table/t-table.vue";
	import tTr from "@/components/t-table/t-tr.vue";
	import tTd from "@/components/t-table/t-td.vue";
	import mpHtml from "@/components/mp-html/mp-html";
	import wybPopup from "@/components/wyb-popup/wyb-popup.vue";
	import ProductItem from "../../components/productItem/productItem.vue";
	import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue";
	import uniNoticeBar from "../../components/uni-notice-bar/uni-notice-bar.vue";
	import {
		getZWZUserDetail,
		checkHasPhone,
		loginHandler,
		backUserUpload
	} from "@/utils/index.js";
	import {
		OLD_NEW_MAP,
		EMPTY_PLACEHOLDER,
		freightTypeObj,
		tabsDetails,
		shareConfigObj,
	} from "../../utils/constant.js";
	import {
		channelMaiDianHandler,
	} from "../../utils/index";

	// TODO: 测试一下显示加个，以及下单
	
	const plugin = requirePlugin('thePlugin');

	export default {
		data() {
			return {
				imgList: [], //商品banner图列表
				current: 0, //商品图下标
				data: {}, //全局数据
				tabs: tabsDetails, //商品详情tab
				selectCurrent: 0, //商品tab下标
				information: this.$getGlobalData("information"),
				couponList: [], //优惠券列表
				recommendLite: [], //为你推荐商品列表
				productId: "", //商品id
				currentSku: {}, // 当前选中的租期、规格对象；默认值是接口返回productSkuses的第一个数据
				choiceDays: 1, //租期天数
				choiceCycs: {}, //租期数据
				// buyOutSupportType: {
				//   1: "随时买断",
				//   2: "到期买断",
				//   0: "",
				// },
				buyOutSupportType: {
					1: "",
					2: "",
					0: "",
				},
				returnRuleType: {
					1: "随时归还",
					2: "到期归还",
				},
				thirdId: getZWZUserDetail().thirdId,
				collected: false, //是否收藏

				serviceDetailsTitle: 6, //灵活租用日期
				choiceTime: '', //起租时间
				
				laberList: [
					{
						img: '../../static/product/fill3.png',
						text: '正品保障'
					},
					{
						img: '../../static/product/fill2.png',
						text: '官方质保'
					},
					{
						img: '../../static/product/fill1.png',
						text: '芝麻免押'
					},
					{
						img: '../../static/product/fill4.png',
						text: '隐私保证'
					},
				],
				SpecsText: '请选择：颜色；配置；租赁方案；租期',
				menuTop: 0,
				
				submitLoading : false,
			};
		},

		components: {
			dot,
			tTable,
			mpHtml,
			tTr,
			tTd,
			wybPopup,
			ProductItem,
			XinjiuSlot,
			uniNoticeBar,
		},

		onLoad(e) {
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
				this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
				channelMaiDianHandler(); // 进行埋点上传
			}

			//获取商品id
			// this.productId = e.productId
			this.productId = this.$getPageParams(e, "productId");
			//获取商品数据
			this.$request(
					"hzsx/aliPay/product/getProductDetailLite", {
						itemId: this.productId,
					},
					"get",
					true,
					true
				)
				.then((res) => {
					//如果商品下架跳商品详情页面
					this.imgList = res.images;
					if (res.selectionTime && res.immediate == true) { //有起租时间且有立刻租用+1
						res.selectionTime = ["1", ...res.selectionTime]; //起租时间添加1，1为立即租用
					}
					this.data = res;
					const initSkuObj = res.productSkuses[0] || {};
					this.currentSku = initSkuObj;

					// 选中最大租期，并不一定是数组第一个数据
					const initCycsList = initSkuObj.cycs || []; // 租期列表
					const sortCb = (o1, o2) => o1.days - o2.days;
					initCycsList.sort(sortCb); // 按租期从小到大排序
					const initCycsObj = initCycsList[0] || {}; // 默认最小租期

					this.choiceCycs = initCycsObj;
					this.choiceDays = initCycsObj.days || 1;
					this.choiceTime = (res.selectionTime)[0]; //起租时间
					this.collected = res.collected;
					// this.shopId = res.shopId;
					this.getCoupon();
					this.getRecommendLite();
					
					// 展示已选规格的文字
					this.getSpecsText();
					// 支付宝优惠组件
					this.zfbDiscount();
				})
				.catch((res) => {
					if (res.errorCode === "RPC000011")
						this.$onTo(
							`/pages/offShelves/offShelves?productId=${this.productId}`,
							false,
							true
						);
				});
			//获取高度 
			this.getMenu();
		},

		onShareAppMessage() {
			return {
				...shareConfigObj,
				path: `/pages/product/product?productId=${this.productId}`,
			};
		},

		computed: {
			allDays: function() {
				const skuList = this.data?.productSkuses || []; // 商品的sku列表
				// 每个sku对象里面对应了租期列表
				let dayArr = [];
				skuList.forEach((skuObj) => {
					const currentSkuCycles = skuObj?.cycs || []; // 当前sku所对应的租期列表数据
					currentSkuCycles.forEach((cycleObj) => {
						const day = cycleObj?.days;
						if (day && !dayArr.includes(day)) {
							// 副作用：过滤掉了非真租期
							dayArr.push(day);
						}
					});
				});
				dayArr = dayArr.sort((n1, n2) => n1 - n2);
				return dayArr;
			},
		},

		methods: {
			
			// 支付宝优惠组件
			async zfbDiscount() {
				const params = {
				      // 仅为代码说明，具体参数参考入参表格！
				      itemDetailInfo: {
				        outItemId: this.productId,
				        // outSkuId: 'zh030206-1',
				        // price: '100.1',
				      },
				    };
					
				const res = await plugin.getDetailPageDiscountInfo(params) || {};
				console.log("res2111111111111111111111111",res);
				const {
				  success,
				  resultCode, // 错误码
				  resultMsg, // 错误信息
				  showStatus, // 是否要展示组件
				  buyRestrict, // 是否允许购买
				  consultDetailInfoList = [], // 商品每个sku的优惠信息详情
				} = res;
				if (!success) {
				  console.error('商详前置优惠接口失败');
				}else {
					console.log('su-------------------------------------------',success);
				}
			},
			
			// 弹出商品规格弹窗
			productDetailssShow() {
				this.$refs.productDetails.show();
				if (!getZWZUserDetail().telephone) {
					this.$uma.trackEvent('16',{ path: '点击立即免押按钮' });
				}
			},
			/**
			 * 查找最低的市场售价
			 */
			returnMinMarketPrice() {
				const skuList = this.data?.productSkuses || []; // 租期列表
				let min = skuList[0]?.marketPrice || 0;
				for (const skuObj of skuList) {
					const {
						marketPrice
					} = skuObj || {};
					if (marketPrice < min) {
						min = marketPrice;
					}
				}
				return min;
			},

			/**
			 * 灵活租期解释
			 */
			getServicesData(val) {
				this.serviceDetailsTitle = val == 180 ? '6' : '12';
				this.$refs.serviceDetails.show();
			},

			/**
			 * 返回一级规格和二级规格数据
			 */
			getFirstAndSecondCategory() {
				return this.data?.specs || [];
			},
			
			/**
			 * 展示已选的规格文字
			 */
			getSpecsText() {
				const SpecsList = this.getFirstAndSecondCategory();
				const allSpeceDays = this.allDays;
				let color = (SpecsList[0].values)[0].name || '';
				let spece = (SpecsList[1].values)[0].name || '';
				let days = allSpeceDays[0] || "";
				// 灵活租用方案-常规方案展示
				let daysText;
				if(this.data.rentRuleId == 1){
					if(days == 180){
						daysText = '6个月灵活租用'
					}else if(days == 365){
						daysText = '12个月灵活租用'
					}else{
						daysText = days + '天'
					}
				}else{
					if(days == 270 || days == 600){
						daysText = '租完归还-可随时买断'
					}else if(days == 365){
						daysText = '租完即送'
					}else{
						daysText = days + '天'
					}
				}
				this.SpecsText = color + '，' + spece + '，' + daysText;
			},
			clickSpecsText(day,skus) {
				const SpecsList = skus.specAll;
				const allSpeceDays = day;
				let color = SpecsList[0].platformSpecValue || '';
				let spece = SpecsList[1].platformSpecValue || '';
				let days = allSpeceDays;
				// 灵活租用方案-常规方案展示
				let daysText;
				if(this.data.rentRuleId == 1){
					if(days = 180){
						daysText = '6个月灵活租用'
					}else if(days = 365){
						daysText = '12个月灵活租用'
					}else{
						daysText = days + '天'
					}
				}else{
					if(days == 270 || days == 600){
						daysText = '租完归还-可随时买断'
					}else if(days == 365){
						daysText = '租完即送'
					}else{
						daysText = days + '天'
					}
				}
				this.SpecsText = color + '，' + spece + '，' + daysText;
			},

			/**
			 * 判断对于当前选中的一级规格来说是否包含该二级规格
			 */
			checkCurrentSecondCategoryExists(id) {
				const currentSpecs = this.currentSku?.specAll || []; // 当前所选中的规格
				const firstSpecObj = currentSpecs[0] || obj;
				const firstSpecId = firstSpecObj?.platformSpecId; // 一级分类的ID

				let exists = false;
				const allSkus = this.data?.productSkuses || []; // 所有sku列表数据
				allSkus.forEach((skuObj) => {
					const specAlls = skuObj?.specAll || [];
					const fId = specAlls[0]?.platformSpecId;
					const sId = specAlls[1]?.platformSpecId;

					if (fId == firstSpecId && sId == id) {
						exists = true;
						return;
					}
				});

				return exists;
			},
			//判断选择起租时间
			checkTimeIsExists(time) {
				const times = this.data.selectionTime;
				let flag = false;
				for (const obj of times) {
					if (obj == time) {
						flag = true;
						break;
					}
				}
				return flag
			},

			/**
			 * 选择起租日期触发
			 * @param {Object} time :起租日期 2020-12-12
			 */
			getTimes(timeDate) {
				const isDisabled = !this.checkTimeIsExists(timeDate);
				if (isDisabled) return;
				this.choiceTime = timeDate;
			},

			// 判断当前勾选天数是否存在
			checkDayIsExists(day) {
				const days = this.currentSku?.cycs || []; // 当前选中sku所拥有的租期列表数据
				let flag = false;
				for (const obj of days) {
					if (obj?.days == day) {
						flag = true;
						break;
					}
				}
				return flag;
			},

			/**
			 * 选中租期时触发
			 * @param {Number} dayNum : 租期天数，数字
			 */
			getDays(dayNum) {
				const isDisabled = !this.checkDayIsExists(dayNum);
				if (isDisabled) return;
				this.choiceCycs = this.findCycleObjByDay(dayNum); // 根据所选中的天数找出租期对象
				this.choiceDays = dayNum;
				// ---展示已选的商品配置文字
				this.clickSpecsText(this.choiceDays,this.currentSku);
			},

			/**
			 * 根据租期天数找出租期对象
			 * @param {Number} d : 所选中的租期天数
			 */
			findCycleObjByDay(d) {
				const cycsList = this.currentSku?.cycs || [];
				const matchObj = cycsList.find((obj) => obj.days == d);
				return matchObj || {};
			},

			/**
			 * 点击规格/颜色的时候触发
			 * @param {*} valueId : 当前所点击的颜色/规格的productSpecId
			 * @param {*} preId : 之前的颜色/规格的productSpecId
			 * @param {*} isChangeFirstCategory : 是否是修改第一级目录
			 */
			handleSkuClick(valueId, preId, isChangeFirstCategory) {
				if (valueId === preId) {
					return;
				}
				if (
					!isChangeFirstCategory &&
					!this.checkCurrentSecondCategoryExists(valueId)
				) {
					// 点击二级目录 且 该规格不存在
					return;
				}

				const productSkuses = this.data?.productSkuses || []; // 该商品所对应的sku列表
				const currentSku = this.currentSku;

				// 下面这一步是找出发生修改之后的一二级规格ID数据
				const specIds = currentSku.specAll.map((value) =>
					value.platformSpecId === preId ? valueId : value.platformSpecId
				);

				// 下面这一步是找出新的sku对象，根据一二级skuID去匹配
				let newCurrentSku = {};
				if (productSkuses.length) {
					newCurrentSku = productSkuses.find((sku) => {
						let returnVal = true;
						sku.specAll.forEach((value) => {
							if (specIds.indexOf(value.platformSpecId) < 0) {
								returnVal = false;
							}
						});
						return returnVal;
					});
				}

				if (!newCurrentSku && isChangeFirstCategory) {
					// 修改了一级分类后，很可能当前选中的二级分类并不存在，那么此时帮用户选中第一个二级分类
					newCurrentSku =
						productSkuses.find((sku) => {
							if (sku.specAll[0].platformSpecId === valueId) {
								// 匹配一级分类即可
								return true;
							}
							return false;
						}) || {};
				}

				// 判断当前选中的天数是否需要进行重置
				const newCycleList = newCurrentSku.cycs; // 新规格的租期对象列表数据
				const oldActiveDay = this.choiceDays; // 当前已选中的租期

				const exists =
					newCycleList.find((obj) => obj.days == oldActiveDay) != undefined; // 判断当前选中的租期在新sku的租期列表中是否存在

				let newActiveDay = oldActiveDay;
				if (!exists) {
					// 当前选中的租期在新的sku中不存在，那么帮用户降级
					const sortCb = (o1, o2) => o2.days - o1.days;
					const tempList = newCycleList.sort(sortCb); // 副作用：从大到小排序了，如果这个数据会直接用来进行UI展示，那么会出现天数从大到小显示的bug
					newActiveDay = tempList[0]?.days;
				}
				this.currentSku = newCurrentSku; // 这步必须在findCycleObjByDay上面
				this.choiceDays = newActiveDay;
				this.choiceCycs = this.findCycleObjByDay(newActiveDay);
				// ---展示已选的商品配置文字
				this.clickSpecsText(this.choiceDays,this.currentSku);
			},

			//获取商品banner图下标
			onBanner(e) {
				this.current = e.detail.current;
			},
			//领取优惠券
			onBindCoupon(templateId) {
				this.$request(
					"/hzsx/lite/couponCenter/bindCoupon", {
						templateId,
						phone: getZWZUserDetail().telephone,
						uid: this.$getUid(),
					},
					"post"
				).then((res) => {
					uni.showToast({
						title: res.data
					});
					this.getCoupon();
				});
			},
			//获取为你推荐列表
			getRecommendLite() {
				this.$request(
					"/hzsx/aliPay/product/recommendLite", {
						productId: this.productId
					},
					"get"
				).then((res) => {
					this.recommendLite = res.data;
				});
			},
			//获取优惠券列表
			getCoupon() {
				this.$request(
					"hzsx/lite/couponCenter/getProductCoupon", {
						productId: this.productId
					},
					"get",
					true
				).then((res) => {
					this.couponList = res.data;
				});
			},
			//运费对应
			getfreight() {
				return freightTypeObj[this.data.freightType] || EMPTY_PLACEHOLDER;
			},
			getOldNewText(oldNewDegree) {
				const level = oldNewDegree; // 新旧程度标识
				return OLD_NEW_MAP[level] || EMPTY_PLACEHOLDER;
			},
			/**
			 * 获取金额的小数点前、后的数据
			 * @param {Boolean} isFront : 是否是前半部分
			 */
			getPartMoney(isFront, price) {
				const _price = price || "";
				if (!_price) return EMPTY_PLACEHOLDER;
				const list = _price.toString().split(".");
				const result = isFront ? list[0] : list[1];
				return result || 0;
			},
			//切换为你推荐tab
			onSelectCurrent(i) {
				this.selectCurrent = i;
			},
			//拉起手机电话
			onPhone() {
				uni.makePhoneCall({
					phoneNumber: this.data.serviceTel,
				});
			},

			//提交订单
			onConfirm() {
				this.$setGlobalData("productIdForXieyi", this.productId); // 保存产品ID，confirm页面的相关接口并没有返回该相关信息
				this.$onTo(
					`pages/confirm/confirm?duration=${this.choiceDays}&skuId=${this.currentSku.skuId}&productId=${this.productId}&choiceTime=${this.choiceTime}&shopId=${this.data?.shopId}`
				);
				setTimeout(() => {
				    this.submitLoading = false
				}, 3000);
				
			},
			//获取手机号
			onGetPhone() {
				if (this.submitLoading) {
					return
				}
				this.submitLoading = true;
				if (!getZWZUserDetail().telephone) {
					this.$uma.trackEvent('17',{ path: '点击立即确认按钮' });
				}
				let isPhone = checkHasPhone();
				if (isPhone) {
					this.onConfirm();
				} else {
					my.getPhoneNumber({
						success: (res) => {
							//进行留资回传的处理方法-手机号授权
							backUserUpload('221');
							let encryptedData = res.response;
							this.sucHandler(encryptedData);
						},
						fail: (err) => {
							this.submitLoading = false,
							uni.showModal({
								title: '提示',
								content: '若点击不授权，将会影响订单审核',
								cancelText: '不授权',
								cancelColor: '#999',
								confirmText: '授权',
								confirmColor: '#FFCB31',
								success(res) {
									if (res.confirm) {
										// 选择弹框内授权
										uni.openSetting({
											success(res) {
												console.log(res.authSetting)
											}
										})
									} else if (res.cancel) {
										// 选择弹框内 不授权
										console.log('用户点击不授权')
									}
								}
							})
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
			/**
			 * 跳转到商家详情页面
			 */
			goShopDetail() {
				this.$onTo(`/pages/shops/index?shopId=${this.data?.shopId}`);
			},

			//收藏
			addProductCollection() {
				this.$request(
					"hzsx/userCollection/addProductCollection", {
						resourceId: this.productId,
						resourceType: "PRODUCT",
						uid: this.$getUid(),
					},
					"post"
				).then((res) => {
					this.collected = true;
					uni.showToast({
						title: "收藏成功",
						icon: "none",
					});
				});
			},
			//取消收藏
			cancelProductCollection() {
				this.$request(
					"hzsx/userCollection/cancelProductCollection", {
						resourceId: this.productId,
						resourceType: "PRODUCT",
						uid: this.$getUid(),
					},
					"post"
				).then((res) => {
					if (res) {
						this.collected = false;
						uni.showToast({
							title: "取消收藏成功",
							icon: "none",
						});
					}
				});
			},
			/**
			 * 图片预览的时候触发
			 * @param {Number} idx : 预览图片的索引位置
			 */
			previewImgHandler(idx) {
				let _imgList = this.imgList.map((itme) => itme.src);
				uni.previewImage({
					current: idx,
					urls: _imgList,
				});
			},
			//
			getMenu() {
				const {
					height,
					top
				} = uni.getMenuButtonBoundingClientRect();
				this.menuTop = top;
			},
		},
	};
</script>

<style lang="scss">
	page {
		padding-bottom: 150rpx;
	}

	.product {
		.hide {
			display: none;
		}

		.header-banner {
			width: 750rpx;
			height: 750rpx;
			background-color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			position: relative;

			.header-title {
				position: absolute;
				top: 0;
				width: 100%;
			}

			.swiper-img {
				width: 750rpx;
				height: 750rpx;

				.item {
					width: 750rpx;
					height: 750rpx;
				}
			}

			.label {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 492rpx;
				height: 70rpx;
			}
		}

		.name {
			background-color: #ffffff;
			padding: 0 30rpx 28rpx 30rpx;
			border-radius: 0rpx 0rpx 10rpx 10rpx;

			.title {
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 2;
				position: relative;
				overflow: hidden;
				font-size: 30rpx;
				font-family: PingFangSC-Light, PingFang SC;
				font-weight: 300;
				color: #333333;
				line-height: 44rpx;
				word-break: break-all;
				// padding-top: 20rpx;

				.title-tops {
					height: 32rpx;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					line-height: 32rpx;
					padding: 2rpx 15rpx 2rpx 15rpx;
					// @include global-background-color2();
					border-radius: 5rpx;
					margin-right: 8rpx;
					// margin-bottom: 3rpx;
					background: url('https://oss.changxiangwl.cn/backstage/2024-09-30/64eae30bd9044850b950c96439cfc582.png');
					background-size: 100% 100%;
				}

				.title-text {
					position: relative;
					top: 4rpx;
					font-weight: bold;
				}
			}

			.labels {
				.items {
					display: flex;

					.item {
						border: 1rpx solid #e52021;
						border-radius: 5rpx;
						height: 30rpx;
						font-size: 22rpx;
						font-weight: 300;
						color: #e52021;
						line-height: 30rpx;
						padding: 1rpx 8rpx 1rpx 8rpx;
						margin-right: 10rpx;
					}
				}
			}

			.price-area {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: space-between;

				// padding-bottom: 31rpx;
				.left {
					color: #e52021;

					.m {
						font-size: 24rpx;
						margin-right: 6rpx;
					}

					.l {
						font-size: 48rpx;
						font-weight: 500;
					}

					.d {
						font-size: 24rpx;
					}

					.r {
						font-size: 22rpx;
						font-weight: 500;
					}
				}

				.right {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-left: 10rpx;
					margin-bottom: 3rpx;
				}
			}

			.select_header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 44rpx;
				
				.couponView{
					display: flex;
					align-items: center;
				}
				
				.couponText{
					font-size: 20rpx;
					color: #F93A4A;
					padding: 0rpx 4rpx;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					border: 1rpx solid #F93A4A;
					margin-right: 12rpx;
				}
				
				.arrow{
					width: 10rpx;
					height: 16rpx;
					margin-left: 10rpx;
				}
				
				.header_laber{
					width: 129rpx;
					height: 36rpx;
					background: #ECF4FF;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					font-size: 21rpx;
					color: #1677FF;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 8rpx;
				}
				.laber_text{
					font-size: 24rpx;
					color: #999999;
				}
			}
			.my {
				height: 36rpx;
				padding: 16rpx 0;
			}
			
			.fourLaber {
				height: 60rpx;
				background: #F5F5F5;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				font-size: 24rpx;
				color: #838383;
				margin-top: 4rpx;
				
				.laberView{
					display: flex;
					align-items: center;
					.laber_img{
						width: 20rpx;
						height: 24rpx;
						margin-right: 8rpx;
					}
					.laber_img0 {
						width: 20rpx;
						height: 24rpx;
					}
					.laber_img1 {
						width: 20rpx;
						height: 24rpx;
					}
					.laber_img2 {
						width: 18rpx;
						height: 22rpx;
					}
					.laber_img3 {
						width: 22rpx;
						height: 22rpx;
					}
					.laber_line{
						width: 1rpx;
						height: 16rpx;
						margin-left: 18rpx;
						background-color: #B6B6B6;
						border-radius: 4rpx;
					}
				}
			}
		}

		.select-content {
			margin: 20rpx 0;
			background-color: #ffffff;
			padding: 0rpx 30rpx 24rpx 30rpx;
			border-radius: 10rpx;
			.coupon {
				padding-top: 24rpx;
			}

			.describe {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #979aaa;
				font-size: 26rpx;
				height: 40rpx;
				// margin-top: 24rpx;

				.pd {
					// padding: 14rpx 0;
				}
				
				.center {
					width: 570rpx;
					color: #333333;
					display: flex;
					// white-space: nowrap;
					// overflow: hidden;
					// text-overflow: ellipsis;
					
					.center_text{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
					.center_view{
						font-size: 26rpx;
						color: #333333;
						display: flex;
						align-content: center;
						margin-right: 16rpx;
						 >image{
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;
						}
					}
					.laberView {
						display: flex;
						align-items: center;
					}
					.laberText{
						font-size: 20rpx;
						color: #1677FF;
						padding: 0rpx 8rpx;
						background: #E7F1FF;
						border-radius: 4rpx 4rpx 4rpx 4rpx;
						height: 32rpx;
						line-height: 32rpx;
					}
				}
				
				.flexColumn {
					flex-direction: column;
					line-height: 40rpx;
				}

				.arrow {
					width: 10rpx;
					height: 16rpx;
					margin-left: 10rpx;
				}
			}
			
			.baseline {
				height: 80rpx;
				align-items: baseline;
			}
		}

		.details {
			margin: 20rpx 0;
			background-color: #ffffff;
			padding: 0 40rpx;
			border-radius: 10rpx;

			.tabs {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 30rpx;

				.item {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;

					.select {
						width: 60rpx;
						height: 6rpx;
						@include global-background-color2();
						border-radius: 3rpx;
						margin: 0 auto;
						margin-top: 10rpx;
					}
				}
			}

			.parameter {
				font-size: 38rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #14151a;
				margin-top: 40rpx;

				.parameterItem {
					margin-top: 30rpx;
					margin-bottom: 80rpx;
				}
			}
		}

		.explain {
			.explain-img {
				width: 676rpx;
				height: 1361rpx;
				margin-top: 40rpx;
				margin-bottom: 55rpx;
			}
		}

		.footer {
			width: 100%;
			height: 98rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			display: flex;
			align-items: center;
			// justify-content: space-around;
			padding-bottom: 30rpx;
			z-index: 1999;

			.home {
				text-align: center;
				margin-left: 60rpx;
				.home-img {
					width: 44rpx;
					height: 44rpx;
					margin-bottom: 2rpx;
				}

				.text {
					font-size: 20rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #1f2129;
					line-height: 12rpx;
				}
			}

			.bot {
				width: 268rpx;
				height: 80rpx;
				background: #1f2129;
				border-radius: 10rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #ffffff;
				text-align: center;
				line-height: 80rpx;
			}

			.bot_my {
				width: 308rpx;
				height: 84rpx;
				
				// @include global-background-color2();
				background: linear-gradient( 138deg, #496EF5 0%, #7249F5 100%);
				border-radius: 42rpx;
				// border-radius: 16rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: #fff;
				text-align: center;
				line-height: 84rpx;
			}
		}

		.contact {
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 30rpx;
				margin-top: 30rpx;

				.item-left {
					.title {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
					}

					.fu {
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
						padding-top: 8rpx;
					}
				}

				.item-right {
					width: 60rpx;
					height: 60rpx;
				}
			}
		}

		.coupons {
			max-height: 750rpx;
			overflow: auto;
			padding-bottom: 50rpx;

			.coupon-item {
				width: 650rpx;
				height: 182rpx;
				background: #FFF8F9;
				border-radius: 16rpx;
				border: 2rpx solid #FFEEEF;
				margin: 0 auto;
				margin-top: 8rpx;
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

					.fu {
						font-size: 22rpx;
						font-weight: 400;
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

						.b {
							display: inline-block;
							margin-right: 10rpx;
							width: 6rpx;
							height: 6rpx;
							background: #999999;
							border-radius: 50%;
						}
					}
				}

				.item-right {
					width: 124rpx;
					height: 52rpx;
					text-align: center;
					line-height: 52rpx;
					font-size: 26rpx;
					font-weight: 400;
					.bindno {
						background: #F93A4A;
						border-radius: 56rpx;
						color: #fff;
					}

					.bindyes {
						border-radius: 56rpx;
						border: 2rpx solid #F93A4A;
						color: #F93A4AFF;
					}
				}
			}
		}

		.wntj {
			.imgtitle {
				width: 167rpx;
				height: 42rpx;
			}
		}

		.productList {
			padding: 20rpx;
			column-count: 2;
			column-gap: calc(100% - 344rpx * 2);

			.product-item {
				width: 344rpx;
				break-inside: avoid; // 这个属性很重要，可以避免首位塌陷
			}
		}

		.productDetails {
			margin-bottom: 160rpx;
			padding-bottom: 30rpx;

			.shop {
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;

				.img {
					width: 165rpx;
					height: 165rpx;
					margin-right: 20rpx;
				}

				.content {
					display: flex;
					justify-content: center;

					.fut {
						font-size: 22rpx;
						font-weight: 500;
						color: #ffffff;
						padding: 1px 5px;
						@include global-background-color2();
						border-radius: 20rpx;
						padding: 4rpx 12rpx;
						margin-top: 10rpx;
						margin-right: 10rpx;
					}
				}
			}

			.choice {
				padding: 0 30rpx;
				margin-bottom: 34rpx;

				.title {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					margin-bottom: 20rpx;
				}

				.title-item {
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
					padding: 10rpx 22rpx;
					background: #f2f2f2;
					border-radius: 16rpx;
					margin-right: 20rpx;
					display: inline-block;
					margin-bottom: 20rpx;
					position: relative;

					.bubble {
						position: absolute;
						background: #1f2129;
						border-radius: 13rpx;
						border: 2rpx solid #ffffff;
						font-size: 16rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						@include global-color2();
						padding: 0 15rpx;
						z-index: 5;
						height: 26rpx;
						line-height: 26rpx;
						top: -24rpx;
						right: -24rpx;
					}
				}

				.title-item-disabled {
					opacity: 0.4;
				}
				
				.remakeTitle {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 34rpx;
					
					.remakeText1 {
						@include global-color2();
					}
				}
			}

			.an {
				height: 97rpx;
				// @include global-background-color2();
				background: linear-gradient( 138deg, #496EF5 0%, #7249F5 100%);

				text-align: center;
				font-size: 34rpx;
				font-weight: 500;
				color: #ffffff;
				position: fixed;
				bottom: 50rpx;
				border: beige;
				width: 690rpx;
				height: 90rpx;
				border-radius: 20rpx;
				line-height: 90rpx;
			}

			.content {
				.price-area {
					.left {
						color: #F93A4A;

						.m {
							font-size: 24rpx;
							margin-right: 6rpx;
						}

						.l {
							font-size: 48rpx;
							font-weight: 500;
						}

						.d {
							font-size: 24rpx;
						}

						.r {
							font-size: 22rpx;
							font-weight: 500;
						}
					}
					
					.area_text{
						font-size: 24rpx;
						color: #333333;
						line-height: 36rpx;
						background: #F5F5F5;
						border-radius: 16rpx 16rpx 16rpx 16rpx;
						margin-top: 12rpx;
						padding: 2rpx 12rpx;
						max-width: 480rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.right {
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						margin-left: 10rpx;
					}
				}
			}
		}
	}

	.sm {
		width: 25rpx;
		height: 25rpx;
		margin-left: 10rpx;
	}

	.flex_class {
		display: flex;
		padding-left: 24rpx;
		margin: 16rpx 0;
		font-size: 28rpx;
		font-weight: bold;

		.title_garden {
			width: 50rpx;
			height: 34rpx;
			border-radius: 80rpx;
			background-color: #FFCB31;
			margin-right: 6rpx;
		}
	}
	.shopService {
		padding: 40rpx 30rpx 100rpx;
		.shopService_list {
			font-size: 26rpx;
			color: #333333;
			line-height: 40rpx;
			margin-bottom: 32rpx;
			.shopService_list_title{
				margin-bottom: 6rpx;
				font-size: 28rpx;
				font-weight: 400;
				image{
					width: 24rpx;
					height: 24rpx;
					margin-right: 12rpx;
				}
			}
		}
	}

	.flex_type {
		width: calc(100% - 40rpx);
		height: 150rpx;
		border-radius: 10rpx;
		background-color: beige;
		margin: 0 0 24rpx 20rpx;
		display: flex;
		font-size: 26rpx;

		.type_title {
			width: 150rpx;
			height: 100%;
			text-align: center;
			line-height: 150rpx;
			font-weight: bold;
			font-size: 28rpx;
		}

		.type_content {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 20rpx;
			line-height: 40rpx;
		}
	}
</style>