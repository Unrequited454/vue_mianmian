<template>
  <div class="add-user">
    <el-dialog center title="新增用户" :visible.sync="$parent.addDlVisible" :before-close="cancelAdd">
      <el-form ref="addUserRef" :model="addUserForm" :rules="addUserRul" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="addUserForm.role_id" placeholder="请选择角色">
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="老师" :value="3"></el-option>
            <el-option label="学生" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addUserForm.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input type="textarea" v-model="addUserForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAdd } from '@/api/user.js'
import { phoneCheck, emailCheck } from '@/utils/validator.js'
export default {
  name: 'add-user',
  data() {
    return {
      // 添加用户表单
      addUserForm: {
        username: '',
        email: '',
        phone: '',
        role_id: '',
        status: '',
        remark: ''
      },
      // 新增用户表单规则验证
      addUserRul: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: emailCheck, trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: phoneCheck, trigger: 'change' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 确定添加用户
    ensureAdd() {
      this.$refs.addUserRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请完善新增用户必填项')
        }
        userAdd(this.addUserForm).then(res => {
          console.log('新增用户结果:', res)
          if (res.code === 200) {
            this.$message.success('新增用户成功')
            this.$parent.getUserList()
            this.$parent.addDlVisible = false
            this.$refs.addUserRef.resetFields()
          } else {
            return this.$message.error(res.message)
          }
        })
      })
    },
    // 取消添加用户
    cancelAdd() {
      this.$parent.addDlVisible = false
      this.$refs.addUserRef.resetFields()
    }
  }
}
</script>

<style lang="less">
.add-user {
  .el-dialog {
    width: 478px;
    height: 558px;
  }
}
</style>
