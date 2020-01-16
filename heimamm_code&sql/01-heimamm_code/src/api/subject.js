// 导入request接口
import request from './request.js'

// 暴露 学科列表接口
export function subjectList(params) {
  return request({
    url: '/subject/list',
    method: 'get',
    params
  })
}

// 暴露 添加学科接口
export function subjectAdd(data) {
  return request({
    url: '/subject/add',
    method: 'post',
    data
  })
}

// 暴露 学科状态接口
export function subjectStatus(statusId) {
  return request({
    url: '/subject/status',
    method: 'post',
    data: {
      id: statusId
    }
  })
}

// 暴露 学科编辑接口
export function subjectEdit(data) {
  return request({
    url: '/subject/edit',
    method: 'post',
    data
  })
}

// 暴露 学科删除接口
export function subjectRemove(subjectId) {
  return request({
    url: '/subject/remove',
    method: 'post',
    data: {
      id: subjectId
    }
  })
}
