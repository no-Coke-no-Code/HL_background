<template>
    <div class="wrapper">
        <div class="itemList">
            <div class="item">
                <p class="title">待支出奖励(元)</p>
                <p class="money">{{waitPay}}</p>
            </div>
            <div class="item">
                <p class="title">累计支出奖励(元)</p>
                <p class="money">{{totalPay}}</p>
            </div>
        </div>
        <div class="divide"></div>
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch" @select-change="selectChange"></searchOptions>
        <el-table
            :data="tableData"
            border
            stripe
            class="table"
        >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="导购员" prop="TrueName"></el-table-column>
            <el-table-column label="所属系统" prop="BrandSystemName"></el-table-column>
            <el-table-column label="所属门店" prop="ShopName"></el-table-column>
            <el-table-column label="奖励金额" prop="ActivityAwardMoney" width="150px"></el-table-column>
            <el-table-column label="活动名称" prop="Title" width="150px"></el-table-column>
            <el-table-column label="活动审核时间" prop="AuditTime" width="200px"></el-table-column>
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
</template>
<script>

import search from "./config/search.json";
import searchOptions from "@/components/SearchOptions";
import Pagination from "@/components/Pagination/index.vue"; //分页

export default {
    name:"rewardDetail",
    components:{
        searchOptions,
        Pagination
    },
    data(){
        return{
            waitPay:0,
            totalPay:0,
            search:search,
            tableData:[],

            pageSizes:[10,20,30],
            PageModel:{
                PageIndex:1,
                PageSize:10,
                PageCount:0,
            },
        }
    },
    created(){
        this.getExpense();
        this.getSystemName();
        this.confirmSearch();
    },
    methods:{
        // 获取奖励支出统计
        getExpense(){
            this.$http.PcFinance
            .ExpenseStatisticsCtl()
            .then((res)=>{
                console.log(res);
                this.waitPay = res.WaitingExpense;
                this.totalPay = res.TotalExpense;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 获取所有系统名
        getSystemName(){
            let sendObj = {
                "PageIndex": 1,
                "PageSize": 9999,
                "PageCount": 0
            };
            this.$http.PcBrandSystem
            .GetPageListBrandSystemAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                let brandList = res.Item;
                for(let i = 0;i<this.search.length;i++)
                {
                    if(this.search[i].key === 'BrandSystemName')
                    {
                        for(let x = 0;x<brandList.length;x++)
                        {
                            this.search[i].options.push({
                                label:brandList[x].BrandSystemName,
                                value:brandList[x].BrandSystemName
                            });
                        }
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 品牌切换事件
        selectChange(val){
            let sendObj = {
                "BrandSystemName": val.value,
                "PageIndex": 1,
                "PageSize": 999,
                "PageCount": 0
            };
            this.$http.PcShop
            .PcGetPageListShopAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                let shopList = res.Item;
                for(let i = 0;i<this.search.length;i++)
                {
                    if(this.search[i].key === 'ShopName')
                    {
                        for(let x = 0;x<shopList.length;x++)
                        {
                            this.search[i].options.push({
                                value:shopList[x].ShopName,
                                label:shopList[x].ShopName
                            });
                        }
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
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
            .GetGuideAwardDetailListCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.tableData = res.ListData;
                this.PageModel.PageCount = res.Paged.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 每页条数变化
        handleSizeChange(val){
            this.PageModel.PageSize = val;
            this.confirmSearch();
        },
        // 页码改变
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
    padding: 20px;
    .itemList
    {
        display: flex;
        .item
        {
            width: 340px;
            height: 140px;
            border-radius: 8px;
            padding: 34px 40px;
            .title
            {
                margin-bottom: 24px;
                font-size: 18px;
            }
            .money
            {
                font-size: 40px;
                font-weight: bold;
            }
            &:nth-of-type(1)
            {
                background-color: #FFF3F3;
                margin-right: 20px;
            }
            &:nth-of-type(2)
            {
                background-color: #FFF7E7;
            }
        }
    }
    .divide
    {
        width: 100%;
        height: 2px;
        background-color: #CCCCCC;
        margin: 30px 0;
    }

}
</style>