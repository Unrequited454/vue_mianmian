<template>
  <div class="edit-user">
    <el-dialog center title="编辑用户" :visible.sync="$parent.editDlVisible" :before-close="cancelEdit">
      <el-form ref="editUserRef" :model="editUserForm" :rules="editUserRul" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="editUserForm.role_id" placeholder="请选择角色">
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="老师" :value="3"></el-option>
            <el-option label="学生" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editUserForm.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input type="textarea" v-model="editUserForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { phoneCheck, emailCheck } from '@/utils/validator.js'
import { userEdit } from '@/api/user.js'
export default {
  name: 'edit-user',
  data() {
    return {
      // 编辑用户表单对象
      editUserForm: {},
      // 编辑用户表单验证规则
      editUserRul: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validater: emailCheck, message: '请输入正确邮箱格式', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validater: phoneCheck, message: '请输入正确手机号码', trigger: 'change' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 取消编辑用户按钮
    cancelEdit() {
      this.$parent.editDlVisible = false
      this.$refs.editUserRef.resetFields()
    },
    // 确定编辑用户按钮
    submitEdit() {
      this.$refs.editUserRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请完善用户信息')
        }
        userEdit(this.editUserForm).then(res => {
          console.log('编辑用户返回结果：', res)
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.$parent.getUserList()
            this.$parent.editDlVisible = false
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.edit-user {
  .el-dialog {
    width: 478px;
    height: 558px;
  }
}
</style>
