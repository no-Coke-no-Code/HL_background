import { get, post,del } from "@/utils/request";

const baseUrl = "/api/PcCurriculum/";

export default {
    //   批量上下架课程/专栏
    BatchUpperAndLowerCurriculumAsyncCtl(params){
        return post(baseUrl + "BatchUpperAndLowerCurriculumAsyncCtl", params)
    },

    // 删除课程集合
    DeleteCurriculumAsyncCtl(params){
        return post(baseUrl + "DeleteCurriculumAsyncCtl", params)
    },

    // 删除专栏
    DeleteSpecialAsyncDmSvc(params){
        return del(baseUrl + "DeleteSpecialAsyncDmSvc", params)
    },

    // 根据id获取课程/专栏信息
    GetCurriculumByIdAsyncCtl(params){
        return get(baseUrl + "GetCurriculumByIdAsyncCtl", params)
    },

    // 分页获取课程/专栏列表
    GetPageListCurriculumAsyncCtl(params){
        return post(baseUrl + "GetPageListCurriculumAsyncCtl", params)
    },

    // 分页获取专栏添加课程列表
    GetPageListCurriculumBySpecialAsyncCtl(params){
        return post(baseUrl + "GetPageListCurriculumBySpecialAsyncCtl", params)
    },

    // 插入课程/专栏
    InsertCurriculumAsyncCtl(params){
        return post(baseUrl + "InsertCurriculumAsyncCtl", params)
    },

    // 插入课程/专栏
    UpdateCurriculumAsyncCtl(params){
        return post(baseUrl + "UpdateCurriculumAsyncCtl", params)
    },

    // 插入课程/专栏
    UpperAndLowerCurriculumAsyncCtl(params){
        return get(baseUrl + "UpperAndLowerCurriculumAsyncCtl", params)
    },
}