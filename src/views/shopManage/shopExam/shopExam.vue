<template>
    <div class="wrapper">
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch" @regionChange="regionChange"></searchOptions>
        <el-table max-height="500px" :data="tableData" style="margin-top:20px;" class="table">
            <el-table-column label="序号" type="index" width="50px"></el-table-column>
            <el-table-column label="门店名称" prop="ShopName" width="150px"></el-table-column>
            <el-table-column label="门店地址" prop="ShopAddress" width="150px"></el-table-column>
            <el-table-column label="门店类型" width="150px">
                <template slot-scope="scope">
                    {{scope.row.ShopName}}({{scope.row.BrandSystemName}})
                </template>
            </el-table-column>
            <el-table-column label="渠道" prop="ChannelName" width="150px"></el-table-column>
            <el-table-column label="导购员" prop="GuideUserNumber" width="150px"></el-table-column>
            <el-table-column label="经销商" prop="DealerName" width="150px"></el-table-column>
            <el-table-column label="门店负责人" width="200px">
                <template slot-scope="scope">
                    {{scope.row.Contacts}}({{scope.row.ShopPhoneNumber}})
                </template>
            </el-table-column>
            <el-table-column label="业务员" prop="BusinessUser" width="150px"></el-table-column>
            <el-table-column label="操作" fixed="right" width="150px">
                <template slot-scope="scope">
                    <span class="action" style="margin-right:20px;" @click="examSuccess(scope.row)">审核通过</span>
                    <span class="action" @click="examFail(scope.row)">审核失败</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination
            :total="PageModel.PageCount"
            :currentPage="PageModel.PageIndex"
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></Pagination>

        <!-- 导购员列表弹窗 -->
        <el-dialog
        title="审核失败"
        :visible.sync="dialogVisible"
        width="40%">
            <textarea v-model="failReason" placeholder="请输入审核失败原因"></textarea>
            <div class="btnGroup">
                <el-button @click="cancel" style="margin-right:20px">取消</el-button>
                <el-button @click="confirm" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import search from "./config/search.json";
import searchOptions from "@/components/SearchOptions";
import Pagination from "@/components/Pagination/index.vue"; //分页

export default {
    name:"shopExam",
    components:{
        searchOptions,
        Pagination
    },
    data(){
        return{
            search:search,
            PageModel:{
                PageCount:0,
                PageIndex:1,
                PageSize:10
            },
            pageSizes:[10,20,30],
            tableData:[],
            dialogVisible:false,
            failReason:"",

            chosenShop:{},
            shopAsistantList:[], // 导购员列表
            systemList:[], // 系统列表
            areaId:"",
            provinceId:"",
            cityId:"",
        }
    },
    methods:{
        // 地区切换事件
        regionChange(areaId,provinceId,cityId){
            console.log(areaId,provinceId,cityId);
            this.areaId = areaId;
            this.provinceId = provinceId;
            this.cityId = cityId;
        },
        // 搜索事件
        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                sendObj[this.search[i].key] = this.search[i].value;
            }
            sendObj = Object.assign(sendObj,{
                AreaId:this.areaId,
                ProvinceId:this.provinceId,
                CityId:this.cityId,
                PageIndex:this.PageModel.PageIndex,
                PageSize:this.PageModel.PageSize,
                PageCount:this.PageModel.PageCount
            });
            this.$http.PcShop
            .PcGetPageListShopAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.tableData = res.Item;
                this.PageModel.PageCount = res.PageModel.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 获取系统列表
        getSystemList(){
            let sendObj = {
                BrandSystemName:"",
            };
            this.$http.PcBrandSystem
            .GetListBrandSystemAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.systemList = res;
                for(let i = 0;i<this.systemList.length;i++)
                {
                    for(let x = 0;x<this.search.length;x++)
                    {
                        if(this.search[x].key === 'BrandSystemName')
                        {
                            this.search[x].options.push({
                                label:this.systemList[i].BrandSystemName,
                                value:this.systemList[i].BrandSystemName,
                            });
                        }
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 审核门店成功
        examSuccess(row){
            let sendObj = {
                ShopId:row.ShopId,
                ExamineStatus:2
            };
            this.$http.PcShop
            .PcExamineShopAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.$message({
                    type:"success",
                    message:"操作成功"
                });
                this.confirmSearch();
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 审核门店失败弹窗
        examFail(row){
            this.dialogVisible = true;
            this.chosenShop = row;
        },
        cancel(){
            this.dialogVisible = false;
            this.failReason = "";
        },
        confirm(){
            let sendObj = {
                ShopId:this.chosenShop.ShopId,
                FailureReasons:this.failReason,
                ExamineStatus:3
            };
            this.$http.PcShop
            .PcExamineShopAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.failReason = "";
                this.dialogVisible = false;
                this.$message({
                    type:"success",
                    message:"操作成功"
                });
                this.confirmSearch();
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 切换每页大小
        handleSizeChange(val){
            this.PageModel.PageSize = val;
            this.confirmSearch();
        },
        // 跳页
        handleCurrentChange(val){
            this.PageModel.PageIndex = val;
            this.confirmSearch();
        },
    },
    created(){
        this.getSystemList();
        this.confirmSearch();
    },
}
</script>
<style lang="scss" scoped>
.wrapper
{
    padding: 30px;
    .table
    {
        .action
        {
            cursor: pointer;
            color: #409EFF;
        }
    }
    /deep/.el-dialog
    {
        overflow: hidden;
        textarea
        {
            resize:none;
            padding:10px;
            border:1px solid #CCCCCC;
            border-radius:2px;
            width:100%;
            height: 100px;
            margin-bottom: 20px;
            box-sizing: border-box;
        }
        .btnGroup
        {
            float:right;
            margin-bottom: 30px;
        }
    }
}
</style>