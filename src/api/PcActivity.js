import { get, post , del ,put } from "@/utils/request";

const baseUrl = "/api/PcActivity/";

export default {
    // 活动审核驳回
    ActivityAuditDeclineCtl(params){
        return post(baseUrl + "ActivityAuditDeclineCtl", params)
    },

    // 删除活动
    DeleteActivityAsyncCtl(params){
        if(params.id)
        {
            return del(baseUrl + "DeleteActivityAsyncCtl?id="+params.id, params)
        }
    },

    // 获取导购员待审核商品奖励金额
    GetGuideAuditProductCtl(params){
        return post(baseUrl + "GetGuideAuditProductCtl", params)
    },

    // 获取活动审核结果列表
    GetPagedListActivityAuditListCtl(params){
        return post(baseUrl + "GetPagedListActivityAuditListCtl", params)
    },

    // 获取销售凭证
    GetSalesDocumentCtl(params){
        return get(baseUrl + "GetSalesDocumentCtl", params)
    },

    // 新增活动
    InsertActivityCtl(params){
        return post(baseUrl + "InsertActivityCtl", params,true,{
            isReturnAll:true
        })
    },

    // 订单奖励人工发放
    OrderAwardManualAuditCtl(params){
        return post(baseUrl + "OrderAwardManualAuditCtl", params)
    },

    // 单品奖励人工发放
    ProductAwardManualAuditCtl(params){
        return post(baseUrl + "ProductAwardManualAuditCtl", params)
    },

    // 设置活动上下架
    SetActivityStatusCtl(params){
        if(params.activityId)
        {
            return put(baseUrl + "SetActivityStatusCtl?activityId="+params.activityId, params)
        }
    },

    // 修改活动
    UpdateActivityCtl(params){
        return put(baseUrl + "UpdateActivityCtl", params,true,{

        })
    },

    // 活动列表
    GetActivityListAsyncCtl(params){
        return post(baseUrl + "GetActivityListAsyncCtl", params)
    },

    // 活动数量统计
    GetActivityCountCtl(){
        return get(baseUrl + "GetActivityCountCtl")
    },

    // 活动查询门店
    ActivityQueryShopCtl(params){
        return post(baseUrl + "ActivityQueryShopCtl", params)
    },

    // 编辑活动查询
    EditActivityQueryCtl(params){
        return get(baseUrl + "EditActivityQueryCtl", params)
    },

    // 单品奖励审核查询
    ProductAwardAuditQueryCtl(params){
        return get(baseUrl + "ProductAwardAuditQueryCtl", params)
    },
}