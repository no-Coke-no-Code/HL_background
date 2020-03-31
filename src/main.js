import Vue from 'vue'
import ELEMENT from 'element-ui';
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './assets/styles/common.scss';
import api from "./api";
import { AJAX_CODE } from "@/utils/constant"; // 常量
import VCharts from 'v-charts';

Vue.use(VCharts);

Vue.prototype.$http = api;
Vue.prototype.AJAX_CODE = AJAX_CODE; // 接口请求返回的状态码

const sleep = ()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(resolve,5000);
  })
}

Vue.prototype.$http = api;
Vue.use(ELEMENT, { size: 'small' });
Vue.config.productionTip = false
const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
