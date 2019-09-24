import axios from "axios";
import { Loading, Message } from "element-ui";
import { getToken, removeToken } from "@/utils/auth";
import { getChinese } from "@/utils/tool.js";

let apiHost = require("../setting/api-host").apiHost;

// create an axios instance
const service = axios.create({
  baseURL: apiHost, // api 的 base_url
  timeout: 50000 // request timeout
});

let loadingInstance;

// request拦截器
service.interceptors.request.use(
  config => {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      console.log("刷新");
    } else {
      loadingInstance = Loading.service({
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.5)"
      });
    }
    config.headers["X-Token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    loadingInstance.close();
    return response.data;
  },
  error => {
    loadingInstance.close();
    if (error.response.status == 401) {
      removeToken();
      return Promise.reject(error);
    } else if (error.response.status == 400) {
      Message({
        message:
          error.response.data.msg.indexOf("lidation_exception:") != -1
            ? error.response.data.msg.split("validation_exception:")[1]
            : error.response.data.msg,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(error);
    } else {
      Message({
        message: getChinese(error.response.data.msg) || "服务器异常！",
        type: "error",
        duration: 5 * 1000
      });
    }
  }
);

export default service;
