<template>
    <div class="wrapper">
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>
        <div class="titleWrapper">
            <p>系统列表</p>
            <el-button class="createSys" @click="createSys">+ 新建系统</el-button>
        </div>
        <el-table max-height="500px" :data="tableData" style="margin-top:20px;" class="table">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="系统名称" prop="BrandSystemName"></el-table-column>
            <el-table-column label="备注" prop="Remark"></el-table-column>
            <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
            <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                    <span class="action" style="margin-right:20px;" @click="edit(scope.row)">编辑</span>
                    <span class="action" @click="Delete(scope.row)">删除</span>
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
            <el-form :model="sysInfo">
                <el-form-item label="系统名称" prop="BrandSystemName">
                    <el-input v-model="sysInfo.BrandSystemName"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="Sort">
                    <el-input v-model="sysInfo.Sort"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                    <el-input v-model="sysInfo.Remark"></el-input>
                </el-form-item>
            </el-form>
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
    name:"sysManage",
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

            sysInfo:{
                BrandSystemName:"",
                Sort:"",
                Remark:"",
            },
            chosenSys:{},
            shopAsistantList:[], // 导购员列表
            systemList:[], // 系统列表
            areaId:"",
            provinceId:"",
            cityId:"",
        }
    },
    methods:{
        // 搜索事件
        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                sendObj[this.search[i].key] = this.search[i].value;
            }
            sendObj = Object.assign(sendObj,{
                PageIndex:this.PageModel.PageIndex,
                PageSize:this.PageModel.PageSize,
                PageCount:"",
            });
            this.$http.PcBrandSystem
            .GetPageListBrandSystemAsyncCtl(sendObj)
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

        // 新建系统操作
        createSys(){
            this.dialogVisible = true;
            this.sysInfo = {
                BrandSystemName:"",
                Sort:"",
                Remark:"",
            };
        },
        // 编辑系统操作
        edit(row){
            this.chosenSys = row;
            this.sysInfo = {
                BrandSystemName:this.chosenSys.BrandSystemName,
                Sort:this.chosenSys.Sort,
                Remark:this.chosenSys.Remark,
            };
            this.dialogVisible = true;
        },
        // 删除系统操作
        Delete(row){
            console.log(row);
            this.$confirm('确定删除系统"'+ row.BrandSystemName +'"', "删除", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            })
            .then(()=>{
                let sendObj = {
                    id:row.Id
                };

            })
            .catch(()=>{}) 
        },


        cancel(){
            this.dialogVisible = false;
        },
        confirm(){
            let sendObj = {

            };
            POST /api/PcBrandSystem/UpdateBrandSystemAsyncCtl
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
        // this.getSystemList();
        this.confirmSearch();
    },
}
</script>
<style lang="scss" scoped>
.wrapper
{
    padding: 30px;
    .titleWrapper
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p
        {
            font-weight: bold;
        }
        .createSys
        {
            border: 1px solid #1E87FE;
            color: #1E87FE;
        }
    }
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