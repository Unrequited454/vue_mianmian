import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  getToken,
  removeToken
} from '@/utils/token.js'
import {
  Message
} from 'element-ui'
import store from '@/store/index.js'
import {
  userinfo
} from '@/api/login.js'
import routes from './routes.js'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})
/* 添加导航守卫
1、除登录页无须判断是否有token，其他页面均需判断是否有token；-->无token跳转到登录页
2、判断是否存在用户信息-->无用户信息跳转到登录页
  2.1 判断用户信息中的状态-->status为0表示禁用，跳转到登录页
*/
// 声明路由白名单
let whitePaths = ['/login']
// 声明登录路由
const loginPath = '/login'
router.beforeEach((to, from, next) => {
  // 除了登录页不用判断是都有token，其他页面都需要判断是否有token-->无token跳转到登录页
  if (!whitePaths.includes(to.path)) {
    if (!getToken()) {
      Message.error('请先登录！')
      return next(loginPath)
    }
    // 判断登录后是否有用户信息-->无用户信息跳转到登录页
    if (!store.state.userInfo) {
      userinfo().then(res => {
        if (res.code === 206) {
          Message.error('请重新登录！')
          removeToken()
          return next(loginPath)
        } else {
          // 2.1 判断用户信息中的状态-->status为1表示禁用，跳转到登录页
          if (res.data.status === 0) {
            Message.warning('当前用户处于禁用状态，请联系管理员！')
            return next(loginPath)
          } else {
            // 用户头像缺少基地址
            res.data.avatar = `${process.env.VUE_APP_BASEURL}/${res.data.avatar}`
            // 处理用户的状态
            switch (res.data.role) {
              case '超级管理员':
                res.data.role_id = 1
                break
              case '管理员':
                res.data.role_id = 2
                break
              case '老师':
                res.data.role_id = 3
                break
              case '学生':
                res.data.role_id = 4
                break
            }
            // 将用户的信息保存到store中
            store.commit('setInfo', res.data)
            // 判断用户信息token验证成功
            console.log('Vuex中的数据', store.state.userInfo)
            console.log('角色', to.meta.roles)
            next()
          }
        }
      })
    } else {
      // 有用户信息，执行
      // 判断是否有权限访问
      // 判断元子段中是否有包含有这些角色
      if (to.meta.roles.includes(store.state.userInfo.role)) {
        next()
      } else {
        Message.warning('当前用户没有访问权限！')
      }
    }
  } else {
    next()
  }
})
export default router
