// 常量KEY
const KEY = 'mmtoken'
// 暴露 保存token
export function setToken(token) {
  console.log('token:', token)
  window.localStorage.setItem(KEY, token)
}
// 暴露 获取token
export function getToken() {
  return window.localStorage.getItem(KEY)
}
// 暴露 删除token
export function removeToken() {
  window.localStorage.removeItem(KEY)
}
