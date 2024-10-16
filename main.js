import Vue from "vue"
import App from "./App"
import { getGlobalData, setGlobalData, request, onAlipayTo, errHandler, checkIsPageLessParameter, fileUploadHandler,fileUploadHandlerWz, getUserId, delGlobalData, postDataGuard, uiStr, getPageParams } from "./utils/index.js"
import { router, RouterMount } from "./router.js" // LOG: 使用了uni-simple-router插件，关于这个插件的更多使用文档，可参考: https://hhyang.cn/v2/start/introduction.html
import { showBtns } from "./components/orderItem/orderActionBtns/utils/checkShowBtn"
import { eventBus } from "./utils/eventPublishSubscribe"
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
	appKey: '660a7ad9cac2a664de1211b8',
	useOpenid: true,
	debug: false
});
// 此处用来挂载入uma到组件实例上，方便组件内使用this.$uma
uma.install = function (Vue) {
	Vue.prototype.$uma = uma;
}
// #endif

Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$getGlobalData = getGlobalData
Vue.prototype.$setGlobalData = setGlobalData
Vue.prototype.$delGlobalData = delGlobalData
Vue.prototype.$onTo = onAlipayTo
Vue.prototype.$errHandler = errHandler
Vue.prototype.$orderModuleShowActionBtn = showBtns // 订单模块按钮的显示与否都会使用到，与其不断引入，不如挂载到全局实例上面
Vue.prototype.$checkIsPageLessParameter = checkIsPageLessParameter // 检查页面是否缺少了关键参数，比如说从订单列表页面点击进入订单详情页面，上个页面会传个订单ID下去，缺少这个关键数据的话，整个页面都是不可用的
Vue.prototype.$fileUploadHandler = fileUploadHandler
Vue.prototype.$fileUploadHandlerWz = fileUploadHandlerWz
Vue.prototype.$getUid = getUserId // 使用挺频繁的，挂载全局，避免每次引入
Vue.prototype.$eventEmitter = eventBus
Vue.prototype.$postDataGuard = postDataGuard
Vue.prototype.$uiStr = uiStr
Vue.prototype.$getPageParams = getPageParams

Vue.use(uma);

Vue.use(router)
App.mpType = "app"
const app = new Vue({ ...App })

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, "#app")
// #endif

// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
