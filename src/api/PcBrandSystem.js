import { get, post } from "@/utils/request";

const baseUrl = "/api/PcBrandSystem/";

export default {
    // 根据id集合删除品牌
    DeleteBrandSystemAsyncCtl(params){
        return post(baseUrl + "DeleteBrandSystemAsyncCtl", params)
    },
    // 根据id获取系统
    GetBrandSystemByIdAsyncCtl(params){
        return get(baseUrl + "GetBrandSystemByIdAsyncCtl", params)
    },
    // 查询系统列表
    GetListBrandSystemAsyncCtl(params){
        return post(baseUrl + "GetListBrandSystemAsyncCtl", params)
    },
    // 分页查询系统
    GetPageListBrandSystemAsyncCtl(params){
        return post(baseUrl + "GetPageListBrandSystemAsyncCtl", params)
    },
    // 添加系统
    InsertBrandSystemAsyncCtl(params){
        return post(baseUrl + "InsertBrandSystemAsyncCtl", params)
    },
    // 更新系统
    UpdateBrandSystemAsyncCtl(params){
        return post(baseUrl + "UpdateBrandSystemAsyncCtl", params)
    },
}