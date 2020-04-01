<template>
    <div class="wrapper">
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <div class="contentArea">
            <div class="flex space-between align-center" style="margin-bottom:20px;">
                <tab :tabList="tabList" @selectChange="selectChange"></tab>
                <div class="btnGroup">
                    <el-button @click="multiAction(1)" class="actionBtn">批量审核通过</el-button>
                    <el-button @click="multiAction(2)" class="actionBtn">批量审核失败</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                class="table"
                @selection-change="tableSelectionChange"
            >
                <el-table-column type="selection" :selectable='checkSelectable'></el-table-column>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="提现单号" prop="PartnerTradeNo" width="150px"></el-table-column>
                <el-table-column label="导购员" prop="TrueName"></el-table-column>
                <el-table-column label="提现金额(元)" prop="ApplyMoney"></el-table-column>
                <el-table-column label="到账方式" prop="WithdrawalType"></el-table-column>
                <el-table-column label="时间" width="200px">
                    <template slot-scope="scope">
                        <p v-if="scope.row.CreateTime">申请:{{scope.row.CreateTime}}</p>
                        <p v-if="scope.row.UpdateTime">审核:{{scope.row.UpdateTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="CreateTime">
                    <template slot-scope="scope">
                        <p 
                        :class="{'wait':scope.row.Status===0,'success':scope.row.Status===1,'fail':scope.row.Status===2||scope.row.Status===3}"
                        >
                            {{
                                scope.row.Status===0 ? '待审核' : 
                                scope.row.Status===1 ? '审核通过' :
                                scope.row.Status===2 ? '申请被驳回' : '申请失败'
                            }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div class="actionGroup" v-if="scope.row.Status === 0">
                            <span class="action" style="margin-right:20px;" @click="examAction(scope.row,1)">审核通过</span>
                            <span class="action" @click="examAction(scope.row,2)">驳回</span>
                        </div>
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

import search from "./config/search.json";
import searchOptions from "@/components/SearchOptions";
import Pagination from "@/components/Pagination/index.vue"; //分页
import tab from "@/components/tab/index.vue";

export default {
    name:"withdrawList",
    components:{
        searchOptions,
        Pagination,
        tab
    },
    data(){
        return{
            pageSizes:[10,20,30],
            PageModel:{
                PageIndex:1,
                PageSize:10,
                PageCount:0,
            },
            withDrawList:[],
            state:"",
            tabList:[
                {
                    label:"全部",
                    value:null,
                    count:0,
                },
                {
                    label:"待审核",
                    value:0,
                    count:0,
                },
                {
                    label:"审核成功",
                    value:1,
                    count:0,
                },
                {
                    label:"已驳回",
                    value:2,
                    count:0,
                },
                {
                    label:"转账失败",
                    value:3,
                    count:0,
                },
            ],
            tableData:[],
            search:search,
        }
    },
    created(){
        this.confirmSearch();
    },
    methods:{
        // 获取表格选中事件
        tableSelectionChange(val){
            console.log(val,'当前选中表格');
            this.withDrawList = JSON.parse(JSON.stringify(val));
        },

        // 根据当前行状态，判断是否可以进行审核操作
        checkSelectable(row){
            if(row.Status === 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        },

        multiAction(val){
            let AuditList = [];
            if(!this.withDrawList.length)
            {
                this.$message({
                    type:"warning",
                    message:"请先进行选择"
                });
                return
            }
            console.log(this.withDrawList);
            for(let i = 0;i<this.withDrawList.length;i++)
            {
                let tempObj = {};
                tempObj.Id = this.withDrawList[i].Id;
                tempObj.UdId = this.withDrawList[i].UdId;
                // 审核通过
                if(val === 1)
                {
                    tempObj.IsPass = true;
                }
                // 审核失败
                else if(val === 2)
                {
                    tempObj.IsPass = false;
                }
                AuditList.push(tempObj);
            }
            let sendObj = {
                AuditList
            };
            this.$http.PcFinance
            .WithdrawCashAuditCtl(sendObj)
            .then((res)=>{
                console.log(res);
                if(res)
                {
                    this.$message({
                        type:"success",
                        message:"操作成功"
                    });
                    this.confirmSearch();
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 搜索列表
        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time' && this.search[i].value.start)
                {
                    sendObj.BeginDate = this.search[i].value.start
                }
                if(this.search[i].key === 'time' && this.search[i].value.end)
                {
                    sendObj.EndDate = this.search[i].value.end;
                }
                if(this.search[i].key !== "time")
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            sendObj = Object.assign(sendObj,{
                Status:this.state,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                },
            });
            this.$http.PcFinance
            .GetWithdrawCashListCtl(sendObj)
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
                    else if(this.tabList[i].label === '待审核')
                    {
                        this.tabList[i].count = res.UnAuditCount;
                    }
                    else if(this.tabList[i].label === '审核成功')
                    {
                        this.tabList[i].count = res.AuditPassCount;
                    }
                    else if(this.tabList[i].label === '已驳回')
                    {
                        this.tabList[i].count = res.RejectCount;
                    }
                    else if(this.tabList[i].label === '转账失败')
                    {
                        this.tabList[i].count = res.FailureCount;
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 每页大小切换事件
        handleSizeChange(val){
            this.PageModel.PageSize = val;
            this.confirmSearch();
        },
        // 切换页码事件
        handleCurrentChange(val){
            this.PageModel.PageIndex = val;
            this.confirmSearch();
        },

        // tab栏切换事件
        selectChange(item){
            console.log(item);
            this.state = item.value;
            this.confirmSearch();
        },

        // 审核/驳回操作
        examAction(row,val){
            let AuditList = [{
                Id:row.Id,
                UdId:row.UdId,
            }];
            // 审核通过
            if(val === 1)
            {
                AuditList[0].IsPass = true;
            }
            // 审核驳回
            else if(val === 2)
            {
                AuditList[0].IsPass = false;
            }
            let sendObj = {
                AuditList
            };
            this.$http.PcFinance
            .WithdrawCashAuditCtl(sendObj)
            .then((res)=>{
                console.log(res);
                if(res)
                {
                    this.$message({
                        type:"success",
                        message:"操作成功"
                    });
                    this.confirmSearch();
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
}
</script>
<style lang="scss" scoped>
.wrapper
{
    padding: 20px;
    .contentArea
    {
        .btnGroup
        {
            .actionBtn
            {
                color: #1E87FE;
                border: 1px solid #1E87FE;
                border-radius: 2px;
            }
        }
        .table
        {
            .wait
            {
                color: #FF9200;
            }
            .fail
            {
                color: #FF0202;
            }
            .success
            {
                color: #29AF39;
            }
            .action
            {
                color: #409EFF;
                cursor: pointer;
            }
        }
    }
}
</style>