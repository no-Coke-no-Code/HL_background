import { get, post } from "@/utils/request";

const baseUrl = "/api/PcCommon/";

export default {
    // 获取小程序首页json
    GetHomeJsonUrl(params){
        return get(baseUrl + "GetHomeJsonUrl", params)
    },

    // 获取腾讯云储存上传签名
    GetTencentOssSignCtl(params){
        return get(baseUrl + "GetTencentOssSignCtl", params)
    },
}