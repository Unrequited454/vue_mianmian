// 导入axios接口
import request from './request.js'

// 暴露 企业列表接口
export function enterpriseList(params) {
  return request({
    url: '/enterprise/list',
    method: 'get',
    params
  })
}

// 暴露 企业添加接口
export function enterpriseAdd(data) {
  return request({
    url: '/enterprise/add',
    method: 'post',
    data
  })
}

// 暴露 企业设置接口
export function enterpriseStatus(statusId) {
  return request({
    url: '/enterprise/status',
    method: 'post',
    data: {
      id: statusId
    }
  })
}

// 暴露 企业删除接口
export function enterpriseRemove(removeId) {
  return request({
    url: '/enterprise/remove',
    method: 'post',
    data: {
      id: removeId
    }
  })
}

// 暴露 企业编辑接口
export function enterpriseEdit(data) {
  return request({
    url: '/enterprise/edit',
    method: 'post',
    data
  })
}
