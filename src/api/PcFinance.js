import { get, post,put } from "@/utils/request";

const baseUrl = "/api/PcFinance/";

export default {
    // 奖励支出统计
    ExpenseStatisticsCtl(params){
        return get(baseUrl + "ExpenseStatisticsCtl", params)
    },

    // 获取导购员奖励明细
    GetGuideAwardDetailListCtl(params){
        return post(baseUrl + "GetGuideAwardDetailListCtl", params)
    },

    // 获取提现设置
    GetWithdrawalSettingCtl(params){
        return get(baseUrl + "GetWithdrawalSettingCtl", params)
    },

    // 获取申请列表
    GetWithdrawCashListCtl(params){
        return post(baseUrl + "GetWithdrawCashListCtl", params)
    },

    // 提现设置
    WithdrawalSettingCtl(params){
        return put(baseUrl + "WithdrawalSettingCtl", params)
    },

    // 提现审核
    WithdrawCashAuditCtl(params){
        return put(baseUrl + "WithdrawCashAuditCtl", params)
    },
}