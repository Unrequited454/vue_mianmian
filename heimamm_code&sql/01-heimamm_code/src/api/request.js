import axios from 'axios'
// 导入进度条插件
import NProgress from 'nprogress'
// 携带token
import {
  getToken,
  removeToken
} from '@/utils/token.js'
import router from '@/router/index.js'
import {
  Message
} from 'element-ui'

console.log('getToken:', getToken())
// 创建副本
const instance = axios.create({
  // 基地址
  baseURL: process.env.VUE_APP_BASEURL,
  // 跨域携带cookie
  withCredentials: true
})

// 拦截器
instance.interceptors.request.use(config => {
    // 当进入request拦截器，表示发送了请求，我们就开启进度条
    NProgress.start()
    // 设置token
    if (getToken()) {
      console.log('是否有token', getToken())
      config.headers.token = getToken()
    }
    return config
  },
  error => Promise.reject(error)
)
instance.interceptors.response.use(response => {
    // 当进入response拦截器，表示请求已经结束，我们就结束进度条
    NProgress.done()
    // 路由导航守卫 无token或无效token，跳转登录页
    if (response.data.code === 206) {
      Message.warning(response.data.message)
      // 移除token
      removeToken()
      // 跳转登录页
      router.push('/login')
    }
    return response.data
  },
  error => Promise.reject(error)
)

// 暴露axios对象
export default instance
