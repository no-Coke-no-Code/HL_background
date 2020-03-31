<template>
    <div class="wrapper">
        <!-- 搜索区域 -->
        <searchOptions :SearchOptions="search" ref="seasrchOptions" @on-confirm="confirmSearch"></searchOptions>

        <tab :tabList="tabList" @selectChange="selectChange"></tab>

        <div class="tableWrapper">
             <el-table :data="proofList" style="margin-top:20px;" class="proofTable" border>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="活动名称" prop="Title"></el-table-column>
                <el-table-column label="导购员" width="200px">
                    <template slot-scope="scope">
                        <div class="flex align-center flex-center">
                            <img 
                            class="asistantImg" 
                            :src="scope.row.Guide.HeadimgUrl" 
                            @click="imgList[0] = scope.row.Guide.HeadimgUrl;bigPictureVisible = true"/>
                            <div>
                                <span class="asistantName">{{scope.row.Guide.TrueName}}</span>
                                <span class="asistantPhone">{{scope.row.Guide.Phone}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="凭证信息">
                    <template slot-scope="scope">
                        <span class="action" @click="checkCode(scope.row)">查看凭证</span>
                    </template>
                </el-table-column>
                <el-table-column label="自动校验结果" prop="AutoAuditResultStr" width="150px">
                    <template slot-scope="scope">
                        {{
                            scope.row.AutoAuditResult === 0?"其它":
                            scope.row.AutoAuditResult === 1?"防伪码识别成功":
                            scope.row.AutoAuditResult === 2?"防伪码识别失败":"无效条码"
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" width="300px">
                    <template slot-scope="scope">
                        <p>时间：{{scope.row.TimeInfo.SubmitTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="活动类型">
                    <template slot-scope="scope">
                        <div style="border-bottom:1px solid #EBEEF5">单品奖励</div>
                        <div>订单奖励</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单金额">
                    <template slot-scope="scope" style="text-align:center;">
                        <div style="border-bottom:1px solid #EBEEF5">￥{{scope.row.ProductAward.Money}}</div>
                        <div>￥{{scope.row.OrderAward.Money}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="150px" show-overflow-tooltip>
                    <template slot-scope="scope" style="text-align:center;">
                        <div style="border-bottom:1px solid #EBEEF5" :class="{'failReason':scope.row.ProductAward.AuditStatus === 3}">
                            <p v-if="scope.row.OrderAward.AuditStatus === 0">进行中</p>
                            <p class="wait" v-if="scope.row.ProductAward.AuditStatus === 1">待审核</p>
                            <p class="success" v-if="scope.row.ProductAward.AuditStatus === 2">审核通过</p>
                            <p class="fail" v-if="scope.row.ProductAward.AuditStatus === 3">审核失败</p>
                            <p class="reason" v-if="scope.row.ProductAward.AuditStatus === 3">{{scope.row.ProductAward.AuditRemark}}</p>
                        </div>
                        <div :class="{'failReason':scope.row.OrderAward.AuditStatus === 3}">
                            <p v-if="scope.row.OrderAward.AuditStatus === 0">进行中</p>
                            <p class="wait" v-if="scope.row.OrderAward.AuditStatus === 1">待审核</p>
                            <p class="success" v-if="scope.row.OrderAward.AuditStatus === 2">审核通过</p>
                            <p class="fail" v-if="scope.row.OrderAward.AuditStatus === 3">审核失败</p>
                            <p class="reason" v-if="scope.row.OrderAward.AuditStatus === 3">{{scope.row.ProductAward.AuditRemark}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="审核时间" width="150px">
                    <template slot-scope="scope">
                        <div style="border-bottom:1px solid #EBEEF5">
                            <p>{{scope.row.TimeInfo.ProductAuditTime?scope.row.TimeInfo.ProductAuditTime:"无"}}</p>
                        </div>
                        <div>
                            <p>{{scope.row.TimeInfo.OrderAuditTime?scope.row.TimeInfo.OrderAuditTime:'无'}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150px">
                    <template slot-scope="scope" style="text-align:center;">
                        <div style="border-bottom:1px solid #EBEEF5">
                            <div v-if="scope.row.ProductAward.AuditStatus === 1">
                                <span class="action" @click="productExamDialog(1,scope.row)">手动审核</span>
                                <span class="action" @click="examFail(scope.row,1)">审核失败</span>
                            </div>
                            <div v-if="scope.row.ProductAward.AuditStatus === 2 && !scope.row.ProductAward.IsCommodityComplete" class="action" @click="productExamDialog(2,scope.row)">完善信息</div>
                            <div v-if="scope.row.ProductAward.AuditStatus === 2 && scope.row.ProductAward.IsCommodityComplete" class="action" @click="productExamDialog(3,scope.row)">查看信息</div>
                            <div v-if="scope.row.ProductAward.AuditStatus === 3" style="visibility:hidden;">无</div>
                        </div>
                        <div>
                            <div v-if="scope.row.OrderAward.AuditStatus === 1">
                                <span class="action" style="margin-right:20px;" @click="examSuccess(scope.row)">审核通过</span>
                                <span class="action" @click="examFail(scope.row,2)">审核失败</span>
                            </div>
                            <div v-if="scope.row.OrderAward.AuditStatus === 2" style="visibility:hidden">无</div>
                            <div v-if="scope.row.OrderAward.AuditStatus === 3" style="visibility:hidden">无</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <Pagination
            :total="PageModel.PageCount"
            :currentPage="PageModel.PageIndex"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></Pagination>


        <!-- 单品奖励弹窗 -->
        <el-dialog
        :title="dialogTitle"
        :visible.sync="examDialog"
        width="30%">
            <div class="item">
                <span class="label">销售小票</span>
                <div class="imgWrapper">
                    <img :src="item" v-for="(item,index) in SalesImgList" :key="index" class="saleImg"/>
                </div>
            </div>
            <el-form v-model="productAwardObj" :rules="productAwardRules" v-if="dialogTitle === '单品奖励审核'">
                <el-table :data="productAwardObj.productAwardList">
                    <el-table-column label="产品货号">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'CommodityCode'" :rules="productAwardRules.CommodityCode">
                                <el-input v-model="scope.row.CommodityCode"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品原价">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'OriginalPrice'" :rules="productAwardRules.OriginalPrice">
                                <el-input v-model="scope.row.OriginalPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际销售价(元)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'RealPrice'" :rules="productAwardRules.RealPrice">
                                <el-input v-model="scope.row.RealPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="规则金额(元)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'AwardMoney'" :rules="productAwardRules.AwardMoney">
                                <el-input v-model="scope.row.AwardMoney"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <el-form v-model="productAwardObj" :rules="productAwardRules" v-if="dialogTitle === '完善信息'">
                <el-table :data="productAwardObj.productAwardList">
                    <el-table-column label="产品货号">
                        <template slot-scope="scope">
                            <p>{{scope.row.CommodityCode}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品原价">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'OriginalPrice'" :rules="productAwardRules.OriginalPrice">
                                <el-input v-model="scope.row.OriginalPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际销售价(元)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'RealPrice'" :rules="productAwardRules.RealPrice">
                                <el-input v-model="scope.row.RealPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="规则金额(元)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'productAwardList.'+scope.$index+'AwardMoney'" :rules="productAwardRules.AwardMoney">
                                <el-input v-model="scope.row.AwardMoney"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <el-table :data="productAwardObj.productAwardList" v-if="dialogTitle === '订单信息'">
                <el-table-column label="产品货号">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column label="商品原价">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column label="实际销售价(元)">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column label="规则金额(元)">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="examDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmExam">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 审核失败弹窗 -->
        <el-dialog
        title="审核失败"
        :visible.sync="examFailDialog"
        width="30%">
        <textarea v-model="examFailReason" style="resize:none;"></textarea>
        <span slot="footer" class="dialog-footer">
            <el-button @click="examFailDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmFailExam">确 定</el-button>
        </span>
        </el-dialog>

        <div class="mengceng" v-if="ifShowDialog">
            <div class="dialog">
                <div class="titleWrapper">
                    <span class="title">{{dialogType === 0?'查看防伪码':'审核'}}</span>
                    <span class="closeIcon" @click="closeDialog">X</span>
                </div>
                <!-- 查看防伪码 -->
                <div v-if="dialogType === 0">
                    <div class="item" v-if="BarcodeList.length">
                        <span class="label">防伪码</span>
                        <div class="barCodeImgWrapper">
                            <img v-for="(item,index) in BarcodeList" :key="index" :src="item.ImageUrl" class="barCodeImg"/>
                        </div>
                    </div>
                    <div class="item" v-if="currentActivity.SalesDocInfo.SalesImageUrl">
                        <span class="label">销售小票</span>
                        <div class="barCodeImgWrapper">
                            <img :src="currentActivity.SalesDocInfo.SalesImageUrl" class="barCodeImg"/>
                        </div>
                    </div>
                    <div class="item" >
                        <span class="label">订单原价</span>
                        <p>￥{{currentActivity.SalesDocInfo.OriginalPrice}}</p>
                    </div>
                    <div class="item">
                        <span class="label">实际销售价</span>
                        <p>￥{{currentActivity.SalesDocInfo.RealPrice}}</p>
                    </div>
                </div>
                <!-- 审核 -->
                <div v-if="dialogType === 1">
                    <el-form :model="examForm" ref="examForm" v-if="dialogType === 1" :inline="true" label-width="100px" :rules="rules">
                        <el-form-item label="审核类型" prop="state">
                            <el-radio-group v-model="examForm.state">
                                <el-radio label="0">
                                    审核通过
                                </el-radio>
                                <el-radio label="1">
                                    审核失败
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="原因" v-if="examForm.state==='1'" prop="reason">
                            <el-input type="textarea" style='width:100%;' v-model="examForm.reason"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="btnGroup" v-if="dialogType === 1">
                        <el-button class="cancelBtn" @click="cancel">取消</el-button>
                        <el-button class="confirmBtn" @click="confirm">提交</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看图片 -->
        <big-Picture :images="imgList" :visible.sync="bigPictureVisible" :imagesIndex="bigPictureIndex"></big-Picture>
    </div>
</template>
<script>

import searchOptions from "@/components/SearchOptions";
import bigPicture from "@/components/BigPicture";
import Uploader from "@/components/Uploader/index.vue";
import Pagination from "@/components/Pagination/index.vue"; //分页
import tab from "@/components/tab/index.vue";

var search = require("./config/search.json");

export default {
    name:"goodManage",
    components:{
        searchOptions,
        bigPicture,
        Uploader,
        Pagination,
        tab
    },
    data(){
        return{
            currentActivity:{}, // 当前选中活动
            
            examFailDialog:false, // 是否显示审核失败弹窗
            examFailReason:"", // 审核失败备注

            examDialog:false, // 是否显示单品审核弹窗 
            dialogTitle:"",

            productAwardObj:{
                productAwardList:[],
            }, // 活动单品奖励对象
            imgList: [], // 查看大图的图片列表
            BarcodeList: [], // 防伪码图片列表 
            SalesImgList:[], // 小票图片列表
            bigPictureVisible: false,
            bigPictureIndex: 0,
            tabList:[
                {
                    label:"全部",
                    value:"",
                    count:0,
                },
                {
                    label:"待审核",
                    value:1,
                    count:0,
                },
                {
                    label:"审核成功",
                    value:2,
                    count:0,
                },
                {
                    label:"审核失败",
                    value:3,
                    count:0,
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
            search:search,

            // 表单验证规则
            rules: {
                state: [
                    { required: true, message: "请选择审核结果", trigger: "change" }
                ],
                reason: [
                    { required: true, message: "请填写审核失败原因", trigger: "blur" }
                ],
            },
            // 单品奖励校验规则
            productAwardRules:{
                CommodityCode: [
                    { required: true, message: "请填写货号", trigger: "blur" }
                ],
                OriginalPrice: [
                    { required: true, message: "请填写商品原价", trigger: "blur" }
                ],
                RealPrice: [
                    { required: true, message: "请填写实际销售价", trigger: "blur" }
                ],
                AwardMoney: [
                    { required: true, message: "请填写实际奖励", trigger: "blur" }
                ],
            },

            dialogType:"",
            state:"",
            uploadDone:false,
            ifShowDialog:false // 商品弹窗 
        }
    },
    methods:{
        // tab栏切换
        selectChange(item){
            this.state = item.value;
            this.confirmSearch();
        },

        confirmSearch(){
            let sendObj = {};
            for(let i = 0;i<this.search.length;i++)
            {
                if(this.search[i].key === 'time' && this.search[i].value.start)
                {
                    sendObj.BeginDate = this.search[i].value.start
                }
                else if(this.search[i].key === 'time' && this.search[i].value.end)
                {
                    sendObj.EndDate = this.search[i].value.end;
                }
                else
                {
                    sendObj[this.search[i].key] = this.search[i].value;
                }
            }
            sendObj = Object.assign(sendObj,{
                AuditStatus:this.state,
                Paged:{
                    PageIndex:this.PageModel.PageIndex,
                    PageSize:this.PageModel.PageSize,
                    PageCount:""
                },
            });
            console.log(sendObj,'11111111111111111111');
            this.$http.PcActivity
            .GetPagedListActivityAuditListCtl(sendObj)
            .then((res)=>{
                for(let i = 0;i<this.tabList.length;i++)
                {
                    if(this.tabList[i].label === '全部')
                    {
                        this.tabList[i].count = res.TotalCount;
                    }
                    else if(this.tabList[i].label === '待审核')
                    {
                        this.tabList[i].count = res.UnAuditedCount;
                    }
                    else if(this.tabList[i].label === '审核成功')
                    {
                        this.tabList[i].count = res.PassCount;
                    }
                    else if(this.tabList[i].label === '审核失败')
                    {
                        this.tabList[i].count = res.NoPassCount;
                    }
                }
                this.proofList = res.ListData;
                this.PageModel.PageCount = res.Paged.PageCount;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 查看凭证
        checkCode(row){
            this.ifShowDialog = true;
            this.dialogType = 0;
            let sendObj = {
                udid:row.UdId,
                activityAndGuideId:row.ActivityAndGuideId,
            };
            this.$http.PcActivity
            .GetSalesDocumentCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.BarcodeList = [];
                this.BarcodeList = JSON.parse(JSON.stringify(res.BarcodeList));
                this.currentActivity = row;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 审核
        exam(){
            this.ifShowDialog = true;
            this.dialogType = 1;
        },

        cancel(){
            this.ifShowDialog = false;
            this.examForm = {

            };
        },
        confirm(){
            console.log(this.examForm);
            this.$refs.examForm.validate((valid)=>{
                if(valid)
                {
                    this.ifShowDialog = false;
                    this.ifShowDialog = {

                    };
                }
                else
                {

                }
            });
        },
        closeDialog(){
            this.ifShowDialog = false;
            this.examForm = {
                
            };
        },

        // 订单审核成功
        examSuccess(row){
            this.$confirm('确定要通过审核?',"订单奖励审核", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            })
            .then(()=>{
                let sendObj = {
                    UdId:row.UdId,
                    ActivityId:row.ActivityId,
                    ActivityAndGuideId:row.ActivityAndGuideId,
                    Title:row.Title,
                    Money:0
                };
                this.$http.PcActivity.OrderAwardManualAuditCtl(sendObj)
                .then(()=>{
                    this.$message({
                        type:"success",
                        message:"审核成功"
                    });
                    this.confirmSearch();
                }).catch((err)=>{
                    console.log(err);
                });
            })
            .catch(()=>{});
        },
        // 打开审核失败弹窗
        examFail(row,val){
            this.examFailDialog = true;
            this.currentActivity = JSON.parse(JSON.stringify(row)); 
            this.currentActivity.awardType = val;
        },
        // 关闭审核失败弹窗
        handleExamFailClose(){
            this.examFailDialog = false;
        },
        // 审核失败申请
        confirmFailExam(){
            let sendObj = {
                ActivityAndGuideId:this.currentActivity.ActivityAndGuideId,
                AwardType:this.currentActivity.awardType,
                Remark:this.examFailReason,
            };
            this.$$http.PcActivity
            .ActivityAuditDeclineCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.examFailReason = "";
                this.examFailDialog = false;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 提交审核申请
        confirmExam(){
            if(this.dialogTitle === '单品奖励审核')
            {
                let sendObj = {
                    UdId:"",
                    ActivityAndGuideId:"",
                    Title:"",
                    AuditItemList:[]
                    }
                this.$http.PcActivity.ProductAwardManualAuditCtl(sendObj).then((res)=>{
                    console.log(res);
                    this.examDialog = false;
                }).catch((err)=>{
                    console.log(err);
                });
            }
            else if(this.dialogTitle === "完善信息")
            {
                let sendObj = {
                    UdId:"",
                    ActivityAndGuideId:"",
                    Title:"",
                    AuditItemList:[]
                }
                this.$http.PcActivity.ProductAwardManualAuditCtl(sendObj).then((res)=>{
                    console.log(res);
                    this.examDialog = false;
                }).catch((err)=>{
                    console.log(err);
                });
            }
            else if(this.dialogTitle === "查看信息")
            {
                this.examDialog = false;
            }
        },

        // 打开单品奖励弹窗
        productExamDialog(val,row){
            this.currentActivity = row;
            console.log(row,'当前活动信息');
            // 当前进行手动发起审核操作
            if(val === 1)
            {
                this.dialogTitle = '单品奖励审核'
            }
            // 完善信息操作
            else if(val === 2)
            {
                this.dialogTitle = '完善信息';
            }
            // 查看信息操作
            else if(val === 3)
            {
                this.dialogTitle = '查看信息';
            }
            this.examDialog = true;
            let sendObj = {
                activityAndGuideId:row.ActivityAndGuideId
            };
            this.$http.PcActivity
            .ProductAwardAuditQueryCtl(sendObj)
            .then((res)=>{
                console.log(res);
                this.SalesImgList = res.SalesDocUrl;
                if(res.ListData.length)
                {
                    this.$set(this.productAwardObj,'productAwardList',res.ListData);
                    console.log(this.productAwardObj)
                }
                else
                {
                    for(let i = 0;i<res.ProductCount;i++)
                    {
                        let tempObj = {
                            id:0,
                            CommodityCode:"",
                            OriginalPrice:"",
                            RealPrice:"",
                            AwardMoney:"",
                        };
                        this.$set(this.productAwardObj.productAwardList,i,tempObj);
                    }
                    console.log(this.productAwardObj);
                }
            })
            .catch((err)=>{
                console.log(err);
            });
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
        this.confirmSearch()
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.wrapper
{
    padding: 30px;

    .proofTable
    {
        .asistantImg
        {
            width: 30px;
            height: 30px;
            margin-right: 5px;
            border-radius: 50%;
        }
        .noteImg
        {
            width: 30px;
            height: 30px;
            margin-right: 5px;
        }
        .action
        {
            cursor:pointer;
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

        .success
        {
            color: #29AF39;
        }
        .wait
        {
            color: #FF9200;
        }
        .fail
        {
            color: #FF0202;
        }
        .reason
        {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding: 0 10px;
        }
        .failReason
        {
            display: block !important;
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
            .item
            {
                display: flex;
                margin-bottom:40px;
                &:last-of-type
                {
                    margin-bottom: 0;;
                }
                .barCodeImgWrapper
                {
                    display: flex;
                    flex-wrap: wrap;
                    .emptyWrapper
                    {
                        width: 100%;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .barCodeImg
                    {
                        width: 120px;
                        height: 120px;
                        margin-right: 40px;
                    }
                }
                .label
                {
                    width: 80px;
                    margin-right: 10px;
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

    // 调整弹窗审核失败原因文本框样式
    /deep/ .dialog .el-form-item 
    {
        width: 100%;
        .el-form-item__content
        {
            width: 80%;
        }
    }

    /deep/ .tableWrapper .el-table__header-wrapper , /deep/ .tableWrapper .el-table__fixed-header-wrapper
    {
        height: 50px;
        tr
        {
            height: 50px;
        }
        .cell
        {
            transform: translateY(-30px);
            align-items: center;
            justify-content: center;
            display: flex;
        }
    }

    /deep/ .tableWrapper .el-table_1_column_7 .cell, /deep/ .tableWrapper .el-table_1_column_8 .cell,/deep/ .tableWrapper .el-table_1_column_9 .cell, /deep/ .tableWrapper .el-table_1_column_10 .cell
    {
        padding: 0 !important;
        height: 93px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div
        {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            width: 100%;
        }
    }
    /deep/ .tableWrapper .el-table_1_column_11 .cell
    {
        height: 93px;
        padding: 0;
        display: flex;
        flex-direction: column;
        div
        {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    } 

    // 单品奖励弹窗样式
    /deep/ .el-dialog__wrapper
    {
        .item
        {
            display: flex;
            .label
            {
                margin-right: 27px;
            }
            .imgWrapper
            {
                display: flex;
                flex-wrap: wrap;
                .saleImg
                {
                    width: 90px;
                    height: 90px;
                    border-radius: 4px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>