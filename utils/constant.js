/**
 * 整个项目中会用到的一些常量定义
 */

// 后端接口环境定义，除了封装的request方法会用到之外，某些uni的网络请求API(如uploadFile)也会用到，此时不易于使用uni.request封装
 export const baseUrl = "https://www.changxiangwl.cn/zyj-api-web/"; // 线上
 export const xYUrl ="https://www.changxiangwl.cn/zyj-components-center/contract/order";
 export const xieyiUrl ="https://www.changxiangwl.cn/zyj-components-center/contract/";


// 新旧程序对照map
export const OLD_NEW_MAP = {
  1: "全新",
  2: "99新",
  3: "95新",
  4: "9成新",
  5: "8成新",
  6: "7成新",
};

// 空白文案的占位
export const EMPTY_PLACEHOLDER = "-";

export const ALL_ORDER_ID = "all";

export const ALL_ORDER_TEXT = "全部";

// 我的订单中的所有菜单数据
export const TABS = [
  {
    id: ALL_ORDER_ID,
    extCode: "",
    text: ALL_ORDER_TEXT,
  },
  {
    id: "WAITING_PAYMENT",
    extCode: "ORDER_WAIT_PAY",
    text: "待付款",
  },
  {
    id: "TO_AUDIT",
    extCode: "ORDER_TO_AUDIT",
    text: "待审核",
  },
  {
    id: "PENDING_DEAL",
    extCode: "ORDER_WAIT_DELIVERY",
    text: "待发货",
  },
  {
    id: "WAITING_USER_RECEIVE_CONFIRM",
    extCode: "ORDER_WAIT_RECEIVE",
    text: "待收货",
  },
  {
    id: "RENTING",
    extCode: "ORDER_RENTING",
    text: "租用中",
  },
  {
    id: "WAITING_SETTLEMENT",
    extCode: "ORDER_WAIT_SETTLE",
    text: "待结算",
  },
  {
    id: "OVER_DUE",
    extCode: "ORDER_OVERDUE",
    text: "已逾期",
  },
  {
    id: "CLOSED",
    extCode: "",
    text: "已关闭",
  },
  {
    id: "FINISH",
    extCode: "",
    text: "已完成",
  },
];

// 运费对照对照表
export const freightTypeObj = {
  FREE: "包邮",
  PAY: "到付",
  SELF: "自提",
};

// tab导航
export const tabsDetails = ["商品详情", "租赁说明"];

export const 待付款 = "01";
export const 支付中 = "02";
export const 已支付申请关单 = "03";
export const 待发货 = "04";
export const 待收货 = "05";
export const 租用中 = "06";
export const 待结算 = "07";
export const 结算待支付 = "08";
export const 已完成 = "09";
export const 已关闭 = "10";
export const 待审核 = "11";
export const 待归还 = "12";
export const 审核拒绝 = "15";
export const 等待审核 = "16";
export const 待审核中 = "17";

export const orderStatusNumber2Cn = {
  [待付款]: "待付款",
  [支付中]: "支付中",
  [已支付申请关单]: "已支付申请关单",
  [待发货]: "待发货",
  [待收货]: "待收货",
  [租用中]: "租用中",
  [待结算]: "待结算",
  [结算待支付]: "结算待支付",
  [已完成]: "已完成",
  [已关闭]: "已关闭",
  [待审核]: "待审核",
  [待归还]: "待归还",
  [审核拒绝]: "审核拒绝",
  [等待审核]: "等待审核",
  [待审核中]: "待审核",
};

export const orderStatusDesc = {
  [待付款]: {
    title: "等待付款",
    desc1: "",
    desc2: "如有疑问，请联系客服",
  },
  [支付中]: {
    title: "等待付款",
    desc1: "",
    desc2: "如有疑问，请联系客服",
  },
  [已支付申请关单]: {
    title: "待审核",
    desc1: "订单飞速审核中，请稍等片刻",
    desc2: "如有疑问，请联系客服",
  },
  [待发货]: {
    title: "等待发货",
    desc1: "您的宝贝即将发货，请耐心等待",
    desc2: "如有疑问，请联系客服",
  },
  [待收货]: {
    title: "等待收货",
    desc1: "您的宝贝正在路上",
    desc2: "收货后有任何问题请联系客服",
  },
  [租用中]: {
    title: "租用中",
    desc1: "1号是您的租金支付日期",
    desc2: "记得按时还款，避免逾期哦",
  },
  [待结算]: {
    title: "等待结算",
    desc1: "请及时关注您的结算信息",
    desc2: "收货后有任何问题请联系客服",
  },
  [结算待支付]: {
    title: "等待结算",
    desc1: "请及时关注您的结算信息",
    desc2: "收货后有任何问题请联系客服",
  },
  [已完成]: {
    title: "已完成",
    desc1: "订单完成啦",
    desc2: "",
  },
  [已关闭]: {
    title: "已关闭",
    desc1: "您的订单已关闭",
    desc2: "如有支付金额，将会在1-3个工作日原路退回",
  },
  [待审核]: {
    title: "待审核",
    desc1: "订单飞速审核中，请稍等片刻",
    desc2: "如有疑问，请联系客服",
  },
  [等待审核]: {
    title: "待审核",
    desc1: "订单飞速审核中，请稍等片刻",
    desc2: "如有疑问，请联系客服",
  },
  [待审核中]: {
    title: "待审核",
    desc1: "订单飞速审核中，请稍等片刻",
    desc2: "如有疑问，请联系客服",
  },
  [待归还]: {},
  [审核拒绝]: {
    title: "审核拒绝",
    desc1: "订单被审核拒绝，请主动取消订单",
    desc2: "如有疑问，请联系客服",
  },
};

// 小程序分享的配置数据
export const shareConfigObj = {
  title: "",
  desc: "信用免押租，游戏数码应有尽有",
  path: "pages/index/index",
};
// export const shareConfigObj = {
//   title: "",
//   desc: "游戏数码应有尽有",
//   path: "pages/index/index",
// };

// 归还运费的中英文对照
export const yunfeiReturnMap = {
  FREE: "用户支付",
  PAY: "商家承担",
};

/**
 * 存在全局的一些数据变量命名，注意这里随便加入的一些字符，可以避免同一个全局变量被重复使用
 */
export const billDetailGlobalKey = "billDetail_dsjakjqw1213";

export const sendbackPageProductGlobalKey =
  "sendbackPageProductGlobalKey_shjdslasjkjk12";

export const selectAddressObjKey = "selectAddressObjKey_89erer9";

// 中文虽low，但却最为直观
export const 待支付 = "1";
export const 逾期未支付 = "4";
export const 已支付 = "2";
export const 逾期已支付 = "3";
