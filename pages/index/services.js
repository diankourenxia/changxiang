import {
  request
} from "@/utils/index.js"
export default {
  //首页请求
  getIndexActionListByPage: (data) => {
    return request("hzsx/aliPay/index/getIndexActionListByPage", data,"get",false,true)
  },
  //获取瀑布流
  getIndexTabAndProductByPage: (data) => {
    return request("hzsx/aliPay/index/getIndexTabAndProductByPage", data,"get",false,true)
  },
  //获取公告
  selectApiNotice: (data) => {
    return request("hzsx/aliPay/index/selectApiNotice", data,"get",true)
  },
  
}
