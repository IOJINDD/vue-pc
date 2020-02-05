import axios from 'axios'
import { Message, Loading } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
import router from "@/router/index"

let apiHost = require('../setting/api-host').apiHost

// create an axios instance
const service = axios.create({
  baseURL: apiHost, // api 的 base_url
  timeout: 15000 // request timeout
})

let loadingInstance

// request拦截器
service.interceptors.request.use(config => {
  if (config.responseType === 'blob') {
    config.headers['responseType'] ='blob'
  }
  loadingInstance = Loading.service({
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.5)',
  })
  config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    loadingInstance.close()
    return response.data
  },
  error => {
    loadingInstance.close()
    if (error.toString().indexOf('401') != -1) {
      removeToken()
      router.push('/login')
      return error
    } else if (error.toString().indexOf('400') != -1) {
      Message({
        message: error.response.data.msg || '数据不能为空！',
        type: 'warning',
        duration: 5 * 1000
      })
      return error
    } else {
      // window.location='/'
      Message({
        message: error.code || '操作失败，请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      })
      return error
    }
  }
)

export default service
