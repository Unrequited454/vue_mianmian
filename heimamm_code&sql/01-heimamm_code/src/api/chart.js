// 导入axios接口
import request from './request'

// 数据面板接口
export function dataTitle() {
  return request({
    url: '/data/title',
    method: 'post'
  })
}

// 企业题目统计
export function dataEnterprise() {
  return request({
    url: '/data/statistics',
    method: 'post'
  })
}

// 热门城市
export function dataHotCity() {
  return request({
    url: '/data/hot_cities',
    method: 'post'
  })
}
