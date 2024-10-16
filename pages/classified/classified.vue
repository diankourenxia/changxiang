<template>
  <view class="classified" :style="{'paddingTop':menuHeight+menuTop+9}">
	  <!--  -->
	<view :style="{'height':menuHeight+menuTop+9,'paddingTop': menuTop}" class="fixedHeader">
		<swiper-search />
	</view>
    <!-- 搜索 -->
    <!-- <view class="searchContainerCls">
      <swiper-search />
    </view> -->
    <!-- 分类标签 -->
    <v-tabs
      lineHeight="6rpx"
      :lineScale="0.2"
      paddingItem="0 22rpx"
      :bold="true"
      v-model="activeTab"
      field="name"
      :tabs="tabList"
      @change="changeTab"
    ></v-tabs>
    <view style="height: 10rpx; background: #f7f8fb"></view>
    <!-- 分类二级标签 -->
    <v-tabs-column
      :tabs="leftList"
      position="left"
      v-model="current"
      field="name"
	  :is-tabbar="true"
      @change="onChange"
    >
      <!-- 分类三级商品 -->
      <scroll-view
        class="list"
        scroll-y
        @scrolltolower="onScrolltolower"
        :scroll-top="tabTop"
      >
	  <!-- style="height: 85vh" -->
        <view
          v-for="(item, index) in rightList"
          :key="index"
          class="list_item"
          @click="$onTo(`/pages/product/product?productId=${item.itemId}`)"
        >
          <view class="item-left">
            <image :src="item.image" mode="scaleToFill" class="img"></image>
            <text class="title-top">{{
              getOldNewText(item.oldNewDegree)
            }}</text>
          </view>
          <view class="item-right">
            <view class="item-right-title">{{ item.name }}</view>
            <view class="item-right-tabs" v-if="item.labels.length">
              <text
                v-for="(itemChild, indexChild) in item.labels"
                :key="indexChild"
                class="tag-item"
              >
                {{ itemChild }}
              </text>
            </view>
            <view class="item-right-tabs" v-else>
              <text class="tag-item">信用免押</text>
              <!-- <text class="tag-item">正品保障</text> -->
            </view>
            <view class="price-area plr20">
              <view class="left">
                <text class="m">¥</text>
                <text class="l">
                  {{ getPartMoney(item.price && item.price.toString(), true) }}
                </text>
                <text class="d">.</text>
                <text class="r">
                  {{ getPartMoney(item.price && item.price.toString(), false) }}
                </text>
                <text class="r">/天</text>
              </view>
            </view>
          </view>
        </view>
        <view class="placeholder" v-if="rightList.length === 0">
          <image
            src="../../static/product/xjsp.png"
            mode="scaleToFill"
            class="img"
          ></image>
          <view class="title"> 暂无商品 </view>
          <view class="fu"> 去其他类目看看吧 </view>
        </view>
      </scroll-view>
    </v-tabs-column>
  </view>
</template>

<script>
import vTabsColumn from "../../components/v-tabs-column/v-tabs-column.vue";
import vTabs from "@/components/v-tabs/v-tabs.vue";
import swiperSearch from "@/components/swiper-search/swiper-searchClass.vue";
import classIfiedService from "./services";
import { OLD_NEW_MAP, EMPTY_PLACEHOLDER } from "../../utils/constant.js";
import { channelMaiDianHandler } from "../../utils/index";

export default {
  data() {
    return {
      current: 0, //分类二级标签当前下标
      leftList: [], //分类二级标签列表
      rightList: [], //分类三级商品列表
      activeTab: 0, //一级分类当前下标
      tabList: [], //分类列表
      pageNum: 0, //商品页数
      pageSize: 10, //每一页条数
      total: 0, //总条数
      categoryId: null, //分类二级标签id
      tabTop: 0, //分类三级商品距离顶部有多少距离
      urlFirstCategoryId: 0, // 页面链接上所携带的一级分类ID，目前在外面推广的活动页面链接会使用到该参数
	  menuTop: 0, //胶囊通知栏top
	  menuHeight: 0, //胶囊高度
    };
  },

  components: {
    vTabsColumn,
    vTabs,
    swiperSearch,
  },

  watch: {
    tabList: function (newval) {
      if (Object.prototype.toString.call(newval) !== "[object Array]") return;
      const idx = this.returnUrlFirstCategoryIdx();
      this.activeTab = idx !== -1 ? idx : 0;
    },
  },

  onLoad(e) {
    this.urlFirstCategoryId = this.$getPageParams(e, "id");
    console.log(this.urlFirstCategoryId, 'this.$getPageParams(e, "id")');
	const fenyongId = this.$getPageParams(e, "subFenYongChannelId"); // 渠道分佣功能
	if (fenyongId) {
		this.$setGlobalData("subFenYongChannelId", fenyongId); // 存储到全局
		channelMaiDianHandler(); // 进行埋点上传
	}
    this.onList(0);
	this.getMenu();
  },

  methods: {
    // 判断一级分类ID是否存在
    returnUrlFirstCategoryIdx() {
      const arr = this.tabList || [];
      return arr.findIndex((obj) => obj.id == this.urlFirstCategoryId);
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
     * 请求页面数据
     * @param {*} parentId : 该字段有效的话则表明是加载二级分类列表数据
     */
    onList(parentId) {
      classIfiedService.categoryList({ parentId: parentId }).then((res) => {
        const firstOrSecondCategoryListData = res?.data || []; // 一级和二级列表数据
        if (parentId === 0) {
          // 一级分类数据
		  // 删除掉  其他 的分类
		  firstOrSecondCategoryListData.map((item,index) =>{
			  if (item.name == '其他') {
				  firstOrSecondCategoryListData.splice(index,1);
			  }
		  })
		  
          this.tabList = firstOrSecondCategoryListData;

          // 如果页面链接上携带了一级分类ID，那么利用它来加载二级分类数据，否则利用一级分类的第一个
          let defaultFristCategoryId = firstOrSecondCategoryListData[0].id;
          if (
            this.urlFirstCategoryId &&
            this.returnUrlFirstCategoryIdx() !== -1
          ) {
            // url传入了一级分类ID，且这个一级分类ID是存在的
            defaultFristCategoryId = this.urlFirstCategoryId;
          }

          // 然后接着获取二级分类数据
          this.onList(defaultFristCategoryId);
        } else {
          // 获取到的二级分类数据
          this.leftList = firstOrSecondCategoryListData;
          // 二级分类列表的第一个ID
          this.categoryId = firstOrSecondCategoryListData[0].id;
          this.onChange(0); // 加载商品列表数据
        }
      });
    },

    // 返回商品的显示价
    getProductShowPrice(productItem) {
      const val = productItem?.lowestSalePrice;
      return val ? `${val}` : "";
    },

    onScrolltolower() {
      this.fetchProductList();
    },

    //切换分类标签下标
    changeTab(index) {
      //保存当前下标
      this.activeTab = index;
      //重置二级分类标签下标
      this.current = 0;

      this.onList(this.tabList[index].id);
    },

    /**
     * 获取金额的小数点前、后的数据
     * @param {Boolean} isFront : 是否是前半部分
     */
    getPartMoney(prices, isFront) {
      const price = prices || "";
      if (!price) return EMPTY_PLACEHOLDER;
      const list = price.split(".");
      const result = isFront ? list[0] : list[1];
      return result || 0;
    },

    /**
     * 获取新旧程序的标识
     */
    getOldNewText(oldNewDegree) {
      const level = oldNewDegree; // 新旧程度标识
      return OLD_NEW_MAP[level] || EMPTY_PLACEHOLDER;
    },

    /**
     * 获取当前标签的商品
     * @param {*} type : 判断是否是切换tab
     */

    fetchProductList(type) {
      //判断是否需要请求商品
      if (this.pageNum * this.pageSize - this.total >= 10) {
        if (this.total !== 0) {
          uni.showToast({
            title: "没有更多啦～",
          });
        }
        return;
      }
      //翻页功能每次下拉需要页数加一
      this.pageNum = this.pageNum + 1;
      classIfiedService
        .listLiteCategoryProduct({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          categoryId: this.categoryId,
        })
        .then((res) => {
          if (type === "Tab") {
            //如果是tab切换让rightList重置
            this.rightList = res.data.records;
          } else {
            //如果不是让rightList合并
            this.rightList = this.rightList.concat(res.data.records || []);
          }
          this.total = res.data.total;
        });
    },

    /**
     * 获取金额的小数点前、后的数据
     * @param {*}  index: 二级分类下标
     */
    onChange(index) {
      let { leftList } = this;
      let categoryId = leftList[index].id;
      this.categoryId = categoryId;
      this.current = index;
      this.pageNum = 0;
      //切换二级分类让商品回到顶部
      if (this.tabTop === 0) {
        this.tabTop = 1;
      } else {
        this.tabTop = 0;
      }
      this.fetchProductList("Tab");
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}
.classified {
	
  .fixedHeader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background: url('https://oss.changxiangwl.cn/api/2024-09-27/cc3c5587a3d640dc90fe12d676522423.png');
	background-size: 100% 100%;
	border: none;
	z-index: 50;
	@include global-color2();
	box-sizing: border-box;
  }
  
  .searchContainerCls {
    padding: 0 20rpx;
    margin-bottom: 10rpx;
  }
  .list {
    .list_item {
      display: flex;
      align-items: center;
      margin-top: 30rpx;
      margin-left: 42rpx;
      .item-left {
        width: 164rpx;
        height: 164rpx;
        position: relative;
        margin-right: 22rpx;
        flex-shrink: 0;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 20rpx;
        }
        .title-top {
          // padding: 0 8rpx;
		  width: 70rpx;
          height: 29rpx;
		  background: url('https://oss.changxiangwl.cn/api/2024-09-29/d87897e48c374ce987f4913b56468a5b.png');
		  background-size: 100% 100%;
          // @include global-background-color2();
          // border-radius: 20rpx 0rpx 20rpx 0rpx;
          text-align: center;
          position: absolute;
          z-index: 2;
          left: 0;
          font-size: 20rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #fff;
          line-height: 29rpx;
        }
      }
      .item-right {
        .item-right-title {
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #333333;
          line-height: 40rpx;
          max-width: 100%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        .item-right-tabs {
          margin-top: 10rpx;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .tag-item {
            height: 30rpx;
            max-width: 13em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: keep-all;
            line-height: 30rpx;
            border-radius: 5rpx;
            border: 1rpx solid #e52021;
            font-size: 22rpx;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: #e52021;
            padding: 0 4rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
          }
        }
        .price-area {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-top: 30rpx;
          .left {
            color: #e52021;
            .m {
              font-size: 20rpx;
              margin-right: 6rpx;
            }
            .l {
              font-size: 38rpx;
              font-weight: bold;
            }
            .d {
              font-size: 36rpx;
            }
            .r {
              font-size: 20rpx;
              font-weight: bold;
            }
          }
          .right {
            font-size: 20rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
        }
      }
    }
  }
  .placeholder {
    text-align: center;
    padding-top: 300rpx;
    .img {
      width: 230rpx;
      height: 253rpx;
    }
    .title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
      margin-top: 46rpx;
    }
    .fu {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      margin-top: 10rpx;
    }
  }
}
</style>
