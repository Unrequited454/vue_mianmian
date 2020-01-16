<template>
  <div class="edit-enterprise">
    <el-dialog center title="编辑企业" :visible.sync="$parent.editDlVisible" :before-close="cancalEdit">
      <el-form
        ref="editEnterpriseRef"
        :rules="editEnterpriseRul"
        :model="editEnterpriseForm"
        label-width="80px"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input disabled v-model="editEnterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="editEnterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="editEnterpriseForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input type="textarea" v-model="editEnterpriseForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="editEnterpriseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalEdit">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { enterpriseEdit } from '@/api/enterprise.js'
export default {
  name: 'edit-enterprise',
  data() {
    return {
      // 编辑企业表单对象
      editEnterpriseForm: {},
      //   编辑企业表单验证规则
      editEnterpriseRul: {
        eid: [{ required: true }],
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 取消编辑企业
    cancalEdit() {
      this.$parent.editDlVisible = false
      this.$refs.editEnterpriseRef.resetFields()
    },
    // 确定编辑企业
    submitEdit() {
      this.$refs.editEnterpriseRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请完善企业信息')
        }
        enterpriseEdit(this.editEnterpriseForm).then(res => {
          console.log('编辑企业返回结果：', res)
          if (res.code === 200) {
            this.$message.success('企业信息修改成功')
            this.$parent.editDlVisible = false
            this.$parent.getEnterpriseList()
          } else {
            return this.$message.error('企业信息修改失败')
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.edit-enterprise {
  .el-dialog {
    width: 600px;
    height: 508px;
  }
}
</style>
