import { get, post , del } from "@/utils/request";

const baseUrl = "/api/PcCommodity/";

export default {
    // 分页查询商品
    GetPageListCommodityCtl(params){
        return post(baseUrl + "GetPageListCommodityCtl", params)
    },

    // 删除商品
    DeleteCommodityCtl(params){
        if(params.id)
        {
            return del(baseUrl + "DeleteCommodityCtl?id="+params.id, params)
        }
    },

    // 根据商品货号查询
    GetCommodityByCodeCtl(params){
        return post(baseUrl + "GetCommodityByCodeCtl", params)
    },

    // 添加商品
    InsertCommodityCtl(params){
        return post(baseUrl + "InsertCommodityCtl", params)
    },

    // 更新商品
    UpdateCommodityCtl(params){
        return post(baseUrl + "UpdateCommodityCtl", params)
    },
}