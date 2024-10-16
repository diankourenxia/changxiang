/**
 * 使用了插件uni-simple-router，关于这个插件的更多内容，可参考链接：https://hhyang.cn/v2/start/introduction.html
 */
import { RouterMount, createRouter } from "./js_sdk/hhyang-uni-simple-router/uni-simple-router.js"
import { loginHandler } from "./utils/index.js"
import { eventBus } from "./utils/eventPublishSubscribe"

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,  
  routes: [...ROUTES]
})

// 全局路由前置守卫
// 这个路由切换，并不能监听到底部栏切换所引起的路由变化
router.beforeEach((to, from, next) => {
  // 只有当登录完了才进行页面渲染；这样可以避免万一登录接口返回不及时，但是用户已经做了某些关键操作而造成缺少登录态
  const fromPath = from?.path
  const hits = [
    "/pages/orderList/orderList",
    "/pages/orderDetail/orderDetail",
  ]
  if (hits.includes(fromPath)) { // 隐藏省略号
    eventBus && eventBus.emit("hidePopup")
  }
  loginHandler(true, {}, next)
})

export {
  router,
  RouterMount
}