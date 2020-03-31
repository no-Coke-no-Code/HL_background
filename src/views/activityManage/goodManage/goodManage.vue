<template>
    <div class="wrapper">
        <!-- 搜索区域 -->
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <div class="title">
            <span>商品列表</span>
            <el-button @click="addGood" class="addBtn">+ 新增商品</el-button>
        </div>

        <el-table :data="goodlist">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="商品名称">
                <template slot-scope="scope">
                    <div class="flex align-center flex-center">
                        <img class="goodImg" :src="scope.row.PictureUrl"/>
                        <span class="goodName">{{scope.row.Name}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品货号" prop="CommodityCode"></el-table-column>
            <el-table-column label="商品分类" prop="CommodityCategoryName"></el-table-column>
            <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span @click="edit(scope)" class="actionBtn">编辑</span>
                    <span @click="Delete(scope)" class="actionBtn">删除</span>
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

        <div class="mengceng" v-if="ifShowDialog">
            <div class="dialog">
                <el-form :model="goodInfo" :inline="true" :rules="rules" ref="goodInfo">
                    <el-form-item label="商品分类" prop="CommodityCategoryId">
                        <el-select v-model="goodInfo.CommodityCategoryId">
                            <el-option v-for="(item,index) in goodTypeList" :key="index" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="Name">
                        <el-input
                            clearable
                            v-model="goodInfo.Name"
                            placeholder="请输入商品名称"
                            maxlength="10"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="商品货号" prop="CommodityCode">
                        <el-input
                            clearable
                            v-model="goodInfo.CommodityCode"
                            placeholder="请输入商品货号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="goodImg">
                        <Uploader
                            :limit="1"
                            :imgList="goodInfo.goodImg"
                            :sizeLimmit="10"
                            ref="imgUploader"
                            @uploadFile="getUploadFile"
                            @imgChange="handleImgChange"
                            :path="'images/'"
                            @handleDelete="handleDelete"
                            :tip="'建议尺寸：宽750px，高500px，10M以内，支持PNG，JPG格式'"
                        />
                    </el-form-item>
                </el-form>
                <div class="btnGroup">
                    <el-button class="cancelBtn" @click="cancel">取消</el-button>
                    <el-button class="confirmBtn" @click="confirm">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import searchOptions from "@/components/SearchOptions";
import Uploader from "@/components/Uploader/index.vue";
import Pagination from "@/components/Pagination/index.vue"; //分页

var search = require("./config/search.json");

export default {
    name:"goodManage",
    components:{
        searchOptions,
        Uploader,
        Pagination
    },
    data(){
        return{
            state:"",
            editGoodId:"",
            pageSizes:[10,20,30],
            goodlist:[],
            goodInfo:{
                CommodityCategoryId: "",
                Name: "",
                CommodityCode: "",
                goodImg:[],
            },
            PageModel:{
                PageIndex: 1,
                PageSize: 10,
                PageCount: 0
            },
            search:search,

            // 表单验证规则
            rules: {
                Name: [
                    { required: true, message: "请输入商品名称", trigger: "blur" }
                ],
                CommodityCategoryId: [
                    { required: true, message: "请选择商品类型", trigger: "change" }
                ],
                CommodityCode: [
                    { required: true, message: "请输入商品货号", trigger: "blur" }
                ],
                goodImg: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少上传一张封面图片",
                        trigger: "change"
                    }
                ],
            },

            goodTypeList:[],
            uploadDone:false,
            ifShowDialog:false // 商品弹窗 
        }
    },
    methods:{
        // 获取上传文件
        getUploadFile(file){
            console.log("getUrl", file);
            this.goodInfo.goodImg.push(file.url);
            this.uploadDone = true;
        },
        // 修改图片
        handleImgChange(file, index) {
            this.$set(this.goodInfo.goodImg, index, file.url);
        },
        // 删除图片
        handleDelete(i) {
            this.goodInfo.goodImg.splice(i, 1);
        },

        confirmSearch(){
            let sendObj = {};
            this.goodInfo = {
                CommodityCategoryId: "",
                Name: "",
                CommodityCode: "",
                goodImg:[],
            };
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time')
                {
                    this.$nextTick(()=>{
                        if(this.search[i].value.start)
                        {
                            sendObj.BeginDateTime = this.search[i].value.start
                        }
                        else
                        {
                            sendObj.BeginDateTime = "";
                        }

                        if(this.search[i].value.end)
                        {
                            sendObj.EndDateTime = this.search[i].value.end
                        }
                        else
                        {
                            sendObj.EndDateTime = "";
                        }
                    });
                }
                else
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            sendObj.Paged = {
                PageIndex:this.PageModel.PageIndex,
                PageSize:this.PageModel.PageSize,
                PageCount:""
            };
            this.$http.PcCommodity
            .GetPageListCommodityCtl(sendObj)
            .then((res)=>{
                this.goodlist = res.ListData;
                this.PageModel.PageCount = res.Paged.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        
        addGood(){
            this.state = "create";
            this.ifShowDialog = true;
            this.dialogType = 0;
        },

        
        edit(scope){
            this.state = "edit";
            this.goodInfo = scope.row;
            this.editGoodId = this.goodInfo.Id;
            let goodImgList = scope.row.PictureUrl.split(",");
            if(goodImgList[0] !== "")
            {
                this.goodInfo.goodImg = goodImgList;
            }
            this.ifShowDialog = true;
            this.dialogType = 1;
        },
        Delete(scope){
            this.$confirm('确定要删除商品"'+scope.row.Name+'"?', "删除商品", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                let sendObj = {
                    id:scope.row.Id
                };
                this.$http.PcCommodity
                .DeleteCommodityCtl(sendObj)
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
            .catch(() => {});
        },

        cancel(){
            this.goodInfo = {
                CommodityCategoryId: "",
                Name: "",
                CommodityCode: "",
                goodImg:[],
            };
            this.ifShowDialog = false;
        },
        confirm(){
            this.$refs.goodInfo.validate((valid)=>{
                if(valid)
                {
                    this.ifShowDialog = false;
                    let PictureUrl = this.goodInfo.goodImg.join(",");
                    let sendObj = {
                        CommodityCode:this.goodInfo.CommodityCode,
                        Name:this.goodInfo.Name,
                        PictureUrl,
                        CommodityCategoryId:this.goodInfo.CommodityCategoryId,
                    };
                    if(this.state === "create")
                    {
                        this.$http.PcCommodity
                        .InsertCommodityCtl(sendObj)
                        .then((res)=>{
                            if(res)
                            {
                                this.$message({
                                    type:"success",
                                    message:"添加商品成功"
                                });
                                this.ifShowDialog = false;
                                this.confirmSearch();
                            }
                            else
                            {
                                this.$message({
                                    type:"warning",
                                    message:"添加商品失败"
                                });
                            }
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    }
                    else if(this.state === "edit")
                    {
                        sendObj.Id = this.editGoodId;
                        this.$http.PcCommodity.UpdateCommodityCtl(sendObj).then((res)=>{
                            if(res)
                            {
                                this.$message({
                                    type:"success",
                                    message:"更新商品成功"
                                });
                                this.ifShowDialog = false;
                                this.confirmSearch();
                            }
                            else
                            {
                                this.$message({
                                    type:"warning",
                                    message:"更新商品失败"
                                });
                            }
                        }).catch((err)=>{
                            console.log(err);
                        });
                    }
                }
                else
                {
                    return
                }
            });
        },
        closeDialog(){
            this.goodInfo = {
                goodName:"",
                goodNo:"",
                goodType:"",
                goodImg:[],
            };
            this.ifShowDialog = false;
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
    async created(){
        // 获取所有商品分类
        let sendObj = {
            Name:"",
            Paged:{
                PageIndex:1,
                PageSize:1000,
                PageCount:""
            }
        };
        let res = await this.$http.PcCommodityCategory.GetCommodityCategoryCtl(sendObj);
        this.goodTypeList = res.ListDate;
        for(let i = 0;i<this.search.length;i++)
        {
            if(this.search[i].key === 'CommodityCategoryId')
            {
                for(let x = 0;x<this.goodTypeList.length;x++)
                {
                    let tempObj = {
                        value:this.goodTypeList[x].Id,
                        label:this.goodTypeList[x].Name
                    };
                    this.search[i].options.push(tempObj);
                }
            }
        }

        this.confirmSearch()
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.wrapper
{
    padding: 20px;
    .title
    {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span
        {
            font-size: 16px;
            font-weight: bold;
        }
        .addBtn
        {
            color: $baseColor;
            border: 1px solid $baseColor;
            width: 90px;
            height: 30px;
        }
    }
    .actionBtn
    {
        cursor: pointer;
        color: #409EFF;
        &:first-of-type
        {
            margin-right: 20px;
        }
    }
    .goodImg
    {
        width: 40px;
        height: 40px;
    }

    .mengceng
    {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 9;
        .dialog
        {
            background-color: #fff;
            width: 500px;
            border-radius: 4px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            padding: 30px;
            .titleWrapper
            {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                .title,.closeIcon
                {   
                    font-weight: bold;
                }
                .title
                {
                    margin: 0;
                }   
                .closeIcon
                {
                    cursor: pointer;
                }
            }
            .btnGroup
            {
                float: right;
                .confirmBtn
                {
                    color: #fff;
                    background-color: $baseColor;
                }
            }
        }
    }

}
</style>