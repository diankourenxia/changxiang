<template>
	<view class="home">
		<!--  -->
		<view :style="{'height':menuHeight+menuTop+60}" class="fixedHeader">
			<view :style="{'marginTop':menuTop + 4}" class="fixedHeaderTitle"><image src="https://oss.changxiangwl.cn/backstage/2024-09-30/0a61186d0b9b474cb13d9ff23e268f1a.png" class="fixedHeaderTitle_img"></image></view>
			<view class="botText">
				<span>快</span>
				<span>审</span>
				<span>速</span>
				<span>发</span>
				<span class="spanMargin">|</span>
				<span>正</span>
				<span>品</span>
				<span>发</span>
				<span>货</span>
				<span class="spanMargin">|</span>
				<span>免</span>
				<span>押</span>
				<span>租</span>
				<span>机</span>
			</view>
			<view class="jianbianWrapper" :style="{'padding': 0, 'zIndex': 999}">
				<!-- 搜索框 -->
				<view class="header">
					<swiper-search width="544rpx" />
				</view>
			</view>
		</view>
		
		<!-- banner图 -->
		<view class="banner" :style="{'marginTop':menuHeight+menuTop+60}">
			<!-- <swiper class="swiperbanner" @change="onBanner" :current="current" autoplay circular>
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image lazy-load="true" :src="item.fileUrl" mode="scaleToFill" class="swiperbanner-item"
						@click="$onTo(item.link)"></image>
				</swiper-item>
			</swiper> -->
			<z-swiper v-model="lists" :options="{slidesPerView : 2,spaceBetween :20 ,loop:true,autoplay:true,width:280}"  @slideChange="onChange">
						  <z-swiper-item v-for="(item,index) in lists" :key="index">
						    <image :src="item" mode="aspectFit" :class="{'swiper-image':true,active: activeIndex === index }" @click="$onTo('/pages/activity/activity')"> </image>
						  </z-swiper-item>
						</z-swiper>
		</view>
		
		<!--  -->
		<view class="backgroundlinear" style="margin-top: 16rpx;">
			<view class="beijing">

				<!-- 金刚区 -->
				<view class="jinganquWrapperCls mlr20">
					<view class="itmes">
						<view v-for="(menuList, idx) in jinganquMenuArr" :key="idx" :class="{ menuItemCls: true }"
							@click="$onTo(menuList.link)">
							<view class="menuIconCls_Box">
								<image class="menuIconCls" :src="menuList.fileUrl" />
							</view>
							<text class="menuTextCls">{{ menuList.describeInfo }}</text>
							<text class="menuTag" v-if="menuList.tag">{{ menuList.tag }}</text>
						</view>
					</view>
				</view>
				
				<!-- 滚动公告 -->
				<!-- <view class="rollingBox">
					<image class="rollingBox_img" src="../../static/home/laba.png"></image>
					<view class="rollingBox_header">
						<text class="content content1">{{$getGlobalData('notice')}}</text>
					</view>
				</view> -->

				
				
				<!-- 标签图 -->
				<view class="specialBox" v-if="specialMain[0].fileUrl && specialSub[0].fileUrl && specialSub[1].fileUrl">
					<image :src="specialMain[0].fileUrl || ''" @click="$onTo(specialMain[0].link)" class="special_img1" mode="widthFix"></image>
					<image :src="specialSub[0].fileUrl || ''" @click="$onTo(specialSub[0].link)" class="special_img2" mode="widthFix"></image>
					<image :src="specialSub[1].fileUrl || ''" @click="$onTo(specialSub[1].link)" class="special_img3" mode="widthFix"></image>
				</view>
				
			</view>

		</view>
		<!-- 标签专区商品 -->
		<view class="tabs"  v-for="(item, index) in tabList">
			<image src="https://oss.changxiangwl.cn/api/2024-09-27/171baa97538f455ba2cbf4ad800e1f99.png" class="tabs_image"></image>
			<scroll-view :scroll-with-animation="true" :scroll-left="scrollLeft" id="tab_scroll" :scroll-x="true"
				class="tabs_sll">
				<view :style="{
		  display: tabList.length > 4 ? 'inline-flex' : 'flex',
		  whiteSpace: tabList.length > 4 ? 'nowrap' : 'normal',
		}">
					<view class="tabs_container"
						:style="{
		    color: tabCurrent === index ? '#333333' : '#333333',
			fontWeight: tabCurrent === index ? '600' : '400',
		    fontSize: tabCurrent === index ? '32rpx' : '28rpx',
		  }">
						<view style="z-index: 2;height: 100%;line-height: 44rpx;">{{ item.name }}</view>
					</view>
				</view>
			</scroll-view>
			
			<scroll-view :scroll-with-animation="true" :scroll-left="scrollLeft" id="tab_scrollContent" :scroll-x="true" class="tabs_content">
				<view class="content_box" v-for="(item, i) in tabLists[index]" :key="i"
					@click="this.$onTo(`/pages/product/product?productId=${item.productId || item.itemId}`);">
					<view class="box_tags" v-if="i === 0">
						<image src="https://oss.changxiangwl.cn/backstage/2024-09-30/5fc35dcaa66945668fb167e90a9ad016.png" class="tags_img"></image>
						<view>第一名</view>
					</view>
					<view class="box_tags box_tags2" v-if="i === 1">
						<image src="https://oss.changxiangwl.cn/backstage/2024-09-30/fa92420d27ec4284980fe53b3d9227d9.png" class="tags_img"></image>
						<view>第二名</view>
					</view>
					<view class="box_tags box_tags3" v-if="i === 2">
						<image src="https://oss.changxiangwl.cn/backstage/2024-09-30/5fc35dcaa66945668fb167e90a9ad016.png" class="tags_img"></image>
						<view>第三名</view>
					</view>
					<image :src="item.image || item.imageSrc || item.src" class="box_image1"></image>
					<image src="https://oss.changxiangwl.cn/api/2024-09-29/c6dc40319ee84cd49951a27650be1e54.png" class="box_image2"></image>
					<!-- <view class="box_tag">首月5折</view> -->
					<view class="box_title">{{item.name}}</view>
				</view>
				
			</scroll-view>
			
		</view>

		<view class="commodity">
			<view>
				<view class="commodity_list" v-for="(item, index) in productList" :key="index">
					<ProductItem v-if="index % 2 === 0" :productObj="item" :showXinjiu="false" :showTag="true">
						<XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
					</ProductItem>
				</view>
			</view>
			<view>
				<view class="commodity_list" v-for="(item, index) in productList" :key="index">
					<ProductItem v-if="index % 2 !== 0" :productObj="item" :showXinjiu="false" :showTag="true">
						<XinjiuSlot slot="topLeft" :productObj="item"></XinjiuSlot>
					</ProductItem>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniSwiperDot from "../../components/uni-swiper-dot/uni-swiper-dot.vue";
	import ProductItem from "../../components/productItem/productItem.vue";
	import XinjiuSlot from "../../components/productItem/slots/xinjiu.vue";
	import swiperSearch from "@/components/swiper-search/swiper-search.vue";
	import homeService from "./services";
	import {
		channelMaiDianHandler,
		shopSceneHandler
	} from "../../utils/index";
	import { request } from "@/utils"

	export default {
		data() {
			return {
				jinganquMenuArr: [], // 金刚区菜单列表
				activeTab: 0, //标签下标
				tabList: [], //标签数据
				bannerList: [], //banner图列表
				current: 0, //banner图下表
				total: 1, //标签商品共有多少条
				tabId: 108, //标签id
				pageNum: 1, //页数
				pageSize: 6, //一页多少条
				list: [], //商品列表
				tabCurrent: 0, //标签下标
				scrollLeft: 0, //标签左侧的位置
				pillsLeft: 0, // 胶囊距离左侧的位置
				lineLeft: 0, //标签滑块位置
				currentWidth: 0, // 当前选项的宽度
				containerWidth: 0, // 容器的宽度
				titleMain: "", //主标题
				titleSub: "", //副标题
				specialMain: [], //广告位左边轮播图列表
				currentMain: 0, //广告位左边轮播图列表下标
				specialSub: [], //广告位右边
				iconList: [], //金刚区列表
				activeIndex:0,
				flowImg: [
					// "../../static/home/banner_icon_1.png",//免押图片
					"../../static/home/banner_icon_2.png",
					"../../static/home/banner_icon_3.png",
				], //图片信息
				activeBgColor: "#cff", //活动背景色
				menuTop: 0, //胶囊通知栏top
				menuHeight: 0, //胶囊高度
				productList: [],//底部推荐
				lists: [
											'https://oss.changxiangwl.cn/backstage/2024-10-18/9e4d92c0f7ea4890a400fa93cddeb743.png',
											'https://oss.changxiangwl.cn/backstage/2024-10-18/eedd4e116c2448099e19431c80496ccb.png',
											'https://oss.changxiangwl.cn/backstage/2024-10-18/e751ee1df7f140df9c0275532b0feb4f.png',
											
										],
				tabLists:[]
			};
		},
		components: {
			uniSwiperDot,
			ProductItem,
			XinjiuSlot,
			swiperSearch
					},
		watch: {
			tabCurrent: function(newVal, oldVal) {
				//监测标签下标变化，改变之后的值传入changeTab
				this.changeTab(newVal);
				//每次标签变化，需要计算标签的位置进行移动改变
				this.getTabItemWidth();
			},
		},
		onLoad(e) {
			this.colorSetBig114 = false;
			this.colorSetLess114 = false;
			const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
			if (fenyongId) {
				this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
				channelMaiDianHandler(); // 进行埋点上传
			}
			this.onList();
			this.getNotice();
			this.getMenu(); //自定义顶部胶囊位置
			this.fetchConfigureDataHandler();//底部推荐
			

			/**
			 * 场景码埋点
			 */
			shopSceneHandler();
		},

		onPullDownRefresh() {
			this.pageNum = 1;
			this.pageSize = 6;
			this.total = 1;
			this.onList();
		},
		// 监听小程序滑动高度
		onPageScroll(e) {
			const {
				scrollTop
			} = e;
			if (scrollTop > 114) {
				// 下滑超过114px之后，颜色固定，不在跟随banner动态变化
				this.colorSetLess114 = false;
				if (!this.colorSetBig114) {
					// 避免执行多次，引起无效刷新
					this.stopColorFollow = true;

					uni.setNavigationBarColor({
						backgroundColor: "#FFCB31"
					});
					this.colorSetBig114 = true;
					this.isBigThen114 = true;
				}
			} else {
				this.colorSetBig114 = false;
				if (!this.colorSetLess114) {
					// 避免执行多次，引起无效刷新
					this.stopColorFollow = false;
					this.setColor();
					this.colorSetLess114 = true;
					this.isBigThen114 = false;
				}
			}
		},
		methods: {
			onItem(index) {
				this.current = index;
			},
			onTab(i) {
				this.tabCurrent = i;
			},
			changeTab(index) {
				//修改标签下标
				this.activeTab = index;
				//修改标签下标
				this.tabId = this.tabList[index].id;

				this.onScrollToLower("Tab");
			},
			changeMore() {
				this.onScrollToLower();
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
			/**
		获取当前标签的商品
		@param {*} e : 判断是否是切换tab
		 */
			onScrollToLower(e) {
				if (e === 'Tab') {
					this.pageNum = 1;
					this.pageSize = 6;
				} else {
					// 点击查看更多
					//页码由6变为999
					this.pageSize = 999;
				}
				homeService
					.getIndexTabAndProductByPage({
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						tabId: this.tabId,
					})
					.then((res) => {
						this.list = res.products.records;
						this.total = res.products.total;
					});
			},
			/**
			 * 设置导航栏的背景颜色
			 */
			setColor() {
				const bannerObj = this.bannerList[this.current]; // 当前处于焦点状态的banner
				if (!bannerObj) {
					return;
				}
				const color = bannerObj.describeInfo;
				if (!color || this.stopColorFollow) {
					return;
				}
				this.activeBgColor = color;
				uni.setNavigationBarColor({
					backgroundColor: color
				});
			},
			// 获取左移动位置
			getTabItemWidth() {
				let query = uni
					.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this);
				// #endif
				// 获取容器的宽度
				query
					.select("#tab_scroll")
					.boundingClientRect((data) => {
						if (!this.containerWidth && data) {
							this.containerWidth = data.width;
						}
					})
					.exec();
				// 获取所有的 tab-item 的宽度
				query
					.selectAll(".tabs_container")
					.boundingClientRect((data) => {
						if (!data) {
							return;
						}
						let lineLeft = 0;
						let currentWidth = 0;
						if (data) {
							for (let i = 0; i < data.length; i++) {
								if (i < this.tabCurrent) {
									lineLeft += data[i].width;
								} else if (i == this.tabCurrent) {
									currentWidth = data[i].width;
								} else {
									break;
								}
							}
						}
						// 当前滑块的宽度
						this.currentWidth = currentWidth;
						// 滑块作移动的位置
						this.lineLeft = lineLeft + currentWidth / 2;
						// 胶囊距离左侧的位置
						this.pillsLeft = lineLeft;
						// 计算滚动的距离左侧的位置
						this.scrollLeft = this.lineLeft - this.containerWidth / 4;
					})
					.exec();
			},
			//获取广告位左边轮播图当前页数
			onChange(e) {
      this.activeIndex = e.activeIndex;
				// this.currentMain = e.detail.current;
			},
			//获取banner图当前页数
			onBanner(e) {
				this.current = e.detail.current;
				this.setColor();
			},
			//获取页面信息
			onList() {
				homeService
					.getIndexActionListByPage({
						pageNum: 1,
						pageSize: 6,
					})
					.then((res) => {
						this.list = res.products.records;
						console.log(res.tabList)
						this.tabList = res.tabList;
						for(let i =0;i<this.tabList.length;i++){
							homeService
								.getIndexTabAndProductByPage({
									pageNum: this.pageNum,
									pageSize: this.pageSize,
									tabId: this.tabList[i].id,
								})
								.then((res) => {
									this.tabLists[i] = res.products.records;
									this.total = res.products.total;
								});
						}
						this.titleMain = res.specialTitleMain;
						this.titleSub = res.specialTitleSub;
						this.specialMain = res.specialMain;
						this.specialSub = res.specialSub;
						this.bannerList = res.bannerList;
						this.jinganquMenuArr = res.iconList;
						this.setColor();
						this.tabId = res.tabList[0].id;
						this.tabCurrent = 0;

						uni.stopPullDownRefresh();
					});
			},
			// 为您推荐
			fetchConfigureDataHandler() {
			  return request("/hzsx/api/components/selectRecommendProducts", {}, "GET", true, true).then(res => {
			    const resData = res && res.data
			    this.productList = resData || [] // 商品列表数据
			  })
			},
			getNotice() {
				homeService.selectApiNotice().then((res) => {
					this.$setGlobalData("notice", res.data);
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	$mb: 20rpx;
	$bannerHeight: 220rpx;
	$bannerRadius: 20rpx;
	$beishuIconRight: 10rpx;
	$lrGap: 32rpx;

	view {
		box-sizing: border-box;
	}
	/deep/.swiper{
		height:100%;
	}
/deep/.swiper-slide{
	height:180rpx;
}
	/deep/.swiper-slide image{
	  transition: transform 0.3s ease;
	  transform: scale(0.8); /* 默认缩小 */
	  height: 100%;
	}
	
	/deep/.swiper-slide-active image{
	  transform: scale(1); /* 当前索引时放大 */
	}
	.backgroundlinear {
		// background: linear-gradient(#17355b, #9acbd0);
	}

	.home {
		background-color: #F5f5f5;

		.fixedHeader {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			background: url('https://oss.changxiangwl.cn/api/2024-09-27/cc3c5587a3d640dc90fe12d676522423.png');
			background-size: 100% 100%;
			border: none;
			z-index: 999;
			@include global-color2();
			// padding: 6rpx 88rpx;

			.fixedHeaderTitle {
				font-size: 28rpx;
				padding: 0rpx 40rpx 0 90rpx;
				display: flex;
				.fixedHeaderTitle_img {
					width: 172rpx;
					height: 40rpx;
				}
			}

			.botText {
				line-height: 22rpx;
				padding: 0rpx 40rpx;
			}

			span {
				font-size: 16rpx;
				margin: 0 0 0 2rpx;
			}
			.spanMargin {
				margin: 0 5rpx 0 5rpx;
			}
		}

		.mlr20 {
			margin: $lrGap;
			margin-bottom: 0;
			margin-top: 0;
		}

		.beijing {
			.jianbianWrapper {
				// background-color: #ffffff;
				padding-left: 20rpx;
				padding-right: 20rpx;
			}
		}

		.header {
			// background: linear-gradient(#E5F0FF, #F5f5f5);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;

			.receive {
				width: 40rpx;
				height: 63rpx;
			}
		}

		.banner {
			height:360rpx;
			padding-top:20rpx;
			background: none;
			
			.swiperbanner {
				height: 168rpx;
				width: 100%;
				border-radius: 16rpx;
				width: 686rpx;
				margin: 0 auto;

				.swiperbanner-item {
					height: 168rpx;
					width: 100%;
					border-radius: 16rpx;
					width: 710rpx;
				}
			}
		}

		.flow {
			display: flex;
			justify-content: space-around;
			margin: 0 0 20rpx 50rpx;
			width: calc(100% - 100rpx);
			height: 50rpx;
			align-items: center;
			background: linear-gradient(#a6a9b2, #d7e2eb);
			// background-color: #d7e2eb;
			border-radius: 0 0 20rpx 20rpx;
			box-shadow: 0rpx 8rpx 10rpx #445574;
			font-size: 24rpx;
			padding: 0 9%;
			font-weight: bold;
			z-index: -1;
			box-sizing: border-box;

			span {
				margin-right: 20rpx;
			}

			.flow-img {
				width: 35rpx;
				height: 35rpx;
			}
		}

		.cardTitle {
			width: 700rpx;
			height: 86rpx;
			margin-left: 25rpx;
			border-top-left-radius: 16rpx;
			border-top-right-radius: 16rpx;
			font-weight: bold;
			font-size: 32rpx;
			color: #333333;
			line-height: 50rpx;
			background: #FFFFFF;
			padding-left: 26rpx;
			line-height: 90rpx;
			// background-image: url('https://oss.chuangliukeji.com/backstage/2024-04-18/e0a073bb405d4cbb8a8904cfde0a4d8a.png');
			// background-size: 100%, 100%;
			margin-top: $lrGap;
			
			
			.cardTitle_img {
				width: 300rpx;
				z-index: 50;
				margin-left: 20rpx;
			}
		}
		
		.specialBox {
			margin: 16rpx $lrGap 0rpx $lrGap;
			display: flex;
			.special_img1 {
				width: 334rpx;
			}
			.special_img2 {
				width: 160rpx;
				margin: 0 16rpx;
			}
			.special_img3 {
				width: 160rpx;
			}
		}
		
		.renkingTab {
			width: calc(100% - 24rpx);
			margin-left: 24rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			background: #F2F7FF;
			
			.tab_title {
				width: 226rpx;
				display: flex;
				align-items: center;
				padding-right: 25rpx;
				border-right: 4rpx solid #1677FF;
				box-sizing: border-box;
				.tab_img1 {
					width: 48rpx;
					height: 48rpx;
					margin-right: 8rpx;
				}
				.tab_img2 {
					width: 144rpx;
					height: 42rpx;
				}
			}
			
			.tabs {
				width: 476rpx;
				
				// background-color: #ffffff;
				.tabs_sll {
					width: 450rpx;
					height: 58rpx;
					box-sizing: border-box;
					// border-radius: 20rpx;
					display: flex;
					align-items: center;
					margin-left: 26rpx;
					
					// margin: 0 20rpx;
					// box-shadow: 0rpx 0rpx 20rpx #445668;
				}
			
				.tabs_container {
					margin-right: 24rpx;
					display: flex;
					align-items: flex-end;
					color: #333333;
					position: relative;
					font-size: 28rpx;
					width: 160rpx;
					height: 52rpx;
					border-radius: 58rpx;
					justify-content: center;
					box-sizing: border-box;
			
					.tabs_container_iocn {
						@include cl();
						top: 15rpx;
					}
				}
			}
		}

		.tabs {
			// width: calc(100% - 50rpx);
			// margin-left: 25rpx;
			// background-color: #ffffff;
			margin: 16rpx $lrGap 0 $lrGap;
			height: 280rpx;
			background: linear-gradient( 180deg, #FFEECF 0%, #FFFFFF 100%);
			border-radius: 12rpx;
			position: relative;
			padding-top: 6rpx;
			.tabs_sll {
				// width: 700rpx;
				height: 58rpx;
				box-sizing: border-box;
				// border-radius: 20rpx;
				display: flex;
				align-items: center;
				// padding-left: 26rpx;
				// margin: 0 20rpx;
				// box-shadow: 0rpx 0rpx 20rpx #445668;
				position: relative;
				margin-left: 68rpx;
			}
			.tabs_image {
				position: absolute;
				width: 42rpx;
				height: 42rpx;
				top: 12rpx;
				left: 18rpx;
				z-index: 999;
			}

			.tabs_container {
				margin-right: 32rpx;
				display: flex;
				align-items: flex-end;
				color: #333333;
				position: relative;
				font-size: 28rpx;
				// width: 160rpx;
				height: 52rpx;
				border-radius: 20rpx;
				// justify-content: center;
				box-sizing: border-box;

				.tabs_container_iocn {
					@include cl();
					top: 15rpx;
				}
			}
			
			.tabs_content {
				width: 100%;
				margin-top: 12rpx;
				display: -webkit-box;
				// white-space: nowrap;
				
				.content_box {
					width: 33%;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 0 6rpx;
					position: relative;
					
					.box_tags {
						position: absolute;
						top: 0;
						left: 30rpx;
						width: 36rpx;
						height: 10rpx;
						line-height: 10rpx;
						background: linear-gradient( 180deg, #FF7624 0%, #FC4C49 100%);
						display: flex;
						justify-content: center;
						// align-items: end;
						// font-size: 6rpx;
						color: #FFFFFF;
						font-weight: 600;
						.tags_img {
							width: 6rpx;
							height: 10rpx;
							margin-right: 4rpx;
						}
						> view {
							font-size: 14rpx;
							transform:scale(0.45); // 缩放为原本大小的0.1-1倍
							white-space: nowrap;
							// transform-origin: 0 0; // 这个可不要，但建议搭配使用，作用是不因缩放导致位置有所偏移
						}
					}
					.box_tags2 {
						background: linear-gradient( 180deg, #FFDC90 0%, #FFCA70 100%);
					}
					.box_tags3 {
						background: linear-gradient( 180deg, #90D4FF 0%, #70B9FF 100%);
					}
					
					.box_image1 {
						width: 110rpx;
						height: 110rpx;
					}
					.box_image2 {
						width: 103rpx;
						height: 26rpx;
					}
					.box_tag {
						width: 116rpx;
						height: 36rpx;
						background: #ffdcdf;
						border-radius: 4rpx;
						font-weight: 400;
						font-size: 22rpx;
						color: #F62036;
						line-height: 40rpx;
						text-align: center;
						margin: 8rpx 0;
					}
					.box_title {
						font-size: 22rpx;
						color: #0F2250;
						line-height: 30rpx;
						word-break: break-all;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						margin-top: 8rpx;
					}
				}
			}
		}



		::-webkit-scrollbar {
			display: none;
		}

		.commodity {
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;
			margin-top: 14rpx;
		}

		.commodity_list {
			break-inside: avoid;
			width: 344rpx;
		}

		.home-bottom {
			text-align: center;
			margin: 20rpx 0 0 0;
			padding-bottom: 20rpx;
		}


		.jinganquWrapperCls {
			// background: #ffffff;
			background: url('https://oss.changxiangwl.cn/api/2024-09-27/5adfabe3c395422dbdf792ae1dd83780.png');
			background-size: 100% 100%;
			border-radius: 20rpx;
			padding: 8rpx 0 18rpx 0;
			z-index: 999;

			// margin-bottom: 6rpx;
			.itmes {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 0 16rpx;

				//一行5个
				.item {
					width: calc(100% / 5);
					margin-bottom: 20rpx;

					.item-img {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}
			}

			.row1 {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.row1+.row1 {
				margin-top: 47rpx;
			}

			.menuItemCls {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				min-width: 88rpx;
				position: relative;
				margin-top: 10rpx;
				// width: 104rpx;
				width: calc((100% - 0rpx) / 5);
				
				// margin-right: calc((100% - 520rpx) / 8);
				// margin-left: calc((100% - 520rpx) / 8);

				.menuTag {
					position: absolute;
					background: linear-gradient(90deg, #ff2401 0%, #fd5c5a 100%);
					border-radius: 100rpx;
					border: 2rpx solid #ffffff;
					padding: 3rpx 10rpx;
					right: -30rpx;
					top: -14rpx;
					font-size: 18rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: bold;
					color: #ffffff;
				}
				
				.menuIconCls_Box {
					width: 104rpx;
					height: 104rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					// background: linear-gradient( 180deg, rgba(255,255,255,0) 0%, #CCE1FF 100%);
					// background-color: #fff;
					border-radius: 30rpx;
					// margin-bottom: 8rpx;
				}

				.menuIconCls {
					width: 90rpx;
					height: 90rpx;
				}

				.menuTextCls {
					font-size: 24rpx;
					font-weight: 400;
					color: #0F2250;
					line-height: 36rpx;
				}
			}
			
			.menuItemCls::before {
				content: '';
				position: absolute;
				top: 31%;
				right: 0rpx;
				width: 2rpx;
				height: 40rpx;
				background: #e6ecff;
			}
			
			.menuItemCls:nth-of-type(5n)::before {
				width: 0;
			}

			.menuItemCls:nth-of-type(5n) {
				margin-right: 0 !important;
			}

			.noMbCls {
				margin-bottom: 0 !important;
			}
		}
		
		.rollingBox {
			width: calc(100% - 40rpx);
			margin: 0 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			font-size: 22rpx;
			padding: 0 20rpx;
			margin-bottom: 18rpx;
			display: flex;
			align-items: center;
			
			.rollingBox_img {
				width: 36rpx;
				height: 36rpx;
			}
			
			.rollingBox_header {
				height: 60rpx;
				width: calc(100% - 48rpx);
				overflow: hidden;
				white-space: nowrap;
				position: relative;
				margin-left: 4rpx;
				.content {
				  position: absolute;
				  height: 60rpx;
				  line-height: 60rpx;
				  font-weight: 400;
				  color: #333333;
				  animation-iteration-count: infinite !important;
				}
				.content1 {
				  animation: scroll1 20s linear;
				}
			}
		}
		@keyframes scroll1 {
		  0% {
		    left: 30em;
		  }
		  100% {
		    left: -58em;
		  }
		}
	}
</style>