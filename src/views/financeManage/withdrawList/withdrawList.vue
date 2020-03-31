<template>
    <div class="wrapper">
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <div class="contentArea">
            <div class="flex space-between align-center" style="margin-bottom:20px;">
                <tab :tabList="tabList" @selectChange="selectChange"></tab>
                <div class="btnGroup">
                    <el-button @click="multiPass">批量审核通过</el-button>
                    <el-button @click="multiReject">批量审核失败</el-button>
                </div>
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></Pagination>
        </div>
    </div>
</template>
<script>

import search from "./config/search.json";

export default {
    name:"withdrawList",
    data(){
        return{
            tableData:[],
            search:search,
        }
    },
    methods:{
        multiReject(){
            
        },
        multiPass(){

        },
    },
}
</script>
<style lang="scss" scoped>
.wrapper
{
    
}
</style>