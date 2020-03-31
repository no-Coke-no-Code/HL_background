<template>
    <div class="wrapper">
        <el-form :model="form" :rules="rules" label-width="120px" ref="form">
            <div class="title">新建活动</div>
            <el-form-item label="活动状态" prop="Status">
                <el-radio-group v-model="form.Status">
                    <el-radio label="0">
                        上架
                    </el-radio>
                    <el-radio label="1">
                        下架
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item 
            label="活动类型"
            prop="ActivityType"
            >
                <el-radio-group v-model="form.ActivityType">
                    <el-radio label="0">
                        其它
                    </el-radio>
                    <el-radio label="1">
                        按单品结算
                    </el-radio>
                    <el-radio label="2">
                        按订单结算
                    </el-radio>
                    <el-radio label="3">
                        按订单+单品结算
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item 
            label="活动名称"
            prop="Title"
            >
                <el-input
                style="width:300px"
                v-model="form.Title"
                placeholder="请输入活动名称"
                >
                </el-input>
            </el-form-item>

            <el-form-item label="活动时间">
                <el-col :span="5">
                    <el-form-item prop="StartTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.StartTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1">至</el-col>
                <el-col :span="5">
                    <el-form-item prop="EndTime">
                        <el-date-picker placeholder="选择时间" v-model="form.EndTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>


            <el-form-item label="订单奖励" prop="OrderAwardList">
                <div class="bonusItem" v-for="(item,index) in OrderAwardList" :key="index">
                    满
                    <el-input v-model="item.MoreThan" style="width:100px;margin:0 10px;"></el-input>
                    奖
                    <el-input v-model="item.RewardMoney" style="width:100px;margin:0 10px;"></el-input>

                    <span @click="deleteBonus(index)" class="deleteIcon">删除</span>
                </div>
                <div @click="addBonus" class="addBonusBtn">+ 添加</div>
            </el-form-item>

            <el-form-item label="活动详情">
                <!-- 富文本上传组件 -->
                <Uploader
                    ref="detailUploader"
                    class="avatar-uploader"
                    style="display:none"
                    path="richText/"
                    @uploadFile="getRichTextFile"
                />
                <!-- 富文本组件 -->
                <QuillEditor></QuillEditor>
            </el-form-item>

            <el-form-item label="基础点赞数" prop="SetPraiseCount">
                <el-input v-model="form.SetPraiseCount" style="width:300px;"></el-input>
            </el-form-item>

        <div class="title" style="margin-top:40px;">单品奖励设置</div>
        <div class="contentWrapper">
            <div class="flex aling-center space-between" style="margin-bottom:20px;">
                <span>已添加产品：{{ProductAwardList.length}}</span>
                <el-button type="primary" class="width-button" @click="showGoodDialog">添加商品</el-button>
            </div>
            <el-table :data="ProductAwardList">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="CommodityName" label="产品名称"></el-table-column>
                <el-table-column prop="CommodityCode" label="产品货号"></el-table-column>
                <el-table-column prop="RewardMoney" label="奖励金额">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="ProductAwardList[scope.$index].RewardMoney"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span @click="deleteChosenGood(scope)" class="actionBtn">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="title">门店设置</div>
        <div class="contentWrapper">
            <div class="flex align-center space-between" style="margin-bottom:20px;">
                <div>
                    <el-form-item label="门店类型" prop="shopType">
                        <el-radio-group v-model="form.shopType">
                            <el-radio label="1">
                                上架
                            </el-radio>
                            <el-radio label="2">
                                下架
                            </el-radio>
                        </el-radio-group>
                        <span class="notice">(说明：若选择了门店类型为适用门店，则没选择的门店默认为不适用门店，反之亦然)</span>
                    </el-form-item>
                </div>
                <div>
                    <el-button @click="chooseShop">选择门店</el-button>
                </div>
            </div>
            <el-table :data="chosenShopList">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="门店名称" prop="ShopName"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span @click="deleteChosenShop(scope)" class="actionBtn">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="btnGroup flex align-center space-between">
            <el-button @click="cancel" class="cancelBtn flex flex-center align-center">取消</el-button>
            <el-button @click="save('form')" class="saveBtn flex flex-center align-center">保存</el-button>
        </div>

        <!-- 弹窗 -->
        <div class="mengceng" v-if="ifShowGoodDialog">
            <div class="dialog">
                <div class="dialogTitle flex space-between align-item">
                    <span>添加商品</span>
                    <div class="closeIcon" @click="closeDialog">X</div>
                </div>
                <textarea class="goodNoArea" :placeholder="placeholder" v-model="goodNoList" ></textarea>
                <div class="btnGroup">
                    <el-button class="cancel" @click="cancel">取消</el-button>
                    <el-button class="submit" @click="submit">提交</el-button>
                </div>
            </div>
        </div>
        <div class="mengceng" v-if="ifShowShopDialog">
            <div class="dialog">
                <div class="dialogTitle flex space-between align-item">
                    <span>选择门店</span>
                    <div class="closeIcon" @click="closeDialog">X</div>
                </div>
                <div class="actionArea">
                    <el-input v-model="goodKeyWord" placeholder="门店搜索" style="width:250px;margin-right:20px;"></el-input>
                    <el-button type="primary" @click="searchShop">搜索</el-button>
                </div>
                <div class="tab">
                    <div class="tabItem" :class="{'active':activeIndex === 0}" @click="changeTab(0)">按门店</div>
                    <div class="tabItem" :class="{'active':activeIndex === 1}" @click="changeTab(1)">按系统</div>
                    <div class="tabItem" :class="{'active':activeIndex === 2}" @click="changeTab(2)">按区域</div>
                </div>
                <div v-if="activeIndex === 0">
                    <div class="shopAddressList" v-for="(item,index) in shopList" :key="index">
                        <div class="content">
                            <p class="shopName">{{item.ShopName}}</p>
                            <p class="shopAddress">{{item.ShopAddr}}</p>
                        </div>
                        <div class="addBtn" @click="addShop(item)" v-if="!item.IsAdded">添加</div>
                        <div class="addBtn chosen" v-else>已添加</div>
                    </div>
                </div>
                <div v-if="activeIndex === 1 || activeIndex === 2">
                    <div class="shopAddressList" v-for="(item,index) in shopList" :key="index">
                        <div class="content">
                            <p class="shopName">{{item.ItemName}}</p>
                            <p class="shopAddress">门店：{{item.ShopCount}}</p>
                        </div>
                        <div class="addBtn" @click="addShop(item)" v-if="!item.IsAdded && item.ShopCount">添加</div>
                        <div class="addBtn chosen" v-if="item.IsAdded && item.ShopCount">已添加</div>
                    </div>
                </div>
                <Pagination
                    v-if="PageModel.PageCount"
                    @size-change="handleSizeChange"
                    :page-sizes="pageSizes"
                    :total="PageModel.PageCount"
                    :currentPage="PageModel.PageIndex"
                    @current-change="handleCurrentChange"
                ></Pagination>
            </div>
        </div>
        </el-form>
    </div>
</template>
<script>

import Uploader from "@/components/Uploader/MTDF_index.vue"; //上传组件
import QuillEditor from "@/components/QuillEditor/index.vue";
import Pagination from "@/components/Pagination/index.vue"; //分页
import axios from "axios";

export default {
    name:"addActivity",
    components:{
        Uploader,
        QuillEditor,
        Pagination
    },
    data(){
        return{
            pageSizes:[5,10,15],
            PageModel:{
                PageIndex: 1,
                PageSize: 5,
                PageCount: 0
            },
            ifAllLoaded:false,
            pageState:"add",
            editId:"",
            form:{
                Status:"",
                ActivityType:"",
                Title:"",
                StartTime:"",
                EndTime:"",
                Describe:"",
                acticityGoods:[],
                OrderAwardList:[],
                SetPraiseCount:"",
                shopType:"",
            },
            placeholder:'在此输入产品货号，例：A08,A09,A10(货号之间以中文逗号分割)',
            // 表单验证规则
            rules: {
                Status: [
                    { required: true, message: "请选择活动状态", trigger: "change" }
                ],
                ActivityType: [
                    { required: true, message: "请选择活动类型", trigger: "change" }
                ],
                Title: [
                    { required: true, message: "请填写活动名称", trigger: "blur" }
                ],
                StartTime: [
                    { required: true, message: "请选择活动开始时间", trigger: "change" }
                ],
                EndTime: [
                    { required: true, message: "请选择活动结束时间", trigger: "change" }
                ],
                // OrderAwardList:[
                //     { required: true, message: "请填写奖励信息" }
                // ],
            },

            goodKeyWord:"",
            goodNoList:"",
            ProductAwardList:[],

            OrderAwardList:[],

            activeIndex:1,
            shopList:[],
            chosenShopList:[],

            ifShowGoodDialog:false,
            ifShowShopDialog:false,
        }
    },
    created(){
        // 获取到活动ID，处于编辑活动状态
        if (this.$route.query.id) 
        {
            this.pageState = 'edit';
            this.editId = this.$route.query.id;
            this.getDetail(this.editId);
        }
    },
    methods:{
        // 更换每页数据数量
        handleSizeChange(val){
            this.PageModel.PageSize = val
            let ShopIds = [];
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                ShopIds.push(this.chosenShopList.ShopId);
            }
            let sendObj = {
                Search:this.goodKeyWord,
                ShopIds,
                QueryShopType:this.activeIndex,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                }
            };
            this.getShopList(sendObj);
        },
        // 查询门店，更换页操作
        handleCurrentChange(val){
            this.PageModel.PageIndex = val;
            let ShopIds = [];
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                ShopIds.push(this.chosenShopList.ShopId);
            }
            let sendObj = {
                Search:this.goodKeyWord,
                ShopIds,
                QueryShopType:this.activeIndex,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                }
            };
            this.getShopList(sendObj);
        },

        // 根据活动ID，获取活动详情
        getDetail(id){
            console.log(id,'活动id');
            let sendObj = {
                id
            };
            this.$http.PcActivity
            .EditActivityQueryCtl(sendObj)
            .then((res)=>{
                let activityInfo = res;
                let Status = activityInfo.Status.toString();
                let ActivityType = activityInfo.ActivityType.toString()

                this.form.Status = Status;
                this.form.ActivityType = ActivityType;
                this.form.Title = activityInfo.Title;
                this.form.StartTime = activityInfo.StartTime;
                this.form.EndTime = activityInfo.EndTime;
                this.form.Describe = activityInfo.Describe;
                this.form.SetPraiseCount = activityInfo.SetPraiseCount;
                this.ProductAwardList = activityInfo.ProductAwardList;
                this.OrderAwardList = activityInfo.OrderAwardList;
                this.chosenShopList = activityInfo.ShopIds.split(",");
                if(this.chosenShopList[0] === "")
                {
                    this.chosenShopList = [];
                }
                if(this.chosenShopList.length)
                {
                    // 初始化已选择门店列表
                    let sendObj = {
                        Search:"",
                        ShopIds:this.chosenShopList,
                        QueryShopType:0,
                        Paged:{
                            PageIndex:1,
                            PageSize:9999,
                            PageCount:""
                        }
                    };
                    this.$http.PcActivity
                    .ActivityQueryShopCtl(sendObj)
                    .then((res)=>{
                        for(let i = 0;i<this.chosenShopList.length;i++)
                        {
                            console.log(this.chosenShopList[i]);
                            for(let x = 0;x<res.ShopData.length;x++)
                            {
                                console.log(res.ShopData[x]);
                                if(this.chosenShopList[i] == res.ShopData[x].ShopId)
                                {
                                    let tempObj = {
                                        ShopName:res.ShopData[x].ShopName,
                                        ShopId:res.ShopData[x].ShopId,
                                    };
                                    this.$nextTick(()=>{
                                        this.$set(this.chosenShopList,i,tempObj);
                                    });
                                }
                            }
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                axios
                .get(this.form.Describe)
                .then(res => {
                    document.querySelector(".editor .ql-editor").innerHTML = res.data;
                })
                .catch(err => {
                    console.error(err);
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 添加订单奖励事件
        addBonus(){
            this.OrderAwardList.push(
                {
                    MoreThan:"",
                    RewardMoney:"",
                    ActivityOrderAwardId:0,
                },
            );
        },
        // 删除订单奖励事件
        deleteBonus(index){
            this.OrderAwardList.splice(index,1);
        },

        // 获取可添加门店列表
        getShopList(sendObj){
            this.shopList = [];
            this.$http.PcActivity
            .ActivityQueryShopCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.PageModel.PageCount = 0;
                if(res.Paged)
                {
                    this.PageModel.PageCount = res.Paged.PageCount;
                }
                if(this.activeIndex === 0)
                {
                    this.shopList = this.shopList.concat(res.ShopData);
                }
                else if(this.activeIndex === 1 || this.activeIndex === 2)
                {
                    this.shopList = this.shopList.concat(res.OtherData);
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 切换门店范围选择tab
        changeTab(val){
            this.PageModel.PageIndex = 1;
            let ShopIds = [];
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                if(typeof this.chosenShopList[i] === 'string')
                {
                    ShopIds.push(this.chosenShopList[i]);
                }
                else
                {
                    ShopIds.push(this.chosenShopList[i].ShopId);
                }
            }
            console.log(ShopIds,'当前选中门店列表');
            this.activeIndex = val;
            let sendObj = {
                Search:this.goodKeyWord,
                ShopIds,
                QueryShopType:this.activeIndex,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                }
            };
            this.getShopList(sendObj);
        },
        // 选择门店事件
        addShop(item){
            console.log(item);
            if(this.activeIndex === 0)
            {
                this.chosenShopList.push(item);
                item.IsAdded = true;
            }
            else if(this.activeIndex === 1 || this.activeIndex === 2)
            {
                item.IsAdded = true;
                for(let i = 0;i<item.ShopInfo.length;i++)
                {
                    this.chosenShopList.push(item.ShopInfo[i]);
                }
            }
        },

        // 选择商品弹窗
        showGoodDialog(){
            this.ifShowGoodDialog = true;
        },
        // 删除已添加商品
        deleteChosenGood(item){
            console.log(item);
            this.ProductAwardList.splice(item.index,1);
        },
        // 删除已添加门店
        deleteChosenShop(item){
            console.log(item);
            this.chosenShopList.splice(item.index,1);
        },
        // 搜索门店
        searchShop(){
            let ShopIds = [];
            this.PageModel.PageIndex = 1;
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                ShopIds.push(this.chosenShopList.ShopId);
            }
            let sendObj = {
                Search:this.goodKeyWord,
                ShopIds,
                QueryShopType:this.activeIndex,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                }
            };
            this.getShopList(sendObj);
        },

        // 选择门店弹窗
        chooseShop(){
            this.shopList = [];
            this.ifShowShopDialog = true;
            this.changeTab(0);
        },

        // 关闭所有弹窗
        closeDialog(){
            this.ifShowGoodDialog = false;
            this.ifShowShopDialog = false;
        },

        // 格式化时间
        formatTime(date){
            let time = new Date(date);
            let year = time.getFullYear();
            let month = time.getMonth()+1;
            let day = time.getDate();
            let result = year+"-"+month+"-"+day;
            return result;
        },

        // 新增活动事件
        addActivity(){
            let ShopIds = [];
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                ShopIds.push(this.chosenShopList[i].ShopId);
            }
            ShopIds = ShopIds.join(",");
            let ProductAwardList = [];
            for(let i = 0;i<this.ProductAwardList.length;i++)
            {
                let obj = {
                    CommodityId:this.ProductAwardList[i].Id,
                    ActivityAward:parseInt(this.ProductAwardList[i].RewardMoney),
                };
                ProductAwardList.push(obj);
            }
            let OrderAwardList = [];
            for(let i = 0;i<this.OrderAwardList.length;i++)
            {
                let obj = {
                    MoreThan:this.OrderAwardList[i].MoreThan,
                    RewardPrice:this.OrderAwardList[i].RewardMoney,
                };
                OrderAwardList.push(obj);
            }
            let StartTime = this.formatTime(this.form.StartTime);
            let EndTime = this.formatTime(this.form.EndTime);
            let sendObj = {
                Status:this.form.Status,
                ActivityType:this.form.ActivityType,
                Title:this.form.Title,
                StartTime:StartTime,
                EndTime:EndTime,
                Describe:this.form.Describe,
                ShopIds,
                CommodityList :ProductAwardList,
                AwardList :OrderAwardList,
                SetPraiseCount:this.form.SetPraiseCount,       
            };
            this.$http.PcActivity.InsertActivityCtl(sendObj)
            .then((res)=>{
                if(res)
                {
                    this.$message({
                        type:"success",
                        message:"创建活动成功"
                    });
                    this.$router.push({path:"activityList"});
                }
                else
                {
                    this.$message({
                        type:"warning",
                        message:"创建活动失败"
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 编辑活动事件
        editActivity(){
            let ShopIds = [];
            for(let i = 0;i<this.chosenShopList.length;i++)
            {
                ShopIds.push(this.chosenShopList[i].ShopId);
            }
            ShopIds = ShopIds.join(",");
            let ProductAwardList = [];
            for(let i = 0;i<this.ProductAwardList.length;i++)
            {
                let obj = {
                    ActivityAndCommodityId:this.ProductAwardList[i].ActivityAndCommodityId,
                    CommodityId:this.ProductAwardList[i].Id,
                    RewardMoney :this.ProductAwardList[i].RewardMoney,
                    CommodityCode :this.ProductAwardList[i].CommodityCode,
                    CommodityName: this.ProductAwardList[i].CommodityName,
                };
                ProductAwardList.push(obj);
            }
            let OrderAwardList = [];
            for(let i = 0;i<this.OrderAwardList.length;i++)
            {
                let obj = {
                    MoreThan:this.OrderAwardList[i].MoreThan,
                    RewardMoney:this.OrderAwardList[i].RewardMoney,
                    ActivityOrderAwardId:this.OrderAwardList[i].ActivityOrderAwardId
                };
                OrderAwardList.push(obj);
            }
            let sendObj = {
                Id:this.editId,
                Title:this.form.Title,
                ActivityType :this.form.ActivityType,
                StartTime:this.form.StartTime.split(" ")[0],
                EndTime:this.form.EndTime.split(" ")[0],
                Describe:this.form.Describe,
                SetPraiseCount:this.form.SetPraiseCount,
                ProductAwardList:ProductAwardList,
                OrderAwardList:OrderAwardList,
                ShopIds:ShopIds,
            };
            this.$http.PcActivity
            .UpdateActivityCtl(sendObj)
            .then((res)=>{
                console.log(res);
                if(res)
                {
                    this.$message({
                        type:"success",
                        message:"更新活动成功"
                    });
                    this.$router.push({path:"activityList"});
                }
                else
                {
                    this.$message({
                        type:"warning",
                        message:"更新活动失败"
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 保存活动事件
        save(form){
            console.log(this.form,'上传数据');
            this.$refs[form].validate((valid)=>{
                // 通过数据校验
                if(valid)
                {
                    console.log(this.OrderAwardList);
                    // 校验订单奖励列表
                    if(!this.OrderAwardList.length)
                    {
                        this.$message({
                            type:"warning",
                            message:"请填写订单奖励"
                        });
                        return
                    }
                    for(let i = 0;i<this.OrderAwardList.length;i++)
                    {
                        if(!this.OrderAwardList[i].MoreThan || !this.OrderAwardList[i].RewardMoney)
                        {
                            this.$message({
                                type:"warning",
                                message:"请完善订单奖励内容"
                            });
                            return
                        }
                    }
                    // 校验活动详情内容
                    if(document.querySelector(".editor .ql-editor").innerHTML === '<p><br></p>')
                    {
                        this.$message({
                            type:"warning",
                            message:"请填写活动详情"
                        });
                        return
                    }
                    // 校验单品奖励列表
                    for(let i = 0;i<this.ProductAwardList.length;i++)
                    {
                        if(!this.ProductAwardList[i].RewardMoney)
                        {
                            this.$message({
                                type:"warning",
                                message:"请填写符合的产品奖励金额"
                            });
                            return
                        }
                    }
                    // 校验门店列表
                    if(!this.chosenShopList.length)
                    {
                        this.$message({
                            type:"warning",
                            message:"请选择门店"
                        });
                        return
                    }
                    this.uploadRichText();
                }
                else
                {
                    this.$message({
                        type:"warning",
                        message:"请完善相关信息"
                    });
                    return false;
                }
            });
        },
        // 取消事件
        cancel(){
            this.ifShowGoodDialog = false;
            this.ifShowShopDialog = false;
            this.goodNoList = "";
        },
        // 提交商品货号事件
        submit(){
            let codeList = [];
            codeList = this.goodNoList.split("，");
            this.$http.PcCommodity
            .GetCommodityByCodeCtl(codeList)
            .then((res)=>{
                console.log(res);
                if(res.length)
                {
                    let chosenIdList=[],newIdList=[],resultList=[];
                    // 提取出两个idList
                    this.ProductAwardList.forEach(item => {
                        chosenIdList.push(item.Id);
                    });
                    res.forEach((item)=>{
                        newIdList.push(item.Id);
                    });
                    // 比对现不存在的idList
                    for(let i = 0;i<newIdList.length;i++)
                    {
                        if(chosenIdList.indexOf(newIdList[i]) === -1)
                        {
                            resultList.push(newIdList[i]);
                        }
                    }
                    resultList.forEach((item)=>{
                        for(let i = 0;i<res.length;i++)
                        {
                            if(item === res[i].Id)
                            {
                                res[i].ActivityAndCommodityId = 0;
                                res[i].CommodityName = res[i].Name;
                                this.ProductAwardList.push(res[i]);
                            }
                        }
                    });
                }
                console.log(this.ProductAwardList,'当前货品列表');
                this.ifShowGoodDialog = false;
                this.goodNoList = "";
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 获取富文本链接
        getRichTextFile(data, type) {
            this.form.Describe = data.url;
            this.updateData();
        },

        // 上传富文本 通用方法，type判断上传的是详情或者是图文课程的内容
        uploadRichText(type) {
            let content = JSON.stringify(document.querySelector(".editor .ql-editor").innerHTML);
            let timestamp = Date.parse(new Date());
            var newFile = new File(
                [content],
                "richText" + type + timestamp + ".json"
            );
            this.$refs.detailUploader.directUpload(newFile, type);
        },

        // 保存/更新课程
        updateData() {
            console.log(this.form,'上传活动表单');
            if(this.pageState === "add")
            {
                this.addActivity();
            }
            else if(this.pageState === "edit")
            {
                this.editActivity();
            }
        },
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.wrapper
{
    background: #fff;
    position: relative;
    padding: 30px;
    .title
    {
        margin-bottom: 30px;
        padding-bottom: 18px;
        border-bottom: 1px solid #E5E5E5;
        font-weight: bold;
    }
    .contentWrapper
    {
        margin-bottom: 50px;
        .notice
        {
            color: #999999;
            margin-left: 15px;
        }
        .actionBtn
        {
            color: #1E87FE;
            cursor:pointer;
        }
    }
    .line
    {
        text-align: center;
    }
    .ProductAwardList
    {
        width: 300px;
        .title
        {
            width: 100%;
            display: flex;
            margin-bottom: 30px;
            span
            {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;;
            }
        }
        .goodName
        {
            width: 150px;
            display: inline-block;
            text-align: center;
        }
    }

    .bonusItem
    {
        margin-bottom: 20px;
    }
    .addBonusBtn
    {
        width:100px;
        height:30px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(30,135,254,1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(30,135,254,1);
    }

    .btnGroup
    {
        width: 20%;
        margin: 0 auto;
        .saveBtn
        {
            width:100px;
            height:36px;
            background:rgba(64,158,255,1);
            border-radius:2px;
            color: #fff;
            outline: none;
        }
        .cancelBtn
        {
            width:100px;
            height:36px;
            background:rgba(255,255,255,1);
            border-radius:2px;
            border:1px solid rgba(64,158,255,1);
            color: rgba(64,158,255,1);
            outline: none;
        }
    }

    .mengceng
    {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        .dialog
        {
            overflow: hidden;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            position: relative;
            width: 500px;
            padding: 20px;
            .dialogTitle
            {
                margin-bottom: 20px;
                padding-bottom: 5px;
                border-bottom: 1px solid #eeeeee;
                .closeIcon
                {
                    font-weight: bolder;
                    cursor:pointer;
                }
            }
            .actionArea
            {
                margin-bottom: 20px;
            }

            .goodNoArea
            {
                box-sizing: border-box;
                padding: 12px;
                resize: none;
                width: 100%;
                height: 150px;
            }
            .btnGroup
            {
                margin-top: 10px;
                float: right;
                display: flex;
                width: auto;
                .cancel,.submit
                {
                    width: 60px;
                    height: 30px;
                }
                .cancel
                {
                    margin-right: 20px;
                }
                .submit
                {
                    color: #fff;
                    background-color: $baseColor;

                }
            }

            .tab
            {
                border-radius: 2px;
                display: flex;
                .tabItem
                {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px;
                    height: 32px;
                    border: 1px solid #E5E5E5;
                    cursor:pointer;
                }
                .active
                {
                    color: #fff;
                    background-color: #409EFF;
                    border: 1px solid #409EFF;
                }
            }

            .shopAddressList
            {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #EEEEEE;
                .content
                {
                    margin: 0;
                    .shopName
                    {
                        margin-bottom: 10px;
                    }
                    .shopAddress
                    {
                        color: #999999;
                        font-size: 12px;
                    }
                }
                .addBtn
                {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 30px;
                    border:1px solid #409EFF;
                    color: #409EFF;
                    font-size: 12px;
                    cursor:pointer;
                }
                .chosen
                {
                    border:1px solid #666666;
                    color:#666666;
                }
                .addedBtn
                {
                    color: #999999;
                    border:1px solid #999999;
                }
            }
        }
    }
}
/deep/ .el-form-item__label
{
    padding-right: 30px;
    &:last-of-type
    {
        text-align:left;
    }
}
</style>