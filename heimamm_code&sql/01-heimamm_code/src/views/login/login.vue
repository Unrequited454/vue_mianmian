<template>
  <div class="login-container">
    <div class="login">
      <!-- 登录title -->
      <div class="title-con">
        <img src="../../assets/logo.png" alt />
        <div class="title">黑马面面</div>
        <div class="line"></div>
        <div class="sub-title">用户登录</div>
      </div>
      <!-- 登录form -->
      <el-form ref="loginRef" :model="loginForm" class="login-form" :rules="loginRules">
        <el-form-item prop="phone">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.phone"
            size="large"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="17">
            <el-form-item prop="code">
              <el-input prefix-icon="el-icon-key" v-model="loginForm.code" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <img :src="loginActions" alt="验证码" class="captcha" @click="loginCaptcha" />
          </el-col>
        </el-row>
        <el-form-item class="check" prop="checked">
          <el-checkbox v-model="loginForm.checked">
            我已阅读并同意
            <el-link type="primary">用户协议</el-link>和
            <el-link type="primary">隐私协议</el-link>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginBtn">登录</el-button>
          <el-button class="btn-register" @click="registerBtn">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <img src="../../assets/images/login_banner_ele.png" />
    <!-- 注册对话框 -->
    <el-dialog
      title="用户注册"
      :visible.sync="registerDlVisible"
      :before-close="closeRegister"
      class="register-dialog"
      center
    >
      <!-- 注册表单 -->
      <el-form
        ref="registerRef"
        :model="registerForm"
        :rules="registerRul"
        label-width="70px"
        :label-position="'left'"
      >
        <el-form-item label="头像" prop="avatar">
          <el-upload
            name="image"
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="picUrl" :src="picUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="图形码" prop="code">
              <el-input v-model="registerForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <img :src="registerActions" alt="验证码" class="captcha" @click="registerCaptcha" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="验证码" prop="rcode">
              <el-input v-model="registerForm.rcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-button @click="getCaptcha">{{delayTime ===0?'获取用户验证码': `${delayTime}S`}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRegister">取 消</el-button>
        <el-button type="primary" @click="ensureRegister">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setToken } from '@/utils/token.js'
import { login, sendsms, register, userinfo } from '@/api/login.js'
import { phoneCheck, emailCheck, checkedAgree } from '@/utils/validator'
export default {
  data() {
    return {
      // 登录表单对象
      loginForm: {
        phone: '18522222222',
        password: '12345678',
        code: '',
        checked: false
      },
      // 登录输入框规则验证
      loginRules: {
        // 号码输入框
        phone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }, { validator: phoneCheck }],
        // 密码
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 12, message: '密码长度为6~12个字符', trigger: 'change' }],
        // 验证码
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }, { min: 4, max: 4, message: '验证码长度为4', trigger: 'change' }],
        // 勾选
        checked: [{ validator: checkedAgree }]
      },
      // 登录验证码
      loginActions: process.env.VUE_APP_BASEURL + '/captcha?type=login',
      // 注册验证码
      registerActions: process.env.VUE_APP_BASEURL + '/captcha?type=sendsms',
      // 注册对话框状态显示
      registerDlVisible: false,
      // 注册表单对象
      registerForm: {
        username: '',
        phone: '',
        email: '',
        // 头像图片地址
        avatar: '',
        password: '',
        rcode: '',
        // 注册图形验证码
        code: ''
      },
      // 头像地址
      imgUrl: process.env.VUE_APP_BASEURL + '/uploads',
      // 头像预览
      picUrl: '',
      // 注册表单验证
      registerRul: {
        // 头像验证
        avatar: [{ required: true, message: '请上传图像', trigger: 'change' }],
        // 昵称验证
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        // 邮箱验证
        email: [{ required: true, message: '邮箱号不能为空', trigger: 'blur' }, { validator: emailCheck }],
        // 手机验证
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { validator: phoneCheck }],
        // 密码
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 12, message: '密码长度为6~12个字符' }],
        // 图形码
        code: [{ required: true, message: '图形码不能为空', trigger: 'blur' }, { min: 4, max: 4, message: '验证码长度为4' }],
        // 验证码
        rcode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      // 获取手机验证码按钮状态
      delayTime: 0
    }
  },
  methods: {
    // 更换验证码
    loginCaptcha() {
      this.loginActions = this.loginActions + '&_t=' + Math.random()
    },
    // 按钮-登录
    loginBtn() {
      this.$refs.loginRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入正确登录信息')
        } else {
          login(this.loginForm).then(res => {
            if (res.code === 200) {
              console.log('用户登录', res)
              userinfo().then(res => {
                if (res.data.status === 1) {
                  this.$message.success('登录成功')
                }
              })
              setToken(res.data.token)
              this.$router.push('/index')
            } else if (res.code === 202) {
              let tip = { 验证码错误: '验证码错误', 登录密码不匹配: '手机号码或密码错误' }
              this.$message.error(tip[res.message])
            }
          })
        }
      })
    },
    // 按钮-注册
    registerBtn() {
      // 让验证码清空
      this.registerDlVisible = true
    },
    // 按钮-注册取消关闭按钮
    closeRegister() {
      this.registerDlVisible = false
      this.picUrl = ''
      this.$refs.registerRef.resetFields()
    },
    // 头像上传成功
    handleAvatarSuccess(res, file) {
      // 头像上传成功预览
      this.picUrl = URL.createObjectURL(file.raw)
      if (res.code === 200) {
        this.$message.success('头像上传成功')
        this.registerForm.avatar = res.data.file_path
      } else {
        return this.$message.error('头像上传失败，请重新上传')
      }
    },
    // 头像上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // 限制头像上传格式
      if (!isJPG) {
        this.$message.error('上传头像图片只能为jpg格式')
      }
      // 限制头像上传大小
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB！')
      }
      return isJPG && isLt2M
    },
    // 注册更换验证码
    registerCaptcha() {
      this.registerActions = this.registerActions + '&_t=' + Math.random()
    },
    // 获取验证码
    getCaptcha() {
      // 先判断图形验证码是否有输入以及手机号码格式
      if (this.registerForm.code.length !== 4) {
        return this.$message.warning('验证码有误')
      }
      // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regMobile.test(this.registerForm.phone)) {
        return this.$message.warning('手机号码格式有误')
      }
      sendsms({ code: this.registerForm.code, phone: this.registerForm.phone }).then(res => {
        if (res.code === 200) {
          if (this.delayTime === 0) {
            this.delayTime = 15
            let timeId = setInterval(() => {
              this.delayTime--
              if (this.delayTime === 0) {
                clearInterval(timeId)
              }
            }, 1000)
          }
          this.registerForm.rcode = res.data.captcha
        } else {
          return this.$message.error(res.message)
        }
      })
    },
    // 按钮-确定注册
    ensureRegister() {
      this.$refs.registerRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请完善注册信息')
        }
        console.log('注册参数：', this.registerForm)
        register(this.registerForm).then(res => {
          console.log('注册用户res:', res)
          if (res.code === 200) {
            this.registerDlVisible = false
            this.$refs.registerRef.resetFields()
            this.picUrl = ''
            this.$message.success('注册成功')
          } else if (res.code === 201) {
            return this.$message.warning(res.message)
          } else {
            return this.$message.error('注册失败')
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.login-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: linear-gradient(225deg, rgba(1, 198, 250, 1), rgba(20, 147, 250, 1));
}
// login样式
.login {
  width: 478px;
  height: 550px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  padding: 0 41px 43px;

  // title-con样式
  .title-con {
    display: flex;
    align-items: center;
    padding: 44px 0 27px 48px;
    color: #0c0c0c;

    img {
      width: 22px;
      height: 17px;
    }

    .title {
      margin-left: 16px;
      font-size: 24px;
      font-weight: 400;
      font-family: SourceHanSansCN;
    }

    .line {
      width: 1px;
      height: 28px;
      margin: 0 12px 0 14px;
      background-color: #c7c7c7;
    }

    .sub-title {
      font-size: 22px;
      font-weight: 400;
      font-family: PingFangSC;
    }
  }

  // form样式
  .login-form {
    .el-form-item {
      margin-bottom: 25px;
    }
    .check {
      margin-bottom: 0;
    }
    .el-input__inner {
      height: 45px;
    }
    .captcha {
      height: 40px;
      width: 100%;
    }
    .el-checkbox {
      margin-top: 7px;
    }
    .el-form-item__content {
      line-height: 0;
    }
    .btn-login {
      width: 100%;
      margin-top: 28px;
    }
    .el-link {
      vertical-align: top;
    }
    .btn-register {
      width: 100%;
      margin: 26px 0 0;
    }
  }
}
// 注册对话框样式
.register-dialog {
  .el-dialog {
    width: 600px;
  }
  // 头像样式
  .avatar-uploader {
    display: flex;
    justify-content: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .captcha {
    width: 143px;
    height: 40px;
  }
}
</style>
