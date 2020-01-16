// 导入request接口
import request from './request.js'

// 获取用户列表
export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 暴露 添加用户接口
export function userAdd(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 暴露设置用户状态接口
export function userStatus(statusId) {
  return request({
    url: '/user/status',
    method: 'post',
    data: {
      id: statusId
    }
  })
}

// 暴露删除用户接口
export function userRemove(removeId) {
  return request({
    url: '/user/remove',
    method: 'post',
    data: {
      id: removeId
    }
  })
}

// 暴露编辑用户接口
export function userEdit(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}
