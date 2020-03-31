<template>
    <div class="wrapper">
        <!-- 搜索区域 -->
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <tab :tabList="tabList" @selectChange="selectChange"></tab>

        <el-table :data="proofList" style="margin-top:20px;" class="proofTable">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column :label="pageType==='lesson'?'课程名称':'专栏名称'" prop="CurriculumName"></el-table-column>
            <el-table-column v-if="pageType==='series'" label="专栏类型" prop=""></el-table-column>
            <el-table-column label="分类"></el-table-column>
            <el-table-column label="积分值"></el-table-column>
            <el-table-column label="评论数"></el-table-column>
            <el-table-column label="上架状态"></el-table-column>
            <el-table-column label="上架时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span class="action" v-if="scope.row.FeatureType===1" @click="checkCatalogue(scope.row)">查看目录</span>
                    <span class="action" @click="edit(scope.row)">编辑</span>
                    <span class="action" @click="updateStatus(scope.row)">{{scope.row.Status==='上架'?'下架':'上架'}}</span>
                    <span class="action" @click="Delete(scope.row)">删除</span>
                    <span class="action" @click="showLink(scope.row)">前端链接</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination
            :total="PageModel.PageCount"
            :currentPage="PageModel.PageIndex"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></Pagination>

        <div class="mengceng" v-if="ifShowDialog">
            <div class="dialog">
                <div class="titleWrapper">
                    <span class="title">{{dialogType === 0?'查看防伪码':'审核'}}</span>
                    <span class="closeIcon" @click="closeDialog">X</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import searchOptions from "@/components/SearchOptions";
import Uploader from "@/components/Uploader/index.vue";
import Pagination from "@/components/Pagination/index.vue"; //分页
import tab from "@/components/tab/index.vue";

var seriesSearch = require("./config/seriesSearch.json");
var lessonSearch = require("./config/lessonSearch.json");

export default {
    name:"goodManage",
    components:{
        searchOptions,
        Uploader,
        Pagination,
        tab
    },
    data(){
        return{
            pageType:"",
            tabList:[
                {
                    label:"全部",
                    value:0
                },
                {
                    label:"上架",
                    value:1,
                },
                {
                    label:"下架",
                    value:2,
                },
            ],
            proofList:[],
            examForm:{
                state:"",
                reason:"",
            },
            PageModel:{
                PageIndex: 1,
                PageSize: 10,
                PageCount: 0
            },
            search:[],

            // 表单验证规则
            rules: {
                state: [
                    { required: true, message: "请选择审核结果", trigger: "change" }
                ],
                reason: [
                    { required: true, message: "请填写审核失败原因", trigger: "blur" }
                ],
            },

            dialogType:"",
            state:"",
            uploadDone:false,
            ifShowDialog:false 
        }
    },
    watch:{
        $route: function() {
            this.checkpageType(this.$route.params.type);
        }
    },
    methods:{
        // 校验router中的type值，判断当前页面类型
        checkpageType(type){
            console.log(type);
            // 判断当前页面类型
            if(!type)
            {
                this.pageType = "lesson";
            }
            else
            {
                switch(type) {
                    case "Picture":
                        this.pageType = 'lesson';
                        break;
                    
                    case "Video":
                        this.pageType = "lesson";
                        break;

                    case "Audio":
                        this.pageType = "lesson";
                        break;

                    case "Series":
                        this.pageType = "series";
                        break;
                }
            }

            // 根据当前页面类型，切换查询条件
            if(this.pageType === 'lesson')
            {
                this.search = lessonSearch;
            }
            else
            {
                this.search = seriesSearch;
            }   
        },

        // tab栏切换
        selectChange(item){
            this.state = item.value;
            this.confirmSearch();
        },

        // 查看目录
        checkCatalogue(row){
            console.log(row);
        },
        // 编辑列表项
        edit(row){
            console.log(row);
        },
        // 更新列表项状态
        updateStatus(row){
            console.log(row);
        },
        // 删除列表项
        Delete(row){
            console.log(row);
        },
        // 展示前端链接
        showLink(row){
            this.ifShowDialog = true;
            console.log(row);
        },

        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time' && this.search[i].value.start)
                {
                    sendObj.StartTime = this.search[i].value.start
                }
                else if(this.search[i].key === 'time' && this.search[i].value.end)
                {
                    sendObj.EndTime = this.search[i].value.end;
                }
                else
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            sendObj = Object.assign(sendObj,{
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                },
            });
            if(this.pageType === 'lesson')
            {
                sendObj = Object.assign(sendObj,{
                    FeatureType:0,
                });
            }
            else if(this.pageType === 'series')
            {
                sendObj = Object.assign(sendObj,{
                    FeatureType:1,
                });
            }
            console.log(sendObj,'11111111111111111111');
            this.$http.PcActivity
            .GetPagedListActivityAuditListCtl(sendObj)
            .then((res)=>{
                this.proofList = res.ListData;
                this.PageModel.PageCount = res.Paged.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },


        closeDialog(){
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
        this.checkpageType(this.$route.params.type);
        console.log(this.pageType,'页面类型');
        console.log(this.search,'查询条件');
        this.confirmSearch();
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.wrapper
{
    padding: 20px;
    .proofTable
    {
        .asistantImg
        {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
        .action
        {
            color: #409EFF;
        }
        .examBtn
        {
            border: 1px solid #1E87FE;
            color: #1E87FE;
            width: 80px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
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