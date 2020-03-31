import axios from "axios";
import appConfig from "@/config/appConfig";
import { Loading, Message } from "element-ui";
import { AJAX_CODE } from "@/utils/constant";

const isDev = process.env.NODE_ENV === "development";

let requestNum = 0, // 累计请求数
  loadingInstance = null; // loading实例

const service = axios.create({
  baseURL: appConfig.baseURL,
  timeout: 60000,
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/json"
  }
});

service.interceptors.request.use(
  config => {
    requestNum++;
    var token = localStorage.getItem("SYSTEMSETTINGTOKEN");
    if (token) {
      config.headers.Authorization = token;
      config.headers.token = token;
    } else {
      Message({
        type: "error",
        message: "token error"
      });
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    requestNum--;
    if (requestNum === 0) {
      loadingInstance.close();
    }
    const res = response.data;
    // 判断此接口是否需要完整返回后端返回的数据
    if (response.config.isReturnAll) {
      console.log(`接口：${response.config.url} 的返回数据：`, res);
      return res;
    } else {
      // 判断是否返回正确的业务编码，返回正确的时候则直接返回主体，否则提示报错
      if (res && res.Code === AJAX_CODE.SUCCESS && res.Data) {
        console.log(`接口：${response.config.url} 的返回数据：`, res);
        return res.Data;
      } else {
        console.error(`接口：${response.config.url} 返回数据有问题：`, res);
        Message({
          type: "error",
          message: res.Message ? `${res.Message}:${res.ReqCode}` : "未知错误"
        });
        return Promise.reject(res);
      }
    }
  },
  error => {
    requestNum--;
    if (requestNum === 0) {
      loadingInstance.close();
    }
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.Message
    ) {
      error.message = error.response.data.Message;
    } else if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      error.message = "连接到服务器失败";
    }
    Message({
      type: "error",
      message: error.message
    });
    return Promise.reject(error);
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params, loading = true, config = {}) {
  if (loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  return service.get(url, {
    ...config,
    params
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, loading = true, config = {}) {
  if (loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  return service.post(url, params, config);
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params, loading = true, config = {}) {
  if (loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  return service.put(url, params, config);
}

/**
 * del方法，对应del请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function del(url, params, loading = true, config = {}) {
  if (loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  return service.delete(url, { data: params, ...config });
}
