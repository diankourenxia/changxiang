import { request } from "@/utils/index.js"
export default {
  //分类信息
  categoryList: (data) => {
    return request("/hzsx/aliPay/category/listLite", data, "get", true, true)
  },
  //获取分类页商品
  listLiteCategoryProduct: (data) => {
    return request(
      "/hzsx/aliPay/category/listLiteCategoryProduct",
      data,
      "get",
      true,
      true
    )
  },
}
