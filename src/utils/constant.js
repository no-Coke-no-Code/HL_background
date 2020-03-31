// 常量

// 异步请求返回的业务状态码
export const AJAX_CODE = {
  SUCCESS: 1, // 请求成功
  AUTH_EXPIRE: 444 // 授权过期
};
export const API_URL = '/api/';
// 菜单跳转方式
export const A_TARGET = {
  E: "expand", // 无页面
  FL: "forcedload", // 强制加载
  IF: "iframe", // 框架页
  O: "open", // 弹出页
  NEW: "blank" // 新窗口
};

//  营业执照
export const AUTH_STATE = {
  ALL: -1, //所有
  WAIT_PASS: 1, //待审核
  REJECT: 2, //已驳回
  WAIT_PASS_AGAIN: 3, //待复审
  FINISH: 66 //已完成
}
// 设置授权书时，前端拖拽和后端生成图片的尺寸计算偏移量
export const Auth_OFFSETY = 26;
