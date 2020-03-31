<template>
    <div class="wrapper">
        <!-- 搜索区域 -->
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <div class="title">
            <span>业务员列表</span>
            <el-button @click="createQRCode" class="addBtn">生成邀请码</el-button>
        </div>

        <el-table :data="tableData" style="margin-top:20px;" class="table">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="真实姓名" prop="TrueName"></el-table-column>
            <el-table-column label="性别" prop="Gender">
                <template slot-scope="scope">
                    {{scope.row.Gender===0?'未知':scope.row.Gender===1?'男':'女'}}
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="Phone"></el-table-column>
            <el-table-column label="微信昵称">
                <template slot-scope="scope">
                    <div class="flex align-center flex-center">
                        <img :src="scope.row.HeadimgUrl" class="wxHeadImg"/>
                        <span>{{scope.row.NickName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="注册时间" prop="CreateTime"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <span class="action" @click="edit(scope.row)">编辑</span>
                    <span class="action" @click="authorityManage(scope.row)">权限设置</span>
                    <span class="action" @click="createLink(scope.row)">生成链接</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination
            :total="PageModel.PageCount"
            :currentPage="PageModel.PageIndex"
            :page-size="PageModel.PageSize"
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></Pagination>

        <!-- 新生成邀请码接口 -->
        <div class="mengceng" v-if="ifShowDialog">
            <div class="dialog">
                <div class="titleWrapper">
                    <span class="title">生成邀请码</span>
                    <span class="closeIcon" @click="closeDialog">X</span>
                </div>
                <el-steps :active="active" align-center>
                    <el-step title="录入基本信息"></el-step>
                    <el-step title="权限配置"></el-step>
                    <el-step title="生成邀请码"></el-step>
                </el-steps>
                <div v-show="active === 1">
                    <el-form :model="baseInfo" label-width="120px" :inline="true" :rules="baseInfoRules" ref="baseInfo">
                        <el-form-item label="真实姓名" prop="TrueName">
                            <el-input v-model="baseInfo.TrueName"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="Phone">
                            <el-input v-model="baseInfo.Phone"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="btnGroup">
                        <el-button @click="nextStep(2)">下一步</el-button>
                    </div>
                </div>
                <div v-show="active === 2">
                   <div class="contentWrapper flex">
                        <span class="label">管辖系统</span>
                        <div style="flex:1">
                            <textarea v-model="computedSystemList" style="width:80%" disabled></textarea>
                            </br>
                            <span class="action" @click="addSystem">+ 添加系统</span>
                        </div>
                    </div>
                    <div class="contentWrapper flex">
                        <span class="label">管辖区域</span>
                        <div style="flex:1">
                            <textarea v-model="userAreaList" style="width:80%" disabled></textarea>
                            </br>
                            <span class="action" @click="addArea">+ 添加区域</span>
                        </div>
                    </div>
                    <div class="btnGroup">
                        <el-button @click="nextStep(3)" type="primary">生成邀请码</el-button>
                    </div>
                </div>
                <div v-show="active === 3" style="text-align:center;">
                    <img :src="QRCode" class="QRCode"/>
                    <div class="btnGroup">
                        <el-button @click="downLoadQRcode" type="primary">下载小程序码</el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 编辑——基本信息窗口 -->
        <div class="mengceng" v-if="showEditInfoDialog">
            <div class="dialog">
                <div class="titleWrapper">
                    <span class="title">编辑</span>
                    <span class="closeIcon" @click="closeEditInfo">X</span>
                </div>
                <el-form :model="baseInfo" label-width="120px" :inline="true" :rules="baseInfoRules" ref="baseInfo">
                    <el-form-item label="真实姓名" prop="TrueName">
                        <el-input v-model="baseInfo.TrueName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="Phone">
                        <el-input v-model="baseInfo.Phone"></el-input>
                    </el-form-item>
                </el-form>
                <div class="editBtnGroup">
                    <el-button @click="cancel('editInfo')">取消</el-button>
                    <el-button @click="save('editInfo')" type="primary">保存</el-button>
                </div>
            </div>
        </div>

        <!-- 编辑——权限设置窗口 -->
        <div class="mengceng" v-if="showEditAuthDialog">
            <div class="dialog">
                <div class="titleWrapper">
                    <span>权限设置</span>
                    <span class="closeIcon" @click="closeEditAuth">X</span>
                </div>
                <div class="contentWrapper flex">
                    <span class="label">管辖系统</span>
                    <div style="flex:1">
                        <textarea v-model="computedSystemList" style="width:80%" disabled></textarea>
                        </br>
                        <span class="action" @click="addSystem">+ 添加系统</span>
                    </div>
                </div>
                <div class="contentWrapper flex">
                    <span class="label">管辖区域</span>
                    <div style="flex:1">
                        <textarea v-model="userAreaList" style="width:80%" disabled></textarea>
                        </br>
                        <span class="action" @click="addArea">+ 添加区域</span>
                    </div>
                </div>
                <div class="editBtnGroup">
                    <el-button @click="cancel('editAuth')">取消</el-button>
                    <el-button @click="save('editAuth')" type="primary">保存</el-button>
                </div>
            </div>
        </div>

        <!-- 选择管辖系统弹窗 -->
        <div class="mengceng" v-if="ifShowSystemDialog">
            <div class="dialog" style="padding-bottom:0;">
                <div class="titleWrapper">
                    <span class="title">添加系统</span>
                    <span class="closeIcon" @click="closeSystemDialog">X</span>
                </div>
                <div class="searchArea flex">
                    <el-input v-model="BrandSystemName" clearable></el-input>
                    <el-button @click="searchSystem" type="primary" style="margin-left:10px;">搜索</el-button>
                </div>
                <div class="systemItemWrapper">
                    <div class="systemItem" v-for="(item,index) in showBrandSystemList" :key="index" @click="changeChosen(index)">
                        <img v-if="item.ifChosen" src="@/assets/images/chosen.png" class="chooseImg"/>
                        <img v-else src="@/assets/images/notChosen.png" class="chooseImg"/>
                        <span>{{item.BrandSystemName}}</span>
                    </div>
                </div>
                <div class="dialogBottom flex space-between">
                    <div class="flex align-center" style="cursor:pointer;height:60px;" @click="chooseAll">
                        <img v-if="ifChosenAll" src="@/assets/images/chosen.png" class="chooseImg"/>
                        <img v-else src="@/assets/images/notChosen.png" class="chooseImg"/>
                        <span>全选</span>
                    </div>
                    <div class="flex align-center">
                        <span style="margin-right:20px;">已选:{{chosenNum}}</span>
                        <el-button @click="confirmChoose" type="primary">确定</el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 选择区域弹窗 -->
        <div class="mengceng" v-if="ifShowAreaDialog">
            <div class="dialog" style="width:800px;">
                <div class="titleWrapper">
                    <span class="title">选择区域</span>
                    <span class="closeIcon" @click="closeAreaDialog">X</span>
                </div>
                <div class="areaWrapper">
                    <el-form :model="areaForm" class="dialog-form">
                        <el-form-item class="dialog-form__regions">
                            <!-- 东北地区 -->
                            <div class="dialog-form__regions__region">
                                <el-checkbox-group v-model="areaForm.regions" @change="setNorthEast">
                                    <el-checkbox label="东北" name="regions"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <!-- 省市 -->
                            <div class="dialog-form__regions__city">
                                <el-tree
                                :default-checked-keys="CheckedNorthEast"
                                :data="NorthEast"
                                show-checkbox
                                node-key="nodeName"
                                ref="treeNorthEast"
                                highlight-current
                                :props="defaultProps">
                                </el-tree>
                            </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 华北地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions"  @change="setNorthChina">
                            <el-checkbox label="华北" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedNorthChina"
                            :data="NorthChina"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeNorthChina"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 华中地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setCentralChina">
                            <el-checkbox label="华中" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedCentralChina"
                            :data="CentralChina"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeCentralChina"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 西北地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setNorthWest">
                            <el-checkbox label="西北" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedNorthWest"
                            :data="NorthWest"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeNorthWest"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 华东地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setEasternChina">
                            <el-checkbox label="华东" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedEasternChina"
                            :data="EasternChina"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeEasternChina"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 华南地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setSouthChina">
                            <el-checkbox label="华南" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedSouthChina"
                            :data="SouthChina"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeSouthChina"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 山东地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setShandong">
                            <el-checkbox label="山东" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedShandong"
                            :data="Shandong"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeShandong"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                        <el-form-item class="dialog-form__regions">
                        <!-- 西南地区 -->
                        <div class="dialog-form__regions__region">
                            <el-checkbox-group v-model="areaForm.regions" @change="setSouthWest">
                            <el-checkbox label="西南" name="regions"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 省市 -->
                        <div class="dialog-form__regions__city">
                            <el-tree
                            :default-checked-keys="CheckedSouthWest"
                            :data="SouthWest"
                            show-checkbox
                            node-key="nodeName"
                            ref="treeSouthWest"
                            highlight-current
                            :props="defaultProps">
                            </el-tree>
                        </div>
                        </el-form-item>
                    </el-form> 
                </div>
                <div class="editBtnGroup">
                    <el-button @click="closeAreaDialog">取消</el-button>
                    <el-button @click="saveArea" type="primary">保存</el-button>
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
import areaMixins from "./mixin/area";

var search = require("./config/search.json");

export default {
    name:"goodManage",
    components:{
        searchOptions,
        Uploader,
        Pagination,
        tab
    },
    data(){

        var validPhone = (rule,value,callback) => {
            let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!value) {
                return callback(new Error("手机号不能为空"));
            }
            else if(!phoneReg.test(value))
            {
                return callback(new Error('请输入符合规范的手机号码'));
            }
            else
            {
                return callback();
            }
        };

        return{
            active:1,
            tableData:[],
            PageModel:{
                PageIndex: 1,
                PageSize: 10,
                PageCount: 0
            },
            pageSizes:[10,20,50],
            search:search,
            state:"", // 当前弹窗状态
            newUID:"", // 新创建业务员UID

            baseInfo:{
                TrueName:"",
                Phone:"",
            },
            // 表单验证规则
            baseInfoRules: {
                TrueName: [
                    { required: true, message: "请输入业务员真实姓名", trigger: "blur" }
                ],
                Phone: [
                    { validator: validPhone,required:true,message:"请输入符合规范的手机号", trigger: ["blur"] }
                ],
            },

            allBrandSystemList:[], // 所有系统列表
            showBrandSystemList:[], // 查询返回系统列表
            userSystemList:[], // 用户已选择的系统列表

            userAreaList:[], // 用户已选择的区域列表
            allAreaList:[], // 所有区域数据

            QRCode:"", // 邀请码BASE64

            ifShowDialog:false, 
            ifShowSystemDialog:false,
            ifShowAreaDialog:false,
            showEditInfoDialog:false,
            showEditAuthDialog:false,
            BrandSystemName:"", //搜索系统名
            ifChosenAll:true, // 是否全选管辖系统
            chosenNum:0, //管辖系统选中数量

            currentUser:{},

            // 地区选择弹窗相关数据
            areaForm:{
                regions: [], // 所属区域
                index: '' // 索引、列
            },
            // tree树形图默认查找值
            defaultProps: {
                children: 'getListCityOutDto',
                label: 'nodeName'
            },
        }
    },
    computed: {
        computedSystemList(){
            // 这里应该是用户的系统列表
            if(this.userSystemList.length)
            {
                let result = "";
                for(let i = 0;i<this.userSystemList.length;i++)
                {
                    if(i === 0)
                    {
                        result += this.userSystemList[i].BrandSystemName;
                    }
                    else
                    {
                        result += "," + this.userSystemList[i].BrandSystemName;
                    }
                }
                return result;
            }
            else
            {
                return "";
            }
        },
    },
    mixins:[areaMixins],
    methods:{
        // 生成邀请码弹窗
        createQRCode(){
            this.newUID = "";
            this.state = "create";
            this.currentUser = {};
            this.baseInfo = {
                TrueName:"",
                Phone:"",
            };
            this.userAreaList = "";
            this.userSystemList = [];
            this.ifShowDialog = true;
        },
        // 下一步操作
        nextStep(val){
            // 校验业务员基础信息
            if(val === 2)
            {
                this.$refs['baseInfo'].validate((valid)=>{
                    console.log(valid);
                    // 通过数据校验
                    if(valid)
                    {
                        this.active = val;
                        let sendObj = {
                            UsersIndex:0,
                            HLUsersCreate:{
                                TrueName:this.baseInfo.TrueName,
                                Phone:this.baseInfo.Phone
                            },
                        };
                        if(this.state === 'edit')
                        {
                            sendObj.HLUsersCreate.UDID = this.currentUser.UDID;
                        }
                        this.$http.HLUser
                        .CreateBusinessUserAsyncCtl(sendObj)
                        .then((res)=>{
                            console.log(res);
                            this.newUID = res.UDID;
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    }
                    else
                    {
                        return false;
                    }
                });
            }
            // 校验业务员权限信息
            else if(val === 3)
            {
                let BrandSystemId = [];
                for(let i = 0;i<this.userSystemList.length;i++)
                {
                    BrandSystemId.push(this.userSystemList[i].BrandSystemId);
                }
                if(!BrandSystemId.length)
                {
                    this.$message({
                        message:"请选择管辖系统",
                        type:"warning"
                    });
                    return
                }
                else if(!this.sendIDList.length && this.state === 'create')
                {
                    this.$message({
                        message:"请选择管辖区域",
                        type:"warning"
                    });
                    return
                }
                if(!this.sendIDList.length)
                {
                    this.sendIDList = null;
                }
                let sendObj = {
                    UsersIndex:2,
                    HLUsersCreate:{
                        TrueName:this.baseInfo.TrueName,
                        Phone:this.baseInfo.Phone
                    },
                    HLUsersCreate1:{
                        BrandSystemId,
                        AreaId:this.sendIDList,
                    },
                    HLUsersCreate2:{
                        AppId:"wxe1c7b856b23c746d",
                        AppSecret:"9601b68ae3a007cb44a87ff007798df4",
                        width:"280px",
                        page:"",
                    },
                };
                if(this.state === "create")
                {
                    sendObj.HLUsersCreate1.UDID = this.newUID;
                    sendObj.HLUsersCreate2.UDID = this.newUID;
                }
                else if(this.state === "edit")
                {
                    sendObj.HLUsersCreate.UDID = this.currentUser.UDID;
                    sendObj.HLUsersCreate1.UDID = this.currentUser.UDID;
                    sendObj.HLUsersCreate2.UDID = this.currentUser.UDID;
                }
                this.$http.HLUser
                .CreateBusinessUserAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                    this.active = 3;
                    this.QRCode = "data:image/jpeg;base64," + res.QrBase64String;
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        },
        // 根据系统名称搜索
        searchSystem(){
            this.chosenNum = 0;
            let sendObj = {
                BrandSystemName:this.BrandSystemName,
            };
            this.$http.PcBrandSystem
            .GetListBrandSystemAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.showBrandSystemList = res;
                for(let i = 0;i<this.showBrandSystemList.length;i++)
                {
                    for(let x = 0;x<this.userSystemList.length;x++)
                    {
                        if(this.showBrandSystemList[i].BrandSystemId === this.userSystemList[x].BrandSystemId)
                        {
                            this.showBrandSystemList[i].ifChosen = true;
                            this.chosenNum++;
                        }
                    }
                }
                this.showBrandSystemList.forEach((item)=>{
                    if(!item.ifChosen)
                    {
                        this.ifChosenAll = false;
                    }
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 获取所有系统名称
        getAllBrandList(){
            let sendObj = {
                BrandSystemName:"",
            };
            this.$http.PcBrandSystem
            .GetListBrandSystemAsyncCtl(sendObj)
            .then((res)=>{
                this.allBrandSystemList = JSON.parse(JSON.stringify(res));
                this.showBrandSystemList = JSON.parse(JSON.stringify(res));
                for(let i = 0;i<this.showBrandSystemList.length;i++)
                {
                    for(let x = 0;x<this.userSystemList.length;x++)
                    {
                        if(this.showBrandSystemList[i].BrandSystemId === this.userSystemList[x].BrandSystemId)
                        {
                            this.showBrandSystemList[i].ifChosen = true;
                            this.chosenNum++;
                        }
                    }
                }
                this.showBrandSystemList.forEach((item)=>{
                    if(!item.ifChosen)
                    {
                        this.ifChosenAll = false;
                    }
                });
                console.log(this.allBrandSystemList,"所有系统");
                console.log(this.showBrandSystemList,'当前显示系统');
                console.log(this.userSystemList,'当前用户选中系统');
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 添加管辖系统
        addSystem(){
            this.chosenNum = 0;
            this.getAllBrandList();
            this.ifShowSystemDialog = true;
        },
        // 改变门店选中状态
        changeChosen(index){
            this.$set(this.showBrandSystemList,index,{
                BrandSystemId : this.showBrandSystemList[index].BrandSystemId,
                BrandSystemName: this.showBrandSystemList[index].BrandSystemName,
                ifChosen: !this.showBrandSystemList[index].ifChosen
            });
            if(this.showBrandSystemList[index].ifChosen)
            {
                this.chosenNum++;
                let ifChosenAll = true;
                this.showBrandSystemList.forEach((item)=>{
                    if(!item.ifChosen)
                    {
                        ifChosenAll = false;
                    }
                });
                this.ifChosenAll = ifChosenAll;
            }
            else
            {
                this.chosenNum--;
                this.ifChosenAll = false;
            }
            console.log(this.showBrandSystemList);
        },
        // 全选事件
        chooseAll(){
            this.ifChosenAll = !this.ifChosenAll;
            // 当前为全选中状态
            if(this.ifChosenAll)
            {
                this.chosenNum = this.showBrandSystemList.length;
                for(let i = 0;i<this.showBrandSystemList.length;i++)
                {
                    this.showBrandSystemList[i].ifChosen = true;
                }
            }
            // 当前为非全选中状态
            else
            {
                this.chosenNum = 0;
                for(let i = 0;i<this.showBrandSystemList.length;i++)
                {
                    this.showBrandSystemList[i].ifChosen = false;
                }
            }
        },
        // 更改管辖系统列表
        confirmChoose(){
            this.BrandSystemName = "";
            this.ifShowSystemDialog = false;

            for(let i = 0;i<this.allBrandSystemList.length;i++)
            {
                for(let x = 0;x<this.userSystemList.length;x++)
                {
                    if(this.allBrandSystemList[i].BrandSystemId === this.userSystemList[x].BrandSystemId)
                    {
                        this.allBrandSystemList[i].ifChosen = true;
                    }
                }
            }

            for(let i = 0;i<this.allBrandSystemList.length;i++)
            {
                for(let x = 0;x<this.showBrandSystemList.length;x++)
                {
                    if(this.allBrandSystemList[i].BrandSystemId === this.showBrandSystemList[x].BrandSystemId)
                    {
                        if(this.showBrandSystemList[x].ifChosen)
                        {
                            this.allBrandSystemList[i].ifChosen = true;
                        }
                        else
                        {
                            this.allBrandSystemList[i].ifChosen = false;
                        }
                    }
                }
            }
            this.userSystemList = [];
            for(let i = 0;i<this.allBrandSystemList.length;i++)
            {
                if(this.allBrandSystemList[i].ifChosen)
                {
                    this.userSystemList.push(this.allBrandSystemList[i]);
                }
            }
            console.log(this.userSystemList,'用户当前选中列表');

            let BrandSystemId = [];
            for(let i = 0;i<this.userSystemList.length;i++)
            {
                BrandSystemId.push(this.userSystemList[i].BrandSystemId);
            }
            if(!BrandSystemId.length)
            {
                this.$message({
                    message:"请选择管辖系统",
                    type:"warning"
                });
                return
            }
            if(this.state === "create")
            {
                let sendObj = {
                    UsersIndex:1,
                    HLUsersCreate:{
                        TrueName:this.baseInfo.TrueName,
                        Phone:this.baseInfo.Phone
                    },
                    HLUsersCreate1:{
                        UDID:this.newUID,
                        BrandSystemId,
                        AreaId:this.sendIDList,
                    },
                    HLUsersCreate2:{
                        UDID:this.newUID,
                        AppId:"wxe1c7b856b23c746d",
                        AppSecret:"9601b68ae3a007cb44a87ff007798df4",
                        width:"280px",
                        page:"",
                    },
                };
                this.$http.HLUser
                .CreateBusinessUserAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
            else if(this.state === "edit")
            {
                if(!this.sendIDList.length)
                {
                    this.sendIDList = null;
                }
                let sendObj = {
                    UDID:this.currentUser.UDID,
                    BrandSystemId,
                    AreaId:this.sendIDList,
                };
                this.$http.HLUser
                .SetBusinessUserPowerAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        },
        // 删除系统权限
        deleteTag(index){
            this.tagList.splice(index,1);
        },

        // 下载二维码图片
        downLoadQRcode() {
            this.downloadFile('QRcode.jpg', this.QRCode);
        },
        // 下载
        downloadFile(fileName, content) {
            let aLink = document.createElement('a');
            let blob = this.base64ToBlob(content);
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('click', true, true);// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.click();
            // aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));// 兼容火狐
        },
        // base64转blob
        base64ToBlob() {
            let parts = this.QRCode.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for(let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {type: contentType});
        },

        // 编辑列表项
        edit(row){
            console.log(row);
            this.baseInfo = {
                TrueName:row.TrueName,
                Phone:row.Phone
            };
            this.currentUser = JSON.parse(JSON.stringify(row));
            this.showEditInfoDialog = true;
        },
        // 设置权限
        authorityManage(row){
            this.state = "edit";
            console.log(row);
            this.currentUser = JSON.parse(JSON.stringify(row));
            let sendObj = {
                udid:row.UDID,
            };
            this.$http.HLUser
            .GetListAreaAndBrandSystemAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.userSystemList = res.getBrandSystemOutDto;
                this.userAreaList = res.Name;
            })
            .catch((err)=>{
                console.log(err);
            });
            this.showEditAuthDialog = true;
        },
        // 生成链接
        createLink(row){
            this.state = "edit";
            this.currentUser = JSON.parse(JSON.stringify(row));
            this.active = 1;
            this.ifShowDialog = true;
            let sendObj = {
                udid:row.UDID
            };
            this.$http.HLUser
            .GetInvitationCodeAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.baseInfo.TrueName = res.getBusinessUserOutDto.TrueName;
                this.baseInfo.Phone = res.getBusinessUserOutDto.Phone;
                this.userAreaList = res.getAreaBrandSystemOutDto.Name;
                this.userSystemList = JSON.parse(JSON.stringify(res.getAreaBrandSystemOutDto.getBrandSystemOutDto));
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 取消编辑弹窗
        cancel(val){
            if(val === "editInfo")
            {
                this.showEditInfoDialog = false;
            }
            else if(val === "editAuth")
            {
                this.showEditAuthDialog = false;
                this.sendIDList = [];
            }
            else if(val === "chooseArea")
            {
                this.ifShowAreaDialog = false;
            }
        },
        // 保存编辑
        save(val){
            // 编辑个人信息
            if(val === "editInfo")
            {
                this.$refs['baseInfo'].validate((valid)=>{
                    console.log(valid);
                    // 通过数据校验
                    if(valid)
                    {
                        this.showEditInfoDialog = false;
                        let sendObj = {
                            UDID:this.currentUser.UDID,
                            TrueName:this.baseInfo.TrueName,
                            Phone:this.baseInfo.Phone,
                        };
                        this.$http.HLUser
                        .UpdateBusinessUserAsyncCtl(sendObj)
                        .then((res)=>{
                            console.log(res);
                            this.$message({
                                type:"success",
                                message:"更新成功"
                            });
                            this.confirmSearch();
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    }
                    else
                    {
                        return false;
                    }
                });
            }

            // 编辑权限设置
            else if(val === "editAuth")
            {
                let BrandSystemId = [];
                for(let i = 0;i<this.userSystemList.length;i++)
                {
                    BrandSystemId.push(this.userSystemList[i].BrandSystemId);
                }
                if(!BrandSystemId.length)
                {
                    this.$message({
                        type:"warning",
                        message:"请添加管辖系统"
                    });
                    return
                }
                let sendObj = {};
                sendObj.BrandSystemId = BrandSystemId;
                sendObj.UDID = this.currentUser.UDID;
                console.log(this.sendIDList);
                if(this.sendIDList && this.sendIDList.length)
                {
                    sendObj.AreaId = this.sendIDList;
                }
                else if(!this.sendIDList.length)
                {
                    sendObj.AreaId = null;
                }
                this.$http.HLUser
                .SetBusinessUserPowerAsyncCtl(sendObj)
                .then(()=>{
                    this.$message({
                        message:"更新成功",
                        type:"success"
                    });
                    this.sendIDList = [];
                    this.confirmSearch();
                })
                .catch((err)=>{
                    console.log(err);
                });
                this.showEditAuthDialog = false;
            }
        },

        // 查询业务员列表
        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time' && this.search[i].value.start)
                {
                    sendObj.RegisterStartTime = this.search[i].value.start
                }
                if(this.search[i].key === 'time' && this.search[i].value.end)
                {
                    sendObj.RegisterEndTime = this.search[i].value.end;
                }
                if(this.search[i].key !== 'time')
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            sendObj = Object.assign(sendObj,{
                PageIndex:this.PageModel.PageIndex,
                PageSize:this.PageModel.PageSize,
                PageCount:""
            });
            console.log(sendObj,'11111111111111111111');
            this.$http.HLUser
            .GetPageListBusinessUserAsyncCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.tableData = res.Item;
                this.PageModel.PageCount = res.PageModel.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },


        // 关闭弹窗
        closeDialog(){
            this.ifShowDialog = false;
            this.active = 1;
        },
        // 关闭系统选择弹窗
        closeSystemDialog(){
            this.ifShowSystemDialog = false;
        },
        // 关闭地区选择器弹窗
        closeAreaDialog(){
            this.ifShowAreaDialog = false;
        },
        // 关闭编辑基本信息弹窗
        closeEditInfo(){
            this.showEditInfoDialog = false;
        },
        // 关闭
        closeEditAuth(){
            this.showEditAuthDialog = false;
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
        this.confirmSearch();
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
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .table
    {
        .wxHeadImg
        {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right:5px;
        }
        .action
        {
            cursor:pointer;
            color: #409EFF;
            margin-right: 10px;
            &:last-of-type
            {
                margin-right:0;
            }
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
            overflow-y: auto;
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
            .areaWrapper
            {
                height: 600px;
                overflow: auto;
                margin-bottom: 20px;
                .el-tree-node
                {
                    margin-right:35px;
                }
                .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label
                {
                    display: flex;
                }
                .dialog-form .dialog-form__regions .el-form-item__content {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                }

                .dialog-form__regions__region {
                display: flex;
                width: 20%;
                }

                .dialog-form__regions__city {
                display: inline-block;
                width: 80%;
                }

                .dialog-form__regions__city-item {
                display: inline-block;
                width: 1rem;
                float: left;
                margin-left: .5rem;
                }

                .dialog-form .dialog-form_cities {
                width: 85%;
                float: left;
                margin-left: 5%;
                }

                .dialog-form_cities .el-checkbox {
                margin-right: .3rem;
                }

                /* 覆盖element-ui 树状图样式 */
                .el-tree {
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    cursor: default;
                    background: #fff;
                    color: #606266;
                }
                .el-tree-node__content {
                    min-width: 1.5rem;
                }
            }
            .systemItemWrapper
            {
                height:310px;
                overflow-y:auto;
                .systemItem
                {
                    border-bottom:1px solid #eeeeee;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    height:60px;
                }
            }
            .chooseImg
            {
                width:20px;
                height:20px;
                margin-right:20px;
            }
            .contentWrapper
            {
                margin:20px 0;
                .label
                {
                    width:100px;
                    flex-shrink:0;
                    position:relative;
                    &::before
                    {
                        content:"*";
                        position:absolute;
                        top:-3px;
                        left:-10px;
                        color:red;
                    }
                }
                .tagWrapper
                {
                    margin-left:100px;
                    margin-right:50px;
                    color:#666666;
                    .tagItem
                    {
                        cursor:pointer;
                        margin:5px 10px 5px 0;
                        display:inline-block;
                        font-size:12px;
                        background:#F2F2F2;
                        padding:2px 6px;
                        height:20px;
                        line-height:20px;
                        .deleteIcon
                        {
                            margin-left:6px;
                        }
                    }
                }
                textarea
                {
                    font-size:12px;
                    resize:none;
                    border-radius:2px;
                    padding:9px;
                }
                textarea:disabled{
                    -webkit-text-fill-color: #333;//是用来做填充色使用的
                    -webkit-opacity: 1;
                    color: #333;
                    background:#fff;
                }
                .action
                {
                    display:inline-block;
                    cursor:pointer;
                    color:#409EFF;
                    font-size:12px;
                }
            }
            .QRCode
            {
                margin:20px 0;
                width: 130px;
                height: 130px;
            }
            .editBtnGroup
            {
                float:right;
            }
            .btnGroup
            {
                text-align:center;
            }
        }
    }
}

/deep/ .el-step__head.is-finish
{
    color:#29AF39;
    border:#29AF39;
}
/deep/ .el-step__title.is-finish
{
    color:#29AF39;
}
/deep/ .is-finish .el-step__icon
{
    color:#fff;
    background:#29AF39;
}
</style>