// 导入 request接口对象
import request from './request.js'

// 登录接口
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 短信接口
export function sendsms(data) {
  return request({
    url: '/sendsms',
    method: 'post',
    data
  })
}

// 用户注册接口
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function userinfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
