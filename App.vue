<script>
import globalData from "./utils/globalData.js"
import { getAppId } from "./utils/platform.js"
import { backUserUpload, startCountdown, getSystemUserInfo, updateMyManager } from "./utils/index.js"

/**
 * @param {*}   蚂蚁链-e签宝插件-兼容处理
 */
if (!my.canIUse('plugin') && !my.isIDE) {
  my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
}
export default {
  globalData, // 整个应用可以直接访问到的一些全局数据

  onLaunch: function(options) {
    const infoObj = this.$getGlobalData("infoByAppId") || {}
    const appDescObj = infoObj[getAppId()] || {}
    this.$setGlobalData("information", appDescObj)
	this.$setGlobalData("sceneId", options.scene || 0)
	
	/**
	 * @param 进行留资回传-219与223
	 * type:219:小程序收藏（API回传）
       221:小程序手机号授权（API回传）
       223:小程序访问（API回传）
       225:小程序页面浏览（API回传）
       309:首次付费（API 回传）人工信审通过
       426:小程序留资表单提交（API 回传）机审通过
	 */
	// 暂时去掉
	backUserUpload('219');
	backUserUpload('223');
	// 获取设备信息
	getSystemUserInfo(false,true);
	
	// 支付宝小程序新版本上线自动更新
	updateMyManager();
	
  },
 //  onShow(options) {
 //    console.log('App onShow Scene:', options.scene)
	// },

  // 给全局开启分享行为
  onShareAppMessage() {
    return {}
  },
}
</script>

<style>
	/*每个页面公共css */
	/* @font-face {
		font-family: "HarmonyOS"; 
		src: url("https://chuangshuozuji.oss-cn-hangzhou.aliyuncs.com/HarmonyOS_Sans_SC_Regular.ttf");
	} */
	/* view, text, scroll-view, h1, h2, h3, h4, h5, h6 {
		font-family: "HarmonyOS" !important;
	} */
</style>
