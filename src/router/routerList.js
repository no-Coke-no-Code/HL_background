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
    path: "/",
    name: "HLbackground",
    meta: {
      title: "首页"
    },
    redirect: {
      path: "HLbackground/index"
    }
  },
  {
    path: "/HLbackground",
    meta: {
      title: "汇乐导购系统后台"
    },
    name: "HLbackground",
    component: Layout,
    redirect: {
      path: "HLbackground/index"
    },
    children: [
      // 首页
      {
        path: "index",
        name: "index",
        meta: {
          title: "首页"
        },
        component: () =>
          import("@/views/home/index.vue")
      },

      // 活动管理模块
      {
        path: "activityManage",
        name: "activityManage",
        meta: {
          title: "活动管理"
        },
        redirect: {
          path: "activityManage/activityList"
        },
      },
      {
        path: "activityManage/activityList",
        name: "activityList",
        meta: {
          title: "活动列表页"
        },
        component: () =>
          import("@/views/activityManage/activityList/activityList.vue")
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
        path: "activityManage/goodManage",
        name: "goodManage",
        meta: {
          title: "商品管理页"
        },
        component: () =>
          import("@/views/activityManage/goodManage/goodManage.vue")
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

      // 课程管理模块
      {
        path: "lessonManage/lessonList/:type",
        name: "lessonManage",
        meta: {
          title: "课程列表"
        },
        component: () =>
          import("@/views/lessonManage/lessonList/lessonList.vue")
      },

      // 用户管理模块
      {
        path: "businessManManage/businessManList",
        name: "businessManList",
        meta: {
          title: "业务员列表"
        },
        component: () =>
          import("@/views/businessManManage/businessManList/businessManList.vue")
      },
      // 财务管理模块
      {
        path: "financeManage",
        name: "financeManage",
        meta: {
          title: "财务管理"
        },
        redirect: {
          path: "financeManage/withdrawList"
        },
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
      {
        path: "financeManage/withdrawList",
        name: "withdrawList",
        meta: {
          title: "提现申请"
        },
        component: () =>
          import("@/views/financeManage/withdrawList/withdrawList.vue")
      },
    ]
  }
];
export default routerList;
