// 暴露手机验证格式
export function phoneCheck(rule, val, callback) {
  // 验证手机的正则表达式
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  if (regMobile.test(val)) {
    return callback()
  } else {
    return callback(new Error('请输入正确手机号码格式'))
  }
}

// 暴露邮箱验证格式
export function emailCheck(rule, val, callback) {
  // 验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/
  if (regEmail.test(val)) {
    return callback()
  } else {
    return callback(new Error('请输入正确邮箱格式'))
  }
}

// TODO: 暴露勾选同意按钮验证
export function checkedAgree(rule, val, callback) {
  if (val) {
    return callback()
  } else {
    return callback(new Error('请先勾选同意'))
  }
}
