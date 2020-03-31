// import Vue from 'vue'
import Router from 'vue-router'
import beforeEachFun from './beforeEachFun';
import afterEachFun from './afterEachFun';
import routerList from './routerList';

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: routerList
});
//进入路由前
router.beforeEach(beforeEachFun.bind(router));
//进入路由后
router.afterEach(afterEachFun)
export default router;
