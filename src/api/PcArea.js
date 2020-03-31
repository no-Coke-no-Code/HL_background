import { get, post } from "@/utils/request";

const baseUrl = "/api/PcArea/";

export default {
    // 邀请业务员
    CreateBusinessUserAsyncCtl(params){
        return post(baseUrl + "CreateBusinessUserAsyncCtl", params)
    },
    // 业务员导出excel
    ExcelBusinessUserAsyncCtl(params){
        return get(baseUrl + "ExcelBusinessUserAsyncCtl", params)
    },
    // 根据UDID获取业务员
    GetBusinessUserByUDIDAsyncCtl(params){
        return get(baseUrl + "GetBusinessUserByUDIDAsyncCtl", params)
    },
    // 分页查询业务员
    GetPageListBusinessUserAsyncCtl(params){
        return post(baseUrl + "GetPageListBusinessUserAsyncCtl", params)
    },
    // 分页查询导购员
    GetPageListGuideUserAsyncCtl(params){
        return post(baseUrl + "GetPageListGuideUserAsyncCtl", params)
    },
    // 业务员权限设置
    SetBusinessUserPowerAsyncCtl(params){
        return post(baseUrl + "SetBusinessUserPowerAsyncCtl", params)
    },
    // 更新业务员
    UpdateBusinessUserAsyncCtl(params){
        return post(baseUrl + "UpdateBusinessUserAsyncCtl", params)
    },
}