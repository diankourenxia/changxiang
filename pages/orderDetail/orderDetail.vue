<template>
  <view class="orderPageContainer">
    <!-- 顶部状态标识 -->
    <view class="top-status-wrapper">
      <view class="status-text">
		  <text>{{ returnOrderConfigCnObj("title") }}</text>
			<view class="btn-wrapper" style="margin-left: 30rpx;">
				<view v-if="!hasIdCardFlag" @click="makePhoneCallHandler" class="icon-btn contract-btn"
				  >去加急</view
				>
				<view v-else @click="makePhoneCallHandler" class="icon-btn contract-btn2"
				  >联系客服</view
				>
				<view
				  @click="zhifuHandler"
				  v-if="checkShowQuZhiFu()"
				  class="icon-btn quzhifu-btn"
				  >去支付</view
				>
				<view
				  @click="buyAgainHandler"
				  v-if="checkShowZaiciXiadan()"
				  class="icon-btn zaicixiadan-btn"
				  >再次下单</view
				>
			</view>
	  </view>
      <view class="desc-text desc-t1">{{
        returnOrderConfigCnObj("desc1")
      }}</view>
      <view class="desc-text desc-t2">{{
        returnOrderConfigCnObj("desc2")
      }}</view>
      <!--  -->
	  <view v-if="!hasIdCardFlag" class="btn-wrapperAdd" @click="gotoCertificates">
	    <image src="https://oss.chuangliukeji.com/backstage/2024-08-01/97213cda51b64c42a89893b2ae029524.png" style="width: 32rpx;height: 32rpx;"></image>
		<text style="flex: 1;margin-left: 20rpx;">补充资料：完善个人信息，提升通过率</text>
		<text>去完善 ></text>
	  </view>
    </view>

    <!-- 收货人以及收货地址的显示 -->
    <view class="address-wrapper">
      <view class="top-line">
        <image src="/static/sendback/address.png" class="send-icon" />
        <text class="t1">{{ $uiStr(orderAddressDtoObj.realname) }}</text>
        <text class="t2">{{ $uiStr(orderAddressDtoObj.telephone) }}</text>
      </view>
      <view class="bottom-line"> 地址：{{ returnFullAddress() }} </view>
    </view>

    <!-- 商品描述信息的显示 -->
    <view class="product-wrapper">
      <LiteProductShow
        :productVO="orderProductDetailDtoObj"
        :money="userOrderCashesDtoObj.totalRent"
      />
    </view>

    <!-- 一些金额信息展示区域 -->
    <view class="money-wrapper">
      <view class="row">
        <text class="label">总租金</text>
        <text class="value-cls">{{
          $uiStr(userOrderCashesDtoObj.totalRent, "", "¥")
        }}</text>
      </view>
      <view class="row">
        <text class="label">运费</text>
        <text class="value-cls">{{ returnYunfeiText() }}</text>
      </view>
      <view class="row">
        <text class="label">增值服务费</text>
        <text class="value-cls">{{
          $uiStr(userOrderCashesDtoObj.additionalServicesPrice, "", "¥")
        }}</text>
      </view>
      <view class="row">
        <text class="label">合计已支付</text>
        <text class="value-cls">{{ computeTotalPay() }}</text>
      </view>
      <template v-if="returnMaiduanShowStatus().canMaiduan">
        <view class="row">
          <!-- <text class="label">到期买断价</text> -->
		  <text class="label">到期价</text>
          <text class="value-cls">{{
            $uiStr(userOrdersDtoObj.expireBuyOutPrice, "", "¥")
          }}</text>
        </view>
        <view v-if="returnMaiduanShowStatus().canBefore" class="row">
          <!-- <text class="label">当前买断价</text> -->
		  <text class="label">当前价</text>
          <text class="value-cls">{{
            $uiStr(userOrdersDtoObj.endFund, "", "¥")
          }}</text>
        </view>
      </template>
    </view>

    <!-- 订单编号的展示区域 -->
    <view class="orderNum-wrapper mb40">
      <view class="row">
        <text class="label">订单编号</text>
        <text class="value-cls">{{ userOrdersDtoObj.orderId }}</text>
      </view>
      <view class="row">
        <text class="label">下单时间</text>
        <text class="value-cls">{{ userOrdersDtoObj.createTime }}</text>
      </view>
      <view class="row">
        <text class="label">还租时间</text>
        <text class="value-cls">{{ returnHuanzuTime() }}</text>
      </view>
      <view class="row">
        <text class="label">订单备注</text>
        <text class="value-cls">{{ userOrdersDtoObj.remark }}</text>
      </view>
    </view>

    <!-- 租赁协议的展示 -->
	<!-- 协议 -->
    <view class="zulin-xieyi" v-if="userOrdersDtoObj.status == '06'">
      <text @click="seeXieyiHandler('orderContractUrl')" class="xieyi"
        >《租赁服务协议》</text
      >
      <view>
        <text @click="seeXieyiHandler('jxUserSqUrl')" class="xieyi"
          >《用户授权协议》</text
        >
        <text @click="seeXieyiHandler('jxCreditInfoUrl')" class="xieyi"
          >《个人征信授权书》</text
        >
        <!-- <text @click="seeXieyiHandler('pegUrl')" class="xieyi"
          >《委托担保协议》</text
        > -->
      </view>
    </view>

    <!-- 底部功能按钮 -->
    <template v-if="!loading && !orderHasClose">
      <view class="btnWrapper" slot="ele">
        <OrderActionBtns
          :orderVO="userOrdersDtoObj"
          :productVo="orderProductDetailDtoObj"
          :isUsedInList="false"
          :userOrderCashDto="
            orderDetailObj && orderDetailObj.userOrderCashesDto
          "
		  :orderDeatil ="orderDetailObj"
        ></OrderActionBtns>
		<!-- <OrderBtns
		  :orderVO="userOrdersDtoObj"
		  :productVo="orderProductDetailDtoObj"
		  :isUsedInList="false"
		  :userOrderCashDto="
		    orderDetailObj && orderDetailObj.userOrderCashesDto
		  "
		  :orderDeatil ="orderDetailObj"
		>
		</OrderBtns> -->
      </view>
    </template>
    <view v-if="!loading && !orderHasClose" class="danban"></view>
  </view>
</template>

<script>
// 订单详情页面
// 订单详情页面显示的状态还得处理一下
import { orderStatusDesc, 已支付, 逾期已支付 } from "../../utils/constant";
import {
  checkOrderNeedPay,
  checkOrderHasDone,
  checkOrderHasClose,
} from "../../components/orderItem/orderActionBtns/utils/checkShowBtn";
import LiteProductShow from "../../components/liteProductShow/liteProductShow.vue";
import {
  getProductYunfeiText,
  returnProductMaiduanStatus,
  makeAdd,
  getDateValueOf,
  navigateToMiniProgramSchemeZFB
} from "../../utils/index";
import OrderActionBtns from "../../components/orderItem/orderActionBtns/orderActionBtns.vue";
import OrderBtns from "../../components/orderBtns/orderBtns.vue"
import { tradePay } from "../../utils/platform";
const esignPlugin = requirePlugin("esign");

export default {
  data() {
    return {
      orderId: "", // 订单ID
      orderDetailObj: null, // 商品详情对象数据
      totalPay: 0, // 已支付的金额
      restTimeStamp: 0, // 付款剩余时间的时间戳
      loading: true, // 是否正在加载中
	  hasIdCardFlag: true, // 表示是否绑定了身份证，默认认为已经绑定了身份证，避免经常发生闪现
    };
  },

  components: {
    LiteProductShow,
    OrderActionBtns,
	OrderBtns
  },

  computed: {
    /**
     * 返回订单的金额描述，会确保一定是个对象
     */
    userOrderCashesDtoObj: function () {
      return this.orderDetailObj?.userOrderCashesDto || {};
    },

    /**
     * 返回订单的对象，会确保它一定是个对象
     */
    userOrdersDtoObj: function () {
      return this.orderDetailObj?.userOrdersDto || {};
    },

    /**
     * 返回商品的描述对象，会确保它一定是一个对象
     */
    orderProductDetailDtoObj: function () {
      return this.orderDetailObj?.orderProductDetailDto || {};
    },

    /**
     * 返回订单的账单列表数据，会保证它一定是一个数组
     */
    orderByStagesDtoList: function () {
      return this.orderDetailObj?.orderByStagesDtoList || [];
    },

    /**
     * 地址对象
     */
    orderAddressDtoObj: function () {
      return this.orderDetailObj?.orderAddressDto || {};
    },

    /**
     * 判断订单是否关闭
     */
    orderHasClose: function () {
      return checkOrderHasClose(this.userOrdersDtoObj);
    },
  },

  onLoad(opt) {
    this.orderId = opt && opt.orderId;
    if (this.$checkIsPageLessParameter(opt, ["orderId"])) return; // 如果URL传参没有订单ID数据的话，那么做出提示
    this.fetchOrderDetailData();
    this.eventId = this.$eventEmitter.subscribe(
      "refreshOrderDetail_jsjk12",
      this.fetchOrderDetailData
    ); // 注册刷新账单详情页面的监听事件
  },

  onShow() {
	this.fetchUserHasBindIdCard();//获取有无身份证信息或过期
    this.tid && clearInterval(this.tid);
    this.daojishi(); // 有必要倒计时的话会进行倒计时。之所以需要在onShow里面调用是因为小程序进入后台的话，那么倒计时会停止或者变慢
	// 通过插件js接口获取签署状态
	const {
	    code,
	    message,
	} = esignPlugin.getSignStatusInfo();
	console.log('code', code)
	console.log('message', message)
	const _this = this;
	uni.showToast({ title: message, icon:'none' });
	if (code == '000'){
		_this.$request(
		  "hzsx/api/order/zfbSignContractUser",
		  { orderId: _this.orderId },
		  "get",
		  false,
		  false,
		).then((res) => {
			console.log("res",res);
			navigateToMiniProgramSchemeZFB(_this.orderId, res.data);
		})
	}
  },

  onUnload() {
    this.tid && clearInterval(this.tid);
    this.$eventEmitter.removeHandler("refreshOrderDetail_jsjk12", this.eventId);
  },

  methods: {
	/**
	 * 获取时间的YYYYMMDD格式
	 * @param {Number} type : 0表示yymmdd，1表示yy-mm-dd，2表示yy年mm月dd日
	 * @returns
	 */
	getDateYYMMDD(type = 0, dateObj) {
	  const date = dateObj || new Date()
	  const year = date.getFullYear()
	  let month = date.getMonth() + 1
	  if (month < 10) month = `0${month}`
	
	  let day = date.getDate()
	  if (day < 10) day = `0${day}`
	
	  if (type == 0) {
	    return `${year}${month}${day}`
	  } else if (type == 1) {
	    return `${year}-${month}-${day}`
	  } else if (type == 2) {
	    return `${year}年${month}月${day}日`
	  }
	},
	/**
	 * 判断用户是否上传身份证
	 */
	fetchUserHasBindIdCard() {
		const _this = this;
	  return this.$request(
	    "hzsx/userCertification/getByUid",
	    {},
	    "GET",
	    true
	  ).then((res) => {
	    const resData = res.data || {}
	    const { idCardBackUrl, idCardFrontUrl, limitDate } = resData
	    const nowYYYYMMDD = this.getDateYYMMDD()
	    if (
	      !idCardBackUrl ||
	      !idCardFrontUrl ||
	      !limitDate ||
	      nowYYYYMMDD > limitDate
	    ) {
	      // 不存在正反面或者已过期
	      this.hasIdCardFlag = false
		  uni.showModal({
		  	title: '加速审核',
		  	content: '提前补充个人资料可加速审核',
			confirmText: '去补充',
		  	success: function (res) {
		  		if (res.confirm) {
		  			_this.gotoCertificates();
		  		} else if (res.cancel) {
		  			console.log('用户点击取消');
		  		}
		  	}
		  });
	    }else {
		  this.hasIdCardFlag = true
		}
	  })
	},
	// 去往实名认证
	gotoCertificates() {
		this.$uma.trackEvent('2',{ path: '去实名认证' });
		this.$onTo('pages/certificates/certificates')
	},
    /**
     * 订单倒计时的处理方法
     */
    daojishi() {
      if (this.checkShowQuZhiFu()) {
        // 如果是处于付款订单状态的订单的话，那么加载进行倒计时操作
        this.restTimeStamp = this.computeRestTime(); // 起始的剩余时间
		console.log("rime",this.restTimeStamp);
        if (this.restTimeStamp <= 0) {
          this.tid && clearInterval(this.tid);
          this.fetchOrderDetailData(false);
          return;
        }
        const interval = 1000;
        this.tid = setInterval(() => {
          this.restTimeStamp = this.restTimeStamp - interval; // 倒计时
          if (this.restTimeStamp <= 0) {
            clearInterval(this.tid);
            this.fetchOrderDetailData(false);
          }
        }, interval);
      }
    },

    /**
     * 加载订单详情数据
     */
    fetchOrderDetailData(showLoading = true) {
      this.loading = true;
      showLoading && uni.showLoading({ title: "加载中" });
      this.$request(
        "hzsx/api/order/selectUserOrderDetail",
        { orderId: this.orderId },
        "POST",
        false
      )
        .then((res) => {
			//待接单   拒绝接单  都改为  待发货
			if(res.data.userOrdersDto.status =="13"||res.data.userOrdersDto.status =="14"){
				res.data.userOrdersDto.status = '04'
			}
          const resData = res.data;
          this.orderDetailObj = resData;
          const cashObj = resData?.userOrderCashesDto;
          const zongzujin = cashObj?.totalRent;
          this.$setGlobalData("zongzujinshuju0712", zongzujin);
          this.daojishi();
        })
        .finally(() => {
          showLoading && uni.hideLoading({ title: "加载中" });
          this.loading = false;
        });
    },

    /**
     * 返回订单的中文状态描述
     */
    returnOrderConfigCnObj(key) {
      const { status, isViolation } = this.userOrdersDtoObj;
      const black = ["02", "04", "05"];
      if (black.includes(isViolation)) {
        // 特殊展示情况之已逾期
        const obj = {
          title: "已逾期",
          desc1: "您的订单已逾期",
          desc2: "逾期太久会严重影响您的信用哦",
        };
        return obj[key];
      }
      const obj = orderStatusDesc[status] || {};
      if (obj?.title === "租用中") {
        obj.desc1 = `${Number(
          this.orderByStagesDtoList[0].createTime.split("-")[2].split(" ")[0]
        )}号是您的租金支付日期`;
      }
      if (this.checkShowQuZhiFu()) {
        // 特殊情况之待付款的展示，待付款时，第一行显示剩余支付时间
        obj.desc1 = `订单将在${this.restTimeStr()}后自动取消，请尽快支付`;
      }
      return obj[key];
    },

    /**
     * 判断是否需要现在去支付按钮
     */
    checkShowQuZhiFu() {
      return checkOrderNeedPay(this.userOrdersDtoObj);
    },

    /**
     * 判断是否显示再次下单按钮
     */
    checkShowZaiciXiadan() {
      return checkOrderHasDone(this.userOrdersDtoObj);
    },

    /**
     * 联系客服
     */
    makePhoneCallHandler() {
      const phoneNum = this.orderDetailObj?.shopDto?.serviceTel;
      uni.makePhoneCall({ phoneNumber: phoneNum }); // 拨打电话
    },

    /**
     * 返回运费的中文描述
     */
    returnYunfeiText() {
      return getProductYunfeiText(this.orderProductDetailDtoObj);
    },

    /**
     * 返回买断状态
     */
    returnMaiduanShowStatus() {
      return returnProductMaiduanStatus(this.orderProductDetailDtoObj);
    },

    /**
     * 计算已支付的金额
     */
    computeTotalPay() {
      let totalPay = 0;
      this.orderByStagesDtoList.forEach((payItem) => {
        if (payItem.status === 已支付 || payItem.status === 逾期已支付) {
          totalPay = makeAdd(totalPay, payItem.currentPeriodsRent || 0);
        }
      });
      return this.$uiStr(totalPay, "", "¥");
    },

    /**
     * 返回换租时间
     */
    returnHuanzuTime() {
      const rentStart = this.userOrdersDtoObj.rentStart || "";
      const unrentTime = this.userOrdersDtoObj.unrentTime || "";
      if (!rentStart && !unrentTime) return ""; // 两者都不存在
      return `${rentStart.split(" ")[0]}~${unrentTime.split(" ")[0]}`;
    },

    /**
     * 计算待付款状态还有多少时间
     */
    computeRestTime() {
      const orderCreateTime = this.userOrdersDtoObj?.createTime; // 订单创建时间
      const [timeStamp] = getDateValueOf(orderCreateTime); // 订单创建时间的时间戳
      const currentStamp = Date.now(); // 当前时间戳
      const rest = currentStamp - timeStamp; // 当前所剩余的时间戳
      const duration = 30 * 60 * 1000; // 待支付状态所持续时间
      return duration - rest;
    },

    /**
     * 剩余付款时间的字符串表示
     */
    restTimeStr() {
      if (this.restTimeStamp <= 0) return "";
      let minute = parseInt(this.restTimeStamp / (60 * 1000)); // 多少分钟
      const restS = this.restTimeStamp - minute * 60 * 1000; // 剪掉分钟后，还剩余多少毫秒
      let second = parseInt(restS / 1000); // 秒数
      if (minute < 10) minute = `0${minute}`; // 不足两位补一位
      if (second < 10) second = `0${second}`; // 同上
      return `${minute}:${second}`;
    },

    /**
     * 返回完整的地址
     */
    returnFullAddress() {
      const provinceStr = this.orderAddressDtoObj.provinceStr || "";
      const cityStr = this.orderAddressDtoObj.cityStr || "";
      const areaStr = this.orderAddressDtoObj.areaStr || "";
      const street = this.orderAddressDtoObj.street || "";

      if (!street) return `${provinceStr}${cityStr}${areaStr}`; // 如果没有街道信息的话，那么取省市区数据

      if (
        street.includes(provinceStr) &&
        street.includes(cityStr) &&
        street.includes(areaStr)
      ) {
        // 表明街道信息是完整的地址，那么直接利用街道信息进行展示
        return street;
      }

      return `${provinceStr}${cityStr}${areaStr}${street}`;
    },

    /**
     * 再次下单
     */
    buyAgainHandler() {
      const { productId } = this.orderProductDetailDtoObj;
      if (!productId) return;
      this.$onTo(`/pages/product/product?productId=${productId}`);
    },

    /**
     * 支付的方法，这里是只有待支付的订单才需要进行支付
     */
    zhifuHandler() {
      const { orderId } = this.userOrdersDtoObj;
      const postObj = { orderId };
      const cnMap = { orderId: "订单ID" };
      const { postData, pass } = this.$postDataGuard(postObj, cnMap);
      if (!pass) return;

      this.$request("hzsx/api/order/userFreezeAgain", postData, "POST").then(
        (res) => {
          const resData = res.data || {};
          const { freezeAgainUrl } = resData;
          tradePay(freezeAgainUrl)
            .then((res) => {
              this.$eventEmitter.emit("refreshMyPageConfigData"); // 刷新我的页面的配置数据，使得我的订单页面中各个类型订单气泡显示对应的数字
              if (res.resultCode === "9000") {
                // 支付成功
                setTimeout(() => {
                  uni.showToast({ title: "支付成功" });
                  this.fetchOrderDetailData(false);
                }, 1000); // 加入一点延时，避免后端接收支付宝回调不及时。若不需要，那去掉延时
              }
            })
            .catch(() => {
              // 支付失败
              uni.showToast({ title: "支付失败" });
            });
        }
      );
    },

    /**
     * 查看协议的时候触发
     */
    seeXieyiHandler(key) {
      this.getXY(key);
    },
    /**
     * 获取协议
     */
    getXY(key) {
      this.$request(
        "hzsx/api/order/selectUserOrderDetail",
        { orderId: this.userOrdersDtoObj.orderId },
        "post",
        false,
        true
      ).then((res) => {
        const orderUrl = res.data?.[key];
        // const orderUrl = res.data.orderContractUrl;
        if (orderUrl) {
          this.openPDF(orderUrl);
        } else {
          uni.showToast({ title: "协议正在生成中，请稍等", icon: "none" });
        }
      });
    },
    /**
     * 拉起pdf文件
     */
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
  },
};
</script>

<style lang="scss" scoped>
 view{
	 box-sizing: border-box;
 }
.orderPageContainer {
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 220rpx;
  .top-status-wrapper {
    height: 360rpx;
    // background: #ffcb31;
	@include global-background-color2();
    display: flex;
    flex-direction: column;
	// padding: 24rpx 0 0 24rpx;
    // align-items: center;
    justify-content: center;
    .status-text {
	  width: 100%;
      font-size: 38rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 53rpx;
      margin-bottom: 20rpx;
	  padding: 0 24rpx;
	  display: flex;
	  justify-content: space-between;
    }
    .desc-text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #f0f0f0;
      line-height: 40rpx;
	  padding: 0 24rpx;
    }
    .desc-t1 {
      margin-bottom: 4rpx;
    }
    .desc-t2 {
      margin-bottom: 30rpx;
    }
    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-btn {
        width: 150rpx;
        height: 54rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        border-radius: 30rpx;
      }
      .contract-btn2 {
        background: #1f2129;
        color: #ffffff;
      }
	  .contract-btn {
		  color: #000;
		  // background: #ffffff !important;
		  background: linear-gradient(90deg, #ff0000, #ffeb3b, #03a9f4, #ff0000,);
		  background-size: 300%;
		  animation: move 6s infinite alternate;
		  position: relative;
		  z-index: 999;
	  }
	  @keyframes move {
	  	100% {
			background-position: -300% 0;
		}
		0% {
			background-position: 300% 0;
		}
	  }
	  .contract-btn::before {
		  content: '去加急';
		  position: absolute;
		  left: 5rpx;
		  right: 5rpx;
		  top: 5rpx;
		  bottom: 5rpx;
		  // background: linear-gradient(90deg, #ff0000, #ffeb3b, #03a9f4, #ff0000,);
		  background: #fff;
		  background-size: 400%;
		  border-radius: 30rpx;
		  // filter: blur(10rpx);
		  z-index: 999;
		  // animation: move 6s infinite alternate;
		  font-size: 24rpx;
		  text-align: center;
		  line-height: 44rpx;
		  @include global-color2();
		  font-weight: bold;
	  }
      .icon-btn + .icon-btn {
        margin-left: 20rpx;
      }
      .quzhifu-btn,
      .zaicixiadan-btn {
        background: #ffffff;
        box-shadow: 0 0 11rpx 0 rgba(0, 0, 0, 0.15);
        color: #f1192a;
      }
    }
	.btn-wrapperAdd {
		width: 702rpx;
		height: 70rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
		opacity: 0.98;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #FF5A55;
		font-size: 26rpx;
		margin-left: 24rpx;
		padding: 0 24rpx;
	}
  }
  .address-wrapper {
    padding: 30rpx;
    background: #fff;
    position: relative;
    top: -20rpx;
    left: 0;
    right: 0;
    border-radius: 20rpx;
    .top-line {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      .send-icon {
        width: 24rpx;
        height: 24rpx;
        margin-right: 10rpx;
      }
      .t1 {
        margin-right: 20rpx;
      }
    }
    .bottom-line {
      padding-left: 40rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 33rpx;
    }
  }
  .product-wrapper {
    padding: 30rpx;
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
  }
  .money-wrapper,
  .orderNum-wrapper {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    .row {
      height: 76rpx;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .label {
        color: #999999;
      }
      .value-cls {
        color: #333;
      }
    }
  }
  .mb40 {
    margin-bottom: 40rpx;
  }
  .zulin-xieyi {
    text-align: center;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999;
    .xieyi {
      display: block;
      text-align: center;
      color: #586e98;
      margin-bottom: 10rpx;
    }
  }
  .btnWrapper {
    position: fixed;
    z-index: 16;
    @include global-background-color();
    bottom: 30rpx;
    height: 98rpx;
    left: 0;
    right: 0;
    background: #fff;
    padding: 0 20rpx;
    border-top: 1rpx solid #dcdcdc;
    /deep/ .orderActionBtns-wrapper {
      height: 98rpx;
    }
  }
  .danban {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30rpx;
    background: #fff;
    z-index: 15;
  }
  /deep/ .btnWrapper {
    left: 0;
    width: 100vw;
    box-sizing: border-box;
  }
}
</style>
