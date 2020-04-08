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
                    <span class="action" style="margin-right:20px;" @click="check(scope.row)">查看导购员</span>
                    <span class="action" @click="end(scope.row)">结业</span>
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
        :title="'导购员列表(' + shopAsistantList.length + ')'"
        :visible.sync="dialogVisible"
        width="60%">
            <p style="margin-bottom:10px;font-size:18px;">{{chosenShop.ShopName}}({{chosenShop.BrandSystemName}})</p>
            <el-table :data="shopAsistantList" class="dialogTable">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="微信昵称">
                    <template slot-scope="scope">
                        <div style="display:flex;align-items:center;justify-content:center">
                            <img :src="scope.row.HeadimgUrl" style="width:30px;height:30px;border-radius:50%;margin-right:10px;"/>
                            <span>{{scope.row.NickName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="TrueName" label="真实姓名"></el-table-column>
                <el-table-column prop="Phone" label="手机号"></el-table-column>
                <el-table-column prop="Balance" label="账户余额(元)"></el-table-column>
                <el-table-column prop="Integral" label="积分"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>

import search from "./config/search.json";
import searchOptions from "@/components/SearchOptions";
import Pagination from "@/components/Pagination/index.vue"; //分页

export default {
    name:"shopList",
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

        // 查看导购员
        check(row){
            this.chosenShop = row;
            let ShopId = row.ShopId;
            let sendObj = {
                ShopId,
                PageIndex:1,
                PageSize:999,
                PageCount:"",
            };
            this.$http.HLUser
            .GetPageListGuideUserAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.dialogVisible = true;
                this.shopAsistantList = res.Item;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 门店结业
        end(row){
            this.$confirm('确定门店'+ row.ShopTypeName + '(' + row.BrandSystemName + ')结业?', "提示", {
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
}
</style>