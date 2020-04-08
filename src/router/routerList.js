/**
  meta : {
    title: 'title'               页面的title，可用作设置document.title和显示在面包屑上面
    breadcrumb: false            是否显示在面包屑上,默认开启
  }
 *
 */
import Layout from "@/layout";
const routerList = [
  {
    path: "/m/Admin/HLbackground",
    meta: {
      title: "首页"
    },
    name: "index",
    component: Layout,
    children: [
      {
        path: "WebView",
        name: "WebView",
        component: () => import("@/views/WebView/WebView")
      },
      {
        path: "/",
        name: "index",
        meta: {
          title: "首页"
        },
        component: () =>
          import( "@/views/home/index.vue")
      },

      // 活动管理模块
      {
        path: "activityManage",
        name: "activityManage",
        meta: {
          title: "活动管理"
        },
        redirect:{
          path:"activityManage/activityList"
        },
      },
      {
        path: "activityManage/activityList",
        name: "activityList",
        meta: {
          title: "活动列表"
        },
        component: () =>
          import("@/views/activityManage/activityList/activityList.vue")
      },
      {
        path: "activityManage/goodManage",
        name: "goodManage",
        meta: {
          title: "商品管理"
        },
        component: () =>
          import("@/views/activityManage/goodManage/goodManage.vue")
      },
      {
        path: "activityManage/addActivity",
        name: "addActivity",
        meta: {
          title: "添加活动页"
        },
        component: () =>
          import("@/views/activityManage/addActivity/addActivity.vue")
      },
      {
        path: "activityManage/proofExam",
        name: "proofExam",
        meta: {
          title: "凭证审核页"
        },
        component: () =>
          import("@/views/activityManage/proofExam/proofExam.vue")
      },

      // 财务管理模块
      {
        path: "financeManage",
        name:"财务管理",
        redirect:{
          path:"financeManage/withdrawList"
        },
      },
      {
        path: "financeManage/withdrawList",
        name: "withdrawList",
        meta: {
          title: "提现申请"
        },
        component: () =>
          import("@/views/financeManage/withdrawList/withdrawList.vue")
      },
      {
        path: "financeManage/rewardDetail",
        name: "rewardDetail",
        meta: {
          title: "奖励明细"
        },
        component: () =>
          import("@/views/financeManage/rewardDetail/rewardDetail.vue")
      },

      // 用户管理模块
      {
        path: "businessManManage",
        name: "businessManManage",
        meta: {
          title: "用户管理"
        },
        redirect:{
          path:"businessManManage/businessManList"
        },
      },
      {
        path: "businessManManage/businessManList",
        name: "businessManList",
        meta: {
          title: "业务员列表"
        },
        component: () =>
          import("@/views/businessManManage/businessManList/businessManList.vue")
      },


      // 门店管理模块
      {
        path: "shopManage",
        name: "shopManage",
        meta: {
          title: "门店管理"
        },
        redirect:{
          path:"shopManage/shopList"
        },
      },
      {
        path: "shopManage/shopList",
        name: "shopList",
        meta: {
          title: "门店列表"
        },
        component: () =>
          import("@/views/shopManage/shopList/shopList.vue")
      },
      {
        path: "shopManage/shopExam",
        name: "shopList",
        meta: {
          title: "门店审核"
        },
        component: () =>
          import("@/views/shopManage/shopExam/shopExam.vue")
      },
      {
        path: "shopManage/sysManage",
        name: "sysManage",
        meta: {
          title: "系统管理"
        },
        component: () =>
          import("@/views/shopManage/sysManage/sysManage.vue")
      },
    ]
  }
]
export default routerList;
