/**
 * 跟平台相关的操作封装
 */
import { getZWZUserDetail, saveZWZUserDetail } from "./index"

/**
 * 获取到appId
 */
export const getAppId = () => {
  // #ifdef MP-ALIPAY
  return my.getAppIdSync().appId
  // #endif
	
  // #ifdef MP-TOUTIAO
  return ""
  // #endif
}

/**
 * 取消本地授权
 * @params {Function} cb : 成功删除个人信息之后的回调方法
 */
export const resetLocalAuth = cb => {
  // #ifdef MP-ALIPAY
  my.getSetting({
    success: res => {
      const { userInfo } = (res && res.authSetting) || {}
      if (!userInfo) { // 没有授权过个人信息，那么清除掉本地的个人信息数据
        const userObj = getZWZUserDetail() || {}
        // 删除用来判断本地是否有核心用户数据的判断，LOG：如果后续更新了utils.js/checkHasUserBasicInfo方法判断逻辑的话，那么这里也做做出相应改动
        delete userObj["avatar"]
        delete userObj["nickName"]

        saveZWZUserDetail(userObj)

        cb && cb()
      }
    }
  })
  // #endif
}

/**
 * 支付
 * @param {string} val : 接口返回的payUrl或者tradeNo数据
 * @param {boolean} useTradeNO : 表示使用tradeNo来进行支付
 * @returns 
 */
export const tradePay = (val, useTradeNO=false) => {
  // #ifdef MP-ALIPAY
  return new Promise((res, rej) => {
    const obj = {
      success:(data)=>{
        res(data)
      },
      fail:(data)=>{
        rej(data)
      }
    }
    let key = "orderStr"
    if (useTradeNO) {
      key = "tradeNO"
    }
    obj[key] = val
    my.tradePay(obj)
  })
  // #endif
}

/**
  * 唤起身份认证流程
  * @params {Object} data : 形如 { faceUrl, certifyId }的这样一个对象
  * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
  * 详细说明可查看文档下方的参数说明
 **/
export const startAPVerify = (data) =>{
  // #ifdef MP-ALIPAY
  return new Promise((res, rej) => {
    my.startAPVerify({
      url: data.faceUrl,
      certifyId: data.certifyId,
      success: (data)=> {
        res(data)
      },
      fail: (data)=> {
        rej(data)
      }
    })
  }) 
  // #endif
}