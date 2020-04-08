import { get, post } from "@/utils/request";

const baseUrl = "/api/PcArea/";

export default {
    // 查询区域列表
    GetListAreaAsyncCtl(params){
        return get(baseUrl + "GetListAreaAsyncCtl", params)
    },

    // 查询城市列表
    GetListCityAsyncCtl(params){
        return get(baseUrl + "GetListCityAsyncCtl", params)
    },

    // 查询省份列表
    GetListProvinceAsyncCtl(params){
        return get(baseUrl + "GetListProvinceAsyncCtl", params)
    },
}