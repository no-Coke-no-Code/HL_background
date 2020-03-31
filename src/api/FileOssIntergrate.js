import { get, post } from "@/utils/request";

const baseUrl = "/api/FileOssIntergrate/";

export default {
    // 获取上传文件签名
    GetSignKeyCtl(params,type){
        return post(baseUrl + "GetSignKeyCtl?type="+type, params)
    },

    // 上传文件
    UploadFileCtl(params){
        return post(baseUrl + "UploadFileCtl", params)
    },
}