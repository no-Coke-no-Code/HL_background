<template>
    <div class="wrapper">
        <div class="title">活动列表页</div>
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <div class="contentArea">
            <div class="flex space-between align-center" style="margin-bottom:20px;">
                <tab :tabList="tabList" @selectChange="selectChange"></tab>
                <el-button
                    type="primary"
                    class="width-button"
                    @click="addActivity"
                    >+ 创建活动</el-button
                >
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                class="table"
            >
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="活动名称" prop="Title"></el-table-column>
                <el-table-column label="活动时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.StartTime}}</span>
                        至
                        <span>{{scope.row.EndTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="真实点赞数" prop="SetPraiseCount"></el-table-column>
                <el-table-column label="活动状态">
                    <template slot-scope="scope">
                        {{
                            scope.row.ActionStatus === 0?'未开始':
                            scope.row.ActionStatus === 1?'进行中':'已结束'
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="上架状态">
                    <template slot-scope="scope">
                        <span class="up" v-if="scope.row.Status === 1">上架</span>
                        <span class="down" v-if="scope.row.Status === 0">下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="action" @click="handleEdit(scope.row)">编辑</span>
                        <span class="action" @click="updateSaleStatus(scope.row)">{{scope.row.Status===1?'下架':'上架'}}</span>
                        <span class="action" @click="handleDelete(scope.row)">删除</span>
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
        </div>
    </div>
</template>
<script>

import searchOptions from "@/components/SearchOptions";
import tab from "@/components/tab";
import Pagination from "@/components/Pagination/index.vue"; //分页

var search = require("./config/search.json");

export default {
    name:"activityList",
    components:{
        searchOptions,
        tab,
        Pagination
    },
    data(){
        return{
            search:search,
            currentChosen:null,
            pageSizes:[10,20,30],
            tabList:[
                {
                    label:"全部",
                    value:null,
                    count:0,
                },
                {
                    label:"上架",
                    value:1,
                    count:0,
                },
                {
                    label:"下架",
                    value:0,
                    count:0,
                }
            ],
            tabType:1,
            tableData:[],
            PageModel:{
                PageIndex: 1,
                PageSize: 10,
                PageCount: 0
            },
        }
    },
    created(){
        this.confirmSearch();
    },
    methods:{
        // 搜索事件
        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time')
                {
                    this.$nextTick(()=>{
                        if(this.search[i].value.start)
                        {
                            sendObj.BeginDate = this.search[i].value.start
                        }
                        else
                        {
                            sendObj.BeginDate = "";
                        }

                        if(this.search[i].value.end)
                        {
                            sendObj.EndDate = this.search[i].value.end
                        }
                        else
                        {
                            sendObj.EndDate = "";
                        }
                    });
                }
                else
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            console.log(this.currentChosen);
            let ActivityStatus;
            if(this.currentChosen === null)
            {
                ActivityStatus = null;
            }
            else
            {
                ActivityStatus = this.currentChosen.value
            }
            sendObj = Object.assign(sendObj,{
                ActivityStatus:ActivityStatus,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                }
            });
            console.log(sendObj);
            this.$http.PcActivity
            .GetActivityListAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.tableData = res.ListData;
                this.PageModel.PageCount = res.Paged.PageCount;
                for(let i = 0;i<this.tabList.length;i++)
                {
                    if(this.tabList[i].label === '全部')
                    {
                        this.tabList[i].count = res.TotalCount;
                    }
                    else if(this.tabList[i].label === '上架')
                    {
                        this.tabList[i].count = res.OnlineCount;
                    }
                    else if(this.tabList[i].label === '下架')
                    {
                        this.tabList[i].count = res.OffLineCount;
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        addActivity(){
            this.$router.push({path:"addActivity"});
        },

        // 切换状态
        selectChange(item){
            this.currentChosen = item;
            this.confirmSearch();
        },

        // 编辑表格栏
        handleEdit(row){
            console.log(row);
            this.$router.push({
                path:"addActivity",
                query:{
                    id:row.Id
                }
            });
        },
        // 上下架操作
        updateSaleStatus(row){
            console.log(row);
            let status = row.Status;
            let text;
            if(!status)
            {
                text = "是否要上架该商品?";
            }
            else
            {
                text = "是否要下架该商品?";
            }
            this.$confirm(text, "上下架操作", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let sendObj = {
                    activityId:row.Id,
                };
                this.$http.PcActivity.SetActivityStatusCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                    this.$message({
                        type:"success",
                        message:"更新状态成功"
                    });
                    this.confirmSearch();
                }).catch((err)=>{
                    console.log(err);
                });
            })
            .catch(()=>{});
        },
        // 删除操作
        handleDelete(row){
            console.log(row);
            this.$confirm('确定要删除活动"'+row.Title+'"?', "删除活动", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let sendObj = {
                    id:row.Id
                };
                this.$http.PcActivity
                .DeleteActivityAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                    this.$message({
                        message:"删除成功",
                        type:"success"
                    });
                    this.confirmSearch();
                })
                .catch((err)=>{
                    console.log(err);
                });
            })
            .catch(()=>{})
        },

        // 分页大小改变
        handleSizeChange(val){
            this.PageModel.PageSize = val;
            this.confirmSearch();
        },
        // 分页页码改变
        handleCurrentChange(val){
            this.PageModel.PageIndex = val;
            this.confirmSearch();
        },

    },
}
</script>
<style lang="scss" scoped>
.wrapper
{
    background: #fff;
    padding: 20px;
    .title
    {
        margin-bottom: 30px;
        padding-bottom: 18px;
        border-bottom: 1px solid #E5E5E5;
        font-weight: bold;
    }
    .actionArea
    {
        border-bottom: 2px solid #cccccc;
        margin-bottom: 20px;
    }

    .contentArea
    {
        .table
        {
            .up
            {
                color: #29AF39;
            }
            .down
            {
                color: #FF0202;
            }
            .action
            {
                color: #409EFF;
                margin-right: 10px;
                cursor: pointer;
                &:last-of-type
                {
                    margin: 0;
                }
            }
        }
    }
}
</style>