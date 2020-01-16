// 组件-登录页
const login = () => import(/* webpackChunkName:"login" */ '@/views/login/login')
// 组件-首页
const index = () => import(/* webpackChunkName:"index" */ '@/views/index/index')
// 组件-学科
const subject = () => import(/* webpackChunkName:"subject" */ '@/views/index/subject/subject')
// 组件-企业
const enterprise = () => import(/* webpackChunkName:"enterprise" */ '@/views/index/enterprise/enterprise')
// 组件-题库
const question = () => import(/* webpackChunkName:"question" */ '@/views/index/question/question')
// 组件-用户
const user = () => import(/* webpackChunkName:"user" */ '@/views/index/user/user')
// 组件-数据
const chart = () => import(/* webpackChunkName:"chart" */ '@/views/index/chart/chart')

// 配置meta字段
export default [
  // 登录页
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login,
    meta: {
      roles: ['超级管理员', '管理员', '老师', '学生']
    }
  },
  // 首页
  {
    path: '/index',
    component: index,
    redirect: '/index/subject',
    // 嵌套路由
    children: [{
      // 数据概述
      path: '/index/chart',
      component: chart,
      meta: {
        title: '数据概述',
        icon: 'el-icon-pie-chart',
        fullPath: '/index/chart',
        roles: ['超级管理员', '管理员', '老师']
      }
    }, {
      // 用户列表
      path: '/index/user',
      component: user,
      meta: {
        title: '用户列表',
        icon: 'el-icon-user',
        fullPath: '/index/user',
        roles: ['超级管理员', '管理员']
      }
    }, {
      // 题库列表
      path: '/index/question',
      component: question,
      meta: {
        title: '题库列表',
        icon: 'el-icon-edit-outline',
        fullPath: '/index/question',
        roles: ['超级管理员', '管理员', '老师', '学生']
      }
    }, {
      // 企业列表
      path: '/index/enterprise',
      component: enterprise,
      meta: {
        title: '企业列表',
        icon: 'el-icon-notebook-2',
        fullPath: '/index/enterprise',
        roles: ['超级管理员', '管理员', '老师']
      }
    }, {
      // 学科列表
      path: '/index/subject',
      component: subject,
      meta: {
        title: '学科列表',
        icon: 'el-icon-office-building',
        fullPath: '/index/subject',
        roles: ['超级管理员', '管理员', '老师']
      }
    }]
  }
]
