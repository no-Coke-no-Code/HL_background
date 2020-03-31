import { get, post,del ,put} from "@/utils/request";

const baseUrl = "/api/PcCommodityCategory/";

export default {
  // 删除商品分类
  DeleteCommodityCategoryCtl(params){
    return del(baseUrl + "DeleteCommodityCategoryCtl", params)
  },

  // 获取所有商品分类
  GetCommodityCategoryCtl(params){
    return post(baseUrl + "GetCommodityCategoryCtl", params)
  },

  // 获取所有商品分类
  InsertCommodityCategoryCtl(params){
    return post(baseUrl + "InsertCommodityCategoryCtl", params)
  },

  // 获取所有商品分类
  UpdateCommodityCategoryCtl(params){
    return put(baseUrl + "UpdateCommodityCategoryCtl", params)
  },
}