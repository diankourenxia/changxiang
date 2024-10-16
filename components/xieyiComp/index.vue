<template>
  <wyb-popup
    ref="xieYiRef"
    type="bottom"
    radius="10"
    title="阅读并确认下列协议"
    :titleStyle="titleStyle"
    :showCloseIcon="true"
    @hide="hideHandler"
  >
    <view class="xieyiContainer">
      <scroll-view
        :scroll-y="true"
        :class="{ webviewCls: true, afterExpandWebviewCls: hasExpand }"
      >
        <mp-html :content="richXieYiContent" zwMode="xieyi" />
      </scroll-view>

      <!-- 协议列表 -->
      <view :class="{ contractWrapper: true, allContractWrapper: hasExpand }">
        <view class="contractListCls">
          <view
            @click="clickXieYiEventHandler(xieYiObj.key)"
            v-for="(xieYiObj, idx) in xieyiList"
            :key="idx"
            :class="{
              xieyiItem: true,
              activeXieyiItem: activeXieYiKey == xieYiObj.key,
              lastXieyiItem:
                xieyiList.length > 1 && idx == xieyiList.length - 1,
              needHide: hasExpand == false && idx > 1,
            }"
          >
            {{ xieYiObj.name }}
          </view>
        </view>
        <view @click="toggleExpandStatusHandler" class="xieyiActionCls">
          共{{ xieyiList.length }}份协议
          <image
            v-if="xieyiList.length > 1"
            class="expandIcon"
            :src="returnExpandIconSrc()"
          />
        </view>
      </view>

      <view @click="clickOkHandler" class="btnHandler">同意并确认</view>
    </view>
  </wyb-popup>
</template>

<script>
// 协议查看组件，包括租赁服务协议、用户授权协议等
import wybPopup from "../wyb-popup/wyb-popup.vue";
import MpHtml from "../mp-html/mp-html.vue";
import { baseUrl, xieyiUrl} from "../../utils/constant";

// const zulinFuWu = "租赁服务协议";
const jxZlht = "租赁服务协议";
// const yonghuAuth = "用户授权协议";
// const geRenShouXin = "个人信用授权书";
// const geRenShouXin2 = "个人征信授权书";
// const rongziWeituo = "委托担保协议";
const xiaoliqueren = "电子签约效力确认协议";
const zidongqian = "自动签方案";
// const xinYongBaoGao = "个人信用报告授权书";
const jxCreditInfo = "个人征信授权书";
const buerSign = "个人信息授权书";
// const zaiQuanZhuanRang = "债权转让协议";
// const xyZqzr = "债权转让协议";
// const xyZqzrkj = "债权转让协议";
const jxUserSq = "用户授权协议";
const zzfw = "增值服务";
const supplementTwo = "补充协议";

export default {
  name: "xieyiComp",

  data() {
    return {
      hasExpand: false, // 是否已经展开
      xieyiList: [], // 协议列表
	  // activeXieYiKey: "order", // 当前打开的协议
      activeXieYiKey: "jxZlht", // 当前打开的协议
      richXieYiContent: "", // 协议富文本内容
      titleStyle: { "text-align": "left", "padding-left": "30rpx" },
    };
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    }, // 是否显示弹窗
    productId: {
      type: String,
    }, // 商品ID
    xYReqParams: {
      type: Object,
    }, // 获取tempOrderId的传参
	servicesPrice: {
	  type: Array,
	  default: [],
	},//选中增值服务的价格list
  },

  watch: {
    show: function (newV) {
      if (newV) {
        this.fetchZuLinXieyi();
		this.generateXieYiList();
        this.$refs.xieYiRef.show();
      } else {
        this.$refs.xieYiRef.hide();
      }
    },
  },

  components: {
    wybPopup,
    MpHtml,
  },

  mounted() {
    this.generateXieYiList();
  },

  methods: {
    fetchTempOrderId() {
      const url = "hzsx/api/sysConfig/cacheConfirmData";
      return this.$request(url, this.xYReqParams, "post", true).then((res) => {
        return res.data;
      });
    },

    /**
     * 点击确认的处理方法
     */
    clickOkHandler() {
      this.$emit("ok");
    },

    /**
     * 关闭弹窗事件
     */
    hideHandler() {
      this.hasExpand = false;
      // this.activeXieYiKey = "order";
	  this.activeXieYiKey = "jxZlht";
      this.$emit("hide");
    },

    /**
     * 点击协议的时候触发
     */
    clickXieYiEventHandler(key) {
      if (key == this.activeXieYiKey) {
        return;
      }
      this.activeXieYiKey = key;
      this.fetchZuLinXieyi();
    },

    /**
     * 收起或者展开
     */
    toggleExpandStatusHandler() {
      this.hasExpand = !this.hasExpand;
    },

    /**
     * 加载租赁服务协议信息
     */
    fetchZuLinXieyi() {
      uni.showLoading({ title: "加载中" });
	  // 存在选中增值服务的金额就
	  const amount = this.servicesPrice[0] || '';
	  
      this.fetchTempOrderId().then((tempOrderId) => {
		let url = '';
		if(amount) {
			url = `${xieyiUrl}${
			  this.activeXieYiKey
			}?channelId=000&uid=${this.$getUid()}&productId=${
			  this.productId
			}&tempOrderId=${tempOrderId}&amount=${amount}`;
		}else {
			url = `${xieyiUrl}${
			  this.activeXieYiKey
			}?channelId=000&uid=${this.$getUid()}&productId=${
			  this.productId
			}&tempOrderId=${tempOrderId}`;
		}
        uni.request({
          url,
          dataType: "text/plain;charset=UTF-8",
          success: (res) => {
            this.richXieYiContent = res.data;
          },
          complete: uni.hideLoading,
        });
      });
    },

    /**
     * 生成协议列表
     */
    generateXieYiList() {
	  let list = [
        // { name: zulinFuWu, key: "order" },
		{ name: jxZlht, key: "jxZlht" },
        // { name: yonghuAuth, key: "pac" },
        // { name: geRenShouXin, key: "pci" },
		// { name: geRenShouXin2, key: "pcic" },
        // { name: rongziWeituo, key: "peg" },
		{ name: xiaoliqueren, key: "picEft" },
		{ name: zidongqian, key: "picAtcs" },
		// { name: xinYongBaoGao, key: "hcdOne" },
		{ name: jxCreditInfo, key: "jxCreditInfo" },
		{ name: buerSign, key: "buerSign" },
		// { name: zaiQuanZhuanRang, key: "hcdTwo" },
		// { name: xyZqzr, key: "xyZqzr" },
		// { name: xyZqzrkj, key: "xyZqzrkj" },
		{ name: jxUserSq, key: "jxUserSq" },
		// { name: zzfw, key: "zzfw" },
		{ name: supplementTwo, key: "supplementTwo" },
      ];
	  if(this.servicesPrice[0]) {
		  list.push({ name: zzfw, key: "zzfw" });
	  }
	  this.xieyiList = list;
    },

    /**
     * 判断是不是云租
     */
    checkIsYunZu() {
      const confirmApiRes =
        this.$getGlobalData("product-confirm#confirmApiRes") || {};
      return confirmApiRes.yx === true;
    },

    /**
     * 返回展开收起图标图片
     */
    returnExpandIconSrc() {
      if (this.hasExpand)
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAaCAMAAADyku75AAAAY1BMVEUAAAAzMzNHR0czMzMzMzM0NDQ3NzczMzMzMzMzMzMzMzMzMzMzMzM0NDQzMzMzMzMzMzM0NDQ0NDQ0NDQ0NDQ1NTU3Nzc5OTk0NDQzMzMzMzM0NDQzMzMzMzM1NTU8PDwzMzNGN0imAAAAIHRSTlMA8AbhvVId+vbl1tKqpZCKdG1ZQi4oGQ3PwrSZSzw6Eb+UOEwAAADXSURBVDjLnZBHFsMwCEQl99575f6njIxfghVc8vI3AmY2+uJ3HEuOxl3BGKXlqHcAgOiuGKnCoF4JiuS6l4BCqiGEjeyql2EcqmkCpDjvFYBM25zj6JZnvdLFMN+3FBdZ8V4lMUrfe4yr7zBzPgYxmbLwEKx6bw3wbB0st/vXe0MT3e8fbo/HxsRjpIveMBuhUUsg8SQaZC2+mD0ST6K9WTBsEk+ibd4j8Uw0g8STaIYmnkTrMPFMNKPt4EPXspiL56IRLp6L5iweil7EIzaJfmqaJvb+5AWPqh89KiQJFAAAAABJRU5ErkJggg==";
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAaCAMAAADyku75AAAAaVBMVEUAAAA3NzczMzMzMzMzMzMzMzM0NDQzMzMzMzMzMzMzMzMzMzM0NDQzMzMzMzMzMzM0NDQ0NDQ0NDQ0NDQ0NDQ1NTU5OTlJSUlGRkYzMzM0NDQzMzM0NDQzMzM0NDQzMzMzMzM8PDwzMzOg90fRAAAAInRSTlMAG/Hh0fn37uXWvKmjkIpzbVNCOy4oDQcFwr+0mVpYUEsR4gWBVwAAANNJREFUOMulkEcWgzAMBWVDOr33ovsfMiDimNgYeC+z4QvPauAPQssKz3g9TvTHXnydxWt85KU3JG7pvscs/GCxPS+z8Yudmb3iScrjQZ9nYRQdEu6M3Wk4Js+jZ54AJJymt+0F9HiJ5h1d6Ai2vBCJdrna5QpNodEXt49LeENoV/5xZXg99AtWvER4PXSZw4q8FOG10CP8MIrwWmhQEOG10AoyvBJaQQ0/INHBJh0SwzRtEVpHhrenxUVoHRmeT6Om0GYofD03qHiT74l5wysGp3kDchIhZ7dczmUAAAAASUVORK5CYII=";
    },
  },
};
</script>

<style lang="scss" scoped>
.xieyiContainer {
  background: #f5f5f5;
  box-sizing: border-box;
  padding-bottom: 50rpx;
  position: relative;
  .webviewCls {
    background: #fff;
    box-sizing: border-box;
    height: 786rpx;
    padding: 0 10rpx;
    padding-bottom: 40rpx;
  }
  .afterExpandWebviewCls {
    height: 685rpx;
  }
  .contractWrapper {
    flex-shrink: 0;
    flex-grow: 0;
    max-height: 133rpx;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    padding: 19rpx 39rpx;
    padding-bottom: 0;
    .xieyiActionCls {
      position: absolute;
      right: 19rpx;
      top: 28rpx;
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;
      .expandIcon {
        margin-left: 10rpx;
        width: 20rpx;
        height: 13rpx;
        display: block;
      }
    }
    .contractListCls {
      .xieyiItem {
        border-bottom: 20rpx solid transparent;
        font-size: 20rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .activeXieyiItem {
        color: #333 !important;
      }
      .lastXieyiItem {
        border-bottom-width: 0 !important;
      }
      .needHide {
        display: none;
      }
    }
  }
  .allContractWrapper {
    // height: 450rpx;
    // max-height: 450rpx;
	height: 370rpx;
	max-height: 370rpx;
    overflow: hidden;
  }
  .btnHandler {
    flex-shrink: 0;
    flex-grow: 0;
    width: 710rpx;
    height: 80rpx;
	@include global-background-color2();
    border-radius: 100rpx;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
