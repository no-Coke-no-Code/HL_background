import { get, post } from "@/utils/request";

const baseUrl = "/api/PcShop/";

export default {
    // 审核门店(审核、冻结)
    PcExamineShopAsyncCtl(params){
        return post(baseUrl + "PcExamineShopAsyncCtl", params)
    },

    // 分页查询门店
    PcGetPageListShopAsyncCtl(params){
        return post(baseUrl + "PcGetPageListShopAsyncCtl", params)
    },

    // 根据id获取门店详情
    GetPageListCommodityCtl(params){
        return get(baseUrl + "GetPageListCommodityCtl", params)
    },

    // 更新门店
    PcUpdateShopAsyncCtl(params){
        return post(baseUrl + "PcUpdateShopAsyncCtl", params)
    },
}