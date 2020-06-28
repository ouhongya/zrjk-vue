import axios from 'axios'
import { MessageBox, Message,Loading } from 'element-ui'
import {getToken, removeToken, setToken} from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 5000
})
let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中……',
    spinner:'el-icon-loading',
    background: 'rgba(50, 0, 0, 0.1)'
  })
}
function endLoading() {
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

service.interceptors.request.use(
  config => {
    showFullScreenLoading()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    removeToken()
    setToken(response.headers.token);
    const res = response.data
    if (res === 666){
      Message({
        message: '账号或密码错误',
        type: 'error',
        duration:2 * 1000
      })
      tryHideFullScreenLoading()
    }
    if (res === 555){
      Message({
        message: '权限不足',
        type: 'error',
        duration:2 * 1000
      })
      tryHideFullScreenLoading()
    }
    if (res === 111){
      tryHideFullScreenLoading()
    }
    if(res.queue.code===3){
      Message({
        message: res.queue.message,
        type: 'info',
        duration: 2 * 1000
      })
      tryHideFullScreenLoading()
    }
    if(res.queue.code!== 1) {
      Message({
        message: res.queue.message,
        type: 'info',
        duration: 2 * 1000
      })
      tryHideFullScreenLoading()
       return  res
    } else {
      tryHideFullScreenLoading()
      return res
    }
  },
  error => {
    tryHideFullScreenLoading()
    Message({
      message: '网络连接超时请刷新页面',
      type: 'error',
      duration:2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
