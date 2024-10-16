/**
 * 整个项目会用到的一些工具方法定义
 */
import { getAppId } from "./platform.js"
import globalData from "./globalData.js"
import { baseUrl } from "./constant"
import { eventBus } from "./eventPublishSubscribe"

/**
 * 错误的统一处理方法，可方便后续做错误监控
 * @param {boolean} letUserKnow : 是否toast让用户知晓
 */
export const errHandler = (err, letUserKnow = false) => {
  if (letUserKnow) {
    const str = typeof err === "string" ? err : JSON.stringify(err)
    uni.showToast({
      title: str,
      icon: "none",
    })
  } else {
    // eslint-disable-next-line
    console.error(err);
  }
}

/**
 * 获取到在App.vue文件中所定义的globalData对象数据
 * @param {string} key: 要获取globalData中的哪个值
 */
export const getGlobalData = (key) => {
  const globalObj = getApp().globalData || {}
  return globalObj[key]
}
//开始加载：把方法存到缓存中执行
export const getShowLoading = (obj) => {
  if (getGlobalData("showLoading")) {
    getGlobalData("showLoading")(obj)
  } else {
    let showLoading = uni.showLoading
    setGlobalData("showLoading", showLoading)
    uni.showLoading(obj)
  }
}
//结束加载：把方法存到缓存中执行
export const getHideLoading = () => {
  if (getGlobalData("hideLoading")) {
    getGlobalData("hideLoading")()
  } else {
    let hideLoading = uni.hideLoading
    setGlobalData("hideLoading", hideLoading)
    uni.hideLoading()
  }
}
/**
 * 接口调用函数
 * @param {string} url:接口路径
 * @param {Object} data:接口参数
 * @param {string} method:默认GET请求
 * @param {boolean} addUid : 是否需要把uid拼上去。注：目前只适用于将uid拼在链接上，而非放在data中，同时如果需要拼接多个参数的话，目前也不支持在这里进行统一拼接
 * @param {boolean} loading : 是否需要页面加载效果
 * @param {Object} customizeHeaderObj : 自定义请求头
 */
export const request = (
  url,
  data,
  method = "GET",
  addUid = false,
  loading = false,
  customizeHeaderObj = {}
) => {
  let requestUrl = url // 经过加工之后最终的请求链接
  if (addUid) {
    // 如果需要拼接往链接上拼接uid
    const uid = getUserId()
    if (!uid) { // 如果要求携带uid，但是又找不到uid数据的话，那么就不请求了
      errHandler(`请求${url}时找不到uid数据`)
      return Promise.reject("no uid")
    }
    if (url.includes("?")) {
      // 已经拼接过某个query了，注：外面无需手动给它加入&结尾
      requestUrl = `${url}&uid=${uid}`
    } else {
      requestUrl = `${url}?uid=${uid}`
    }
  }

  const infoObj = globalData.infoByAppId || {}
  const appDescObj = infoObj[getAppId()] || {}
  const channelid = appDescObj.channelId

  let myrequest = new Promise((resolve, reject) => {
    loading && getShowLoading({ content: "加载中..." })
    uni.request({
      url: `${baseUrl}${requestUrl}`,
      method: method,
      header: {
        channelid,
        ...customizeHeaderObj,
      },
      data: {
        channelId: channelid,
        ...data,
      },
      success: (res) => {
        if (
          res.data &&
          res.data.responseType !== "SUCCESS" &&
          res.data.errorMessage
        ) {
          uni.showToast({
            title: res.data.errorMessage,
          })
          loading && getHideLoading()
          return reject(res.data)
        } else {
          loading && getHideLoading()
          return resolve(res.data)
        }
      },
      fail: (res) => {
        loading && getHideLoading()
        uni.showToast({
          title: res.data.message,
        })
      },
    })
  })
  return myrequest
}

/**
 * 设置全局数据某个key的值
 * @param {string} key: 要设置的key
 * @param {any} val: 要设置的值
 */
export const setGlobalData = (key, val) => {
  if (!key) {
    // eslint-disable-next-line no-console
    console.error("请传入key")
    return
  }
  const globalObj = getApp().globalData || {}
  globalObj[key] = val
}

/**
 * 删掉存储在全局的某个数据，避免一直占用内存
 * @param {*} key
 */
export const delGlobalData = (key) => {
  if (!key) return
  const globalObj = getApp().globalData || {}
  delete globalObj[key]
}

/**
 * 保存租物租平台的用户详情信息，通过登录接口获取到的
 */
export const saveZWZUserDetail = (userVo) => {
  setStorageExpensive("zwzUserDetail", userVo)
}

/**
 * 将值保存到localStorage中，同时缓存一份数据到全局
 * 所以说，只有十分必要的数据存localStorage，否则直接利用setGlobalData存全局即可
 * 注：和getStorageCheap搭配使用
 * @param {*} k
 * @param {*} v
 */
export const setStorageExpensive = (k, v) => {
  setGlobalData(k, v)
  uni.setStorageSync(k, v)
}

/**
 * 空间换时间，全局取不到就从localStorage中取，然后在进行缓存
 * 注：同一个key必须搭配setStorageExpensive进行使用，否则可能缓存值可能过时了
 */
export const getStorageCheap = (key) => {
  const cacheVal = getGlobalData(key)
  if (cacheVal != undefined) return cacheVal // 内存中具有缓存值
  // 否则再从localStorage同步取
  const val = uni.getStorageSync(key)
  setGlobalData(key, val) // 取完后缓存到内存，那么下次再取就无需从localStorage中取，而是取的缓存
  return val
}

/**
 * 获取租物租平台的用户详情信息
 */
export const getZWZUserDetail = () => {
  return getStorageCheap("zwzUserDetail")
}

/**
 * 获取用户ID
 */
export const getUserId = () => {
  return getStorageCheap("uid")
  // return `91d9701539f99ed61cd217b3e13932910251ccf0li0h6anzt5h7`
}

/**
 * 保存用户ID
 */
export const saveUserId = (val) => {
  //uid存储到内容中减少api调用
  setStorageExpensive("uid", val)
}

/**
 * 支付宝登录的处理方法。就仅仅只是为了获取到用户的uid而言，采用静默授权和主动授权都是一样可以达到用处；
 * 但是如果想要获取到用户更多的信息的话，那么则必须使用主动授权。对于租物租平台的登录而言，后端只用了授权码去查uid。所以使用
 * @params {bool} isSilence : 是否不显示弹窗来获取用户的authCode
 * @params {Object} data : 传参数据
 * @params {Function} cb : 登录之后的调用方法
 */
const alipayLogin = (isSilence, data, cb, showToast) => {
  const scope = isSilence ? "auth_base" : "auth_user"
  my.getAuthCode({
    scopes: [scope],
    success: (res) => {
      const { authCode } = res
      if (!authCode) {
        uni.showToast({
          title: "获取授权码失败",
        })
        return
      }
      showToast && uni.showLoading({ title: "登录中", mask: true })
      const postData = {
        ...data,
        authCode,
      }
      request("hzsx/aliPay/user/exemptLogin", postData, "POST")
        .then((res) => {
          let userDetail = (res && res.data) || {}
		  userDetail.avatar = (userDetail?.avatar && userDetail.avatar) || 'https://oss.chuangliukeji.com/backstage/2023-11-27/e2a669f604b043dfbe758e13cbfdd4ee.png'
		  userDetail.nickName = (userDetail?.nickName && userDetail.nickName) || '畅享易租用户'
          const uid = userDetail.uid
          saveUserId(uid)
          saveZWZUserDetail(userDetail)
		  console.log('>>>>-login');
          eventBus && eventBus.emit("successLoginThenReFetch")
        })
        .catch((err) => {
          errHandler(err)
        })
        .finally(() => {
          // 万一登录接口出现问题，功能降级也支持用户浏览其它内容
          showToast && uni.hideLoading()
          cb && cb()
        })
    },
  })
}

/**
 * 登录的处理方法，先获取到用户在宿主平台的authCode，然后后端会利用这个authCode生成租物租平台的uId
 * @params {bool} isSilence : 是否采用静默授权，默认采用静默授权
 * @params {Object} data : 调用登录接口传的额外参数
 * @params {Function} cb : 登录成功之后的回调方法
 * @params {bool} refresh : 是否强制更新
 * @params {bool} showToast : 是否需要显示登录弹窗
 */
export const loginHandler = (
  isSilence = true,
  data = {},
  cb,
  refresh = false,
  showToast = true,
) => {
  const savedUid = getUserId() // 本地保存的用户ID，不能保证百分百有效，失效情况得在request中拦截
  if (savedUid && !refresh) {
    // 已存在的话就不显式登录了
    cb && cb()
    return
  }

  // #ifdef MP-ALIPAY
  return alipayLogin(isSilence, data, cb, showToast)
  // #endif
}

//支付宝小程序跳转 switchType:判断是否跳转tabBar

/**
 * 进行页面跳转的处理方法
 * @param {String} url : 需要跳转的页面地址
 * @param {Boolean} switchType : 判断是否跳转tabBar
 * @param {Boolean} useReplace : 是否采用覆盖形式进行跳转
 */
export const onAlipayTo = (url, switchType, useReplace = false) => {
  if (url.indexOf("alipays://") === 0) {
    if (url.indexOf("http") !== -1) {
      let paths = decodeURIComponent(url.replace(/.+(?=https)/, ""))
      //h5链接跳转
      my.ap.navigateToAlipayPage({
        path: paths,
      })
      return
    }
    let decodeUrl = decodeURIComponent(url).replace(/.+(?=appId)/, "")
    let urls = decodeUrl.split("&page=")
    let appId = urls[0].split("=")[1]
    let path = urls[1]
    //小程序之间跳转
    uni.navigateToMiniProgram({
      appId,
      path,
    })
  } else if (switchType) {
    uni.switchTab({
      url,
    })
  } else {
    // 常规路径跳转
    const jumpFun = useReplace ? uni.redirectTo : uni.navigateTo
    jumpFun({ url })
  }
}

/**
 * LOG: 部分支付宝账号可能不存在昵称
 * 判断本地是否有会员基础信息数据，会员基础信息文档：https://opendocs.alipay.com/mini/introduce/twn8vq
 */
export const checkHasUserBasicInfo = () => {
  const userObj = getZWZUserDetail()
  const { avatar, nickName } = userObj // 比较重要的就是这两个字段
  return avatar || nickName
  // return !!(avatar && nickName)
}
/**
 * 判断本地是否有手机号
 */
export const checkHasPhone = () => {
  const userObj = getZWZUserDetail()
  const { telephone } = userObj // 比较重要的就是这两个字段
  return !!telephone
}
/**
 * 检查进入页面时，是否缺失了页面的某部分关键参数
 * @param {Object} obj : 要进行检查的对象
 * @param {Array} checkKeys : 非必传，要检查这个对象的哪些字段参数
 * @return {Boolean} : true表示缺少了关键参数
 */
export const checkIsPageLessParameter = (obj, checkKeys) => {
  const checkFailedAction = () => {
    uni.showModal({
      title: "提示",
      content: "缺少关键参数，请尝试重新进入页面",
      showCancel: false,
      success: function () {
        uni.switchTab({ url: "/pages/index/index" })
      },
    })
  }
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
    checkFailedAction()
    return true
  }

  if (
    !checkKeys ||
    Object.prototype.toString.call(checkKeys) !== "[object Array]" ||
    !checkKeys.length
  ) {
    if (obj == undefined) { // 简单判断即可
      checkFailedAction()
      return true
    }
    return false
  }

  const isEverythingOk = checkKeys.every((k) => obj[k] != undefined)
  if (!isEverythingOk) {
    checkFailedAction()
    return true
  }
  return false
}

/**
 * 对时间字符串进行格式处理
 * @param {*} str
 * @param {*} fmt
 * @returns
 */
export const formatStrDate = (str, fmt) => {
  const o = {
    "y+": str.slice(0, 4),
    "M+": str.slice(5, 7),
    "d+": str.slice(8, 10),
    "h+": str.slice(11, 13),
    "m+": str.slice(14, 16),
    "s+": str.slice(17, 19),
  }

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (str.slice(0, 4) + "").substr(4 - RegExp.$1.length)
    )
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * 进行文件上传
 * @param {string} url : 图片资源的本地链接
 */
export const fileUploadHandler = (url) => {
  if (!url) {
    errHandler("上传时找不到文件", true)
    return Promise.reject()
  }
  return my
    .uploadFile({
      url: `${baseUrl}hzsx/api/components/uploadFile`,
      fileType: "image", // 仅仅只有支付宝小程序是必传的
      filePath: url,
      // name: "multipartFile",
      fileName: "multipartFile",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(result => {
      let url = JSON.parse(result?.data).data
      return url
      // const [error, response] = result
      // if (error) return undefined
      // const resData = JSON.parse(response.data)
      // const picUrl = resData && resData.data
      // return picUrl
    })
    .catch(() => {
      return undefined
    })
}

/**
 * 进行文件上传
 * @param {string} url : 图片资源的本地链接
 */
export const fileUploadHandlerWz = (url) => {
  if (!url) {
    errHandler("上传时找不到文件", true)
    return Promise.reject()
  }
  return my
    .uploadFile({
      url: `${baseUrl}hzsx/api/components/uploadWzFile`,
      fileType: "image", // 仅仅只有支付宝小程序是必传的
      filePath: url,
      // name: "multipartFile",
      fileName: "file",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(result => {
      let url = JSON.parse(result?.data).data
      return url
      // const [error, response] = result
      // if (error) return undefined
      // const resData = JSON.parse(response.data)
      // const picUrl = resData && resData.data
      // return picUrl
    })
    .catch(() => {
      return undefined
    })
}

/**
 * 判断是否进行实名认证
 * @param {Boolean} justCheckIdNum : 是否只需要检查身份证号码；如果只需要检查身份证号码的话，那么则认为有身份证号码即完成实名认证；否则不仅得检查身份证号码，还得检查图片
 */
export const checkHasShiMingRenZheng = (justCheckIdNum = false) => {
  return request(
    "/hzsx/userCertification/getDesensitizationByUid",
    {},
    "GET",
    true
  ).then((res) => {
    const vo = res.data || {}
    let checkKeys = ["idCard"] // 身份证号必检查
    if (!justCheckIdNum) { // 不仅仅只要检查身份证号的话，那么也得检查身份证图片
      checkKeys = checkKeys.concat(["idCardBackUrl", "idCardFrontUrl"])
    }

    const checkResult = checkKeys.every((n) => vo[n] != undefined)

    const obj = {
      idCard: vo["idCard"],
      checkResult,
    }
    return obj
  })
}

// 校验失败时的弹窗
export const failVerifyToast = cn => {
  const tip = cn ? `请输入${cn}` : "请填写所有参数在提交"
  uni.showToast({
    title: tip,
    icon: "none",
  })
}

/**
 * 传参的检查守卫，过滤掉空值，注意这里的校验，赞不支持复杂校验规则，只支持校验非空
 * @param {Object} data : 要进行校验检查的数据
 * @param {Object} cnMapObj : 字段的中英文对照
 * @param {Boolean} ignoreEmptyString : 判断是否需要过滤空字符串，传true代表空字符串也是有效的，默认认为空字符串是无效数据
 * @param {Boolean} hideToast : 是否需要隐藏弹窗，传true的话，参数校验失败并不会弹窗
 * @param {Array} checkKeys : 需要校验的键名列表
 * @param {Function} toastCb : 弹窗的提示方法
 */
export const postDataGuard = (
  data,
  cnMapObj,
  ignoreEmptyString = false,
  hideToast = false,
  checkKeys,
  toastCb = failVerifyToast
) => {
  if (!data) {
    !hideToast && toastCb && toastCb()
    return { postData: {}, status: false }
  }

  const keys = Object.keys(data)

  let checkKeyList = checkKeys // 需要检查的键名集合
  if (Object.prototype.toString.call(checkKeys) !== "[object Array]") {
    // 没有传入checkKeys，或者传入参数无效的话，那么默认检查对象的所有键名
    checkKeyList = keys
  }

  const newObj = {} // 该方法加工之后的数据，加工之后会把空值给过滤掉
  let passStatus = true // 校验状态，默认校验完成
  let failedKey = "" // 第一个校验失败的键名

  keys.forEach((key) => {
    const val = data[key]
    if (checkKeyList.includes(key)) {
      // 是待检查的键名
      if (val == undefined) {
        // 检查失败
        passStatus = false
      } else if (val == "" && !ignoreEmptyString) {
        // 检查失败：值为空字符串，且需要忽略掉空字符串
        passStatus = false
      } else if (
        Object.prototype.toString.call(val) === "[object Array]" &&
        !val.length
      ) {
        // 检查失败：是数组数据类型，而且是一个空数组
        passStatus = false
      } else {
        // 检查通过，将值挂载到newObj上面
        newObj[key] = val
      }

      if (!passStatus) {
        !failedKey && (failedKey = key) // 提示第一个校验失败的
      }
    } else {
      // 无需进行检查的键
      val != undefined && (newObj[key] = val) // 哪怕无需检查，也应该过滤掉传参中的undefined、null；空字符串、0、false继续保留其在后端都有对应的意思
    }
  })

  if (!passStatus) {
    const cn = cnMapObj?.[failedKey]
    !hideToast && toastCb && toastCb(cn)
  }

  return {
    postData: newObj,
    pass: passStatus,
  }
}

/**
 * 和下面均参考自：https://hehuiyun.github.io/2020/10/10/%E5%85%B3%E4%BA%8EJS%E5%B0%8F%E6%95%B0%E7%9A%84%E5%8A%A0%E5%87%8F%E4%B9%98%E9%99%A4%E7%B2%BE%E5%BA%A6%E4%B8%A2%E5%A4%B1%E9%97%AE%E9%A2%98/
 * 先将小数化为整数，然后在进行加法操作，避免丢失精度
 * @param {*} arg1
 * @param {*} arg2
 * @returns
 */
export const makeAdd = (arg1, arg2) => {
  let r1, r2, m
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  console.log(r1,r2);
  m = Math.pow(10, Math.max(r1, r2))
  return ((arg1 * m + arg2 * m) / m).toFixed(2)
}

// 进行减法操作
export const makeSub = (arg1, arg2) => {
  let r1, r2, m
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  const v = (arg1 * m - arg2 * m) / m
  return (v >= 0 ? v : 0).toFixed(2)
}

/**
 * 返回地址对象的字符串描述
 * 使用场景：归还页面、地址选择页面
 * @param {Object} addressObj : 地址对象
 */
export const getAddressDescStr = (addressObj) => {
  if (Object.prototype.toString.call(addressObj) !== "[object Object]")
    return ""
  const {
    provinceStr = "",
    cityStr = "",
    areaStr = "",
    street = "",
  } = addressObj
  return `${provinceStr}${cityStr}${areaStr}${street}`
}

/**
 * 为空时避免显示成undefined
 * @param {any} val 需要显示的，可能为空的值
 * @param {string} placeholder : 你希望的缺省占位符
 * @param {string} prefix : 前缀
 * @param {boolean} force : 是否需要强制进行校验
 * @returns string
 */
export const uiStr = (val, placeholder, prefix = "", force = false) => {
  if (val == undefined) {
    return placeholder || ""
  }
  const str = `${val}`
  const xiaoshu = str.split(".")[1] || ""
  if ((prefix == "¥" || force) && xiaoshu.length <= 1) { // 金额类，且小数点不足两位
    val = val.toFixed(2)
  }
  return `${prefix}${val}`
}

/**
 * 返回一个时间字符串的时间戳表示
 * @param {*} dateStr
 * @returns
 */
export const getDateValueOf = (dateStr) => {
  let dateObj
  if (!dateStr) {
    // 如果没传的化，默认取现在时间
    dateObj = new Date()
  } else {
    dateObj = new Date(dateStr.replace(/-/g, "/"))
  }

  return [
    dateObj.valueOf(),
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
  ]
}

/**
 * 获取商品的运费中文表述
 * @param {Object} obj : 商品对象
 */
export const getProductYunfeiText = obj => {
  const placholder = "-"
  if (Object.prototype.toString.call(obj) !== "[object Object]") return placholder
  const { returnfreightType, freightType } = obj
  const returnUIMap = {
    FREE: "归还用户支付",
    PAY: "归还商家承担",
  } // 归还时的中文对照

  const fahuoUIMap = {
    FREE: "发货商家包邮",
    PAY: "发货到付",
    SELF: "发货用户自提",
  } // 发货时的中文对照
  const part1 = fahuoUIMap[freightType] || ""
  const part2 = returnUIMap[returnfreightType] || ""

  let result = []
  result.push(part1)
  result.push(part2)

  result = result.filter(n => !!n) // 过滤无效值
  return result.join("/") || placholder
}

/**
 * 判断商品是否显示买断，以及是否支持提前买断
 * 1:可以提前买断。2:支持到期买断 0:不可以买断
 * @param {Object} obj : 商品对象
 * @return {Object} { canMaiduan: boolean, canBefore: boolean }，是否可以买断、是否可以提前买断
 */
export const returnProductMaiduanStatus = obj => {
  if (Object.prototype.toString.call(obj) !== "[object Object]") return {
    canMaiduan: false,
    canBefore: false,
  }
  const { buyOutSupport } = obj
  if (buyOutSupport == 0) {
    return {
      canMaiduan: false,
      canBefore: false,
    }
  } else if (buyOutSupport == 2) {
    return {
      canMaiduan: true,
      canBefore: false,
    }
  } else if (buyOutSupport == 1) {
    return {
      canMaiduan: true,
      canBefore: true,
    }
  } else {
    return {
      canMaiduan: false,
      canBefore: false,
    }
  }
}

/**
 * 获取channelID数据
 * @returns
 */
export const returnChannelId = () => {
  const infoObj = globalData.infoByAppId || {}
  const appDescObj = infoObj[getAppId()] || {}
  return appDescObj.channelId
}

// 检查是否绑定身份证的处理方法
export const zhouqiKouKuanClickHandler = () => {
  uni.showLoading({ title: "加载中" })
  return request("hzsx/userCyclePay/hasIdCard", {}, "GET", true).then(res => {
    uni.hideLoading()
    return res?.data
  }).then(hasBind => {
    if (hasBind) { // 表示已经绑定过身份证了
      onAlipayTo("/pages/cyclePaymentOrderList/cyclePaymentOrderList") // 跳转到周期扣款订单列表页面
    } else { // 还未绑定身份证，那么此时跳转到身份证绑定页面
      onAlipayTo("/pages/certificatesNoPhoto/certificatesNoPhoto?from=cyclePayment") // 跳转到无需上传身份证的身份认证页面，且告知该页面这是来自周期扣款使用场景
    }
  })
}

/**
 * 获取页面参数，分享场景通过onload参数会获取不到，得从页面栈中读取数据进行获取才行
 * @param {*} options 
 * @param {*} key 
 */
export const getPageParams = (options, key) => {
  let v
  if (options) {
    v = options[key]
  } else {
    const params = getCurrentPages()[0].options
    v = params[key] || ""
  }
  // #ifdef MP-ALIPAY
  return v
  // #endif
}


/**
 * 进行渠道埋点的处理方法
 * @returns 
 */
 export const channelMaiDianHandler = () => {
  const val = getGlobalData("subFenYongChannelId") // 渠道编码
  if (!val) { // 不存在渠道编码的话直接返回
    return
  }

  const uid = getUserId()
  if (!uid) {
    return
  }
  
  let postData = {
    uid,
    action: "index",
    channelId: val,
    position: "index",
  }
  console.log("渠道埋点数据", postData);
  return request(
    "hzsx/userPoint/insertUserPoint",
    postData,
    "get",
    false,
    true,
  )
  // .then(res=>{
	 //  if(!res.data){
		//   uni.redirectTo({
		//   	url:'/pages/channelsErr/channelsErr'
		//   })
	 //  }
  // })
}

/**
 * 进行店铺埋点的处理方法
 * @returns 
 */
 export const shopMaiDianHandler = () => {
  const val = getGlobalData("subDianpuChannelId") // 渠道编码
  if (!val) { // 不存在渠道编码的话直接返回
    return
  }

  const uid = getUserId()
  if (!uid) {
    return
  }
  
  let postData = {
    uid,
    action: "index",
    shopId: val,
  }
  console.log("店铺埋点数据", postData);
  return request(
    "hzsx/userPoint/insertUserPassesShopCode",
    postData,
    "get",
    false,
    true,
  )
}

/**
 * 进行场景码埋点的处理方法
 * @returns 
 */
 export const shopSceneHandler = () => {
  const val = getGlobalData("sceneId") // 场景码
  if (!val) { // 不存在场景码的话直接返回
    return
  }

  const uid = getUserId()
  if (!uid) {
    return
  }
  
  let postData = {
    uid,
    code: val,
  }
  console.log("场景埋点数据", postData);
  return request(
    "hzsx/userPoint/sceneUserPoint",
    postData,
    "get",
    false,
    true,
  )
}

/**
 * 进行留资回传的处理方法
 * @returns 
 */
 export const backUserUpload = (type) => {
  const uid = getUserId()
  if (!uid) {
    return
  }
  
  let postData = {
    uid,
    type
  }
  console.log("留资回传数据", postData);
  return request(
    "hzsx/userPoint/backUserUpload",
    postData,
    "get",
    false,
    true,
  )
}

let timerId; // 定义计时器 ID
export const startCountdown =() => {
  let count = 6; // 倒计时时间，单位为秒
  // 启动计时器
  timerId = setTimeout(function tick() {
    count--;
    if (count > 0) {
      // 显示剩余时间
      console.log(`剩余时间 ${count} 秒`);
      // 继续倒计时
      timerId = setTimeout(tick, 1000);
    } else {
		//小程序页面浏览
	  backUserUpload('225');
      // 时间到了，清除计时器
      clearTimeout(timerId);
    }
  }, 1000);
}

/**
 * 零元押金与芝麻免押双模式下。如用户在拉起芝麻免押时，直接退出小程序后无法调用更改订单模式接口，所以查询订单列表有无待支付订单，有，则调用。
 * @returns 
 */
 export const searchOrderListDaiFuKuan = () => {
  const uid = getUserId()
  if (!uid) {
    return
  }
  
  let postData = {
    uid,
	pageNumber: 1,
	pageSize: 100
  }
  console.log("查询订单列表数据", postData);
  return request(
    "hzsx/liteUserOrders/userOrderList",
    postData,
    "post",
    false,
    true,
  ).then(res=>{
	  if(res.data && res.data.records && res.data.records.length > 0){
		  res.data.records.map(item=>{
			  if(item.status === '01'){
				  return request(
				    "hzsx/api/order/orderFree",
				    { orderId: item.orderId },
				    "get",
				    false,
				    true,
				  )
			  }
		  })
	  }
  })
}


/**
 * 跳转到蚂蚁链小程序去签约代扣
 * @returns 
 */
export const navigateToMiniProgramSchemeZFB = (orderId, data) => {
	if (!data) {
		return
	}
	const { appId, tenantId, merchantId, signStr } = data;
	my.navigateToMiniProgram({
	 appId:"2021001152620480", // 区块链合同真实appId
	 path:"pages/tripartite/index", // 支付宝商家跳转区块链合同代扣签署地址（真实路径
	 query:{
	 signStr,// 签署代扣必要的字符串参数
	 tenantId,
	 merchantId,
	 orderId,
	 redirectUrl:`alipays://platformapi/startapp?appId=${getAppId()}&page=pages/orderList/orderList`, // 代扣签署成功/失败回跳地址，示例 alipays://platformapi/startapp?appId=2021004108689505&page=pages/home/index，appId 和 page 需要根据实际情况调整真实数值
	 }, // 需要携带的必要参数
	 success: () => {},
	 fail: () => {},
	 });
}

/**
 * 获取用户本机信息
 */
export const getSystemUserInfo = (onOrderId, onUidType) => {
	uni.getSystemInfo({
		success: function (res) {
			const { brand, currentBattery, deviceBrand, deviceld, deviceModel, deviceOrientation, deviceType, osName, osVersion, screen, storage } = res;
			if(onUidType) {
				const uid = getUserId()
				const postData = { brand, currentBattery, deviceBrand, deviceld, deviceModel, deviceOrientation, deviceType, osName, osVersion, screenWidth: screen.width, screenHeight: screen.height, storage, uid }
				return request(
				  "hzsx/api/order/addUserBrandInfo",
				  postData,
				  "post",
				  false,
				  false,
				)
			}
			if(onOrderId) {
				const uid = getUserId()
				const sceneId = getGlobalData("sceneId") // 场景码
				const postData = { brand, currentBattery, deviceBrand, deviceld, deviceModel, deviceOrientation, deviceType, osName, osVersion, screenWidth: screen.width, screenHeight: screen.height, storage, orderId: onOrderId, uid, sceneId }
				return request(
				  "hzsx/api/order/addOrderBrandInfo",
				  postData,
				  "post",
				  false,
				  false,
				)
			}
		}
	});
}

/**
 * 支付宝小程序新版本上线自动更新
 * @returns 
 */
export const updateMyManager = () => {
	//检查更新
	const updateManager = my.getUpdateManager()
	updateManager.onCheckForUpdate(function (res) {
	   // 请求完新版本信息的回调
	   console.log(res.hasUpdate)
	})
	updateManager.onUpdateReady(function () {
	    my.confirm({
	     title: '更新提示',
	     content: '新版本已经准备好，是否重启应用？',
	     success: function (res) {
	       if (res.confirm) {
	         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
	         updateManager.applyUpdate()
	       }
	     }
	    })
	})
	updateManager.onUpdateFailed(function () {
	  // 新版本下载失败
	})
}