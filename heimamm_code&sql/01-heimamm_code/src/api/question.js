// 导入axios接口
import request from './request'

// 暴露 题目列表接口
export function questionList(params) {
  return request({
    url: '/question/list',
    method: 'get',
    params
  })
}

// 暴露 题目发布接口
export function questionAdd(data) {
  return request({
    url: '/question/add',
    method: 'post',
    data
  })
}

// 暴露 获取题目信息接口
export function questionOne(questionId) {
  return request({
    url: '/question/one',
    method: 'post',
    data: {
      id: questionId
    }
  })
}

// 暴露 题目状态接口
export function questionStatus(statusId) {
  return request({
    url: '/question/status',
    method: 'post',
    data: {
      id: statusId
    }
  })
}

// 暴露 删除题目接口
export function questionRemove(removeId) {
  return request({
    url: '/question/remove',
    method: 'post',
    data: {
      id: removeId
    }
  })
}

// 暴露 题目编辑接口
export function questionEdit(data) {
  return request({
    url: '/question/edit',
    method: 'post',
    data
  })
}

// 暴露 题目上传文件接口
export function questionUpload(fileUrl) {
  return request({
    url: '/question/upload',
    method: 'post',
    data: {
      file: fileUrl
    }
  })
}
