import {
  request
} from "@/utils/index.js"
export default {
  //首页请求
  getIndexActionListByPage: (data) => {
    return request("hzsx/aliPay/index/getIndexActionListByPage", data,"get",false,true)
  },
  
}
