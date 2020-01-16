<template>
  <div class="add-enterprise">
    <el-dialog center title="新增企业" :visible.sync="$parent.addDlVisible" :before-close="cancalAdd">
      <el-form
        ref="addEnterpriseRef"
        :rules="addEnterpriseRul"
        :model="addEnterpriseForm"
        label-width="80px"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="addEnterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="addEnterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="addEnterpriseForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input type="textarea" v-model="addEnterpriseForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="addEnterpriseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalAdd">取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { enterpriseAdd } from '@/api/enterprise.js'
export default {
  name: 'addEnterprise',
  data() {
    return {
      // 新增企业请求参数对象
      addEnterpriseForm: {
        // 企业编号
        eid: '',
        // 企业名称
        name: '',
        // 企业简称
        short_name: '',
        // 企业简介
        intro: '',
        // 备注
        remark: ''
      },
      // 新增企业表单验证
      addEnterpriseRul: {
        eid: [{ required: true, message: '请输入企业编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        short_name: [{ required: true, message: '请输入企业简介', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 确定新增企业
    ensureAdd() {
      this.$refs.addEnterpriseRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请填写完整企业信息')
        }
        enterpriseAdd(this.addEnterpriseForm).then(res => {
          console.log('添加企业：', res)
          if (res.code === 200) {
            this.$parent.addDlVisible = false
            this.$message.success('企业新增成功')
            this.$parent.getEnterpriseList()
            this.$refs.addEnterpriseRef.resetFields()
          } else if (res.code === 201) {
            return this.$message.warning('企业编号已存在')
          } else {
            return this.$message.error('新增企业失败')
          }
        })
      })
    },
    // 取消新增企业
    cancalAdd() {
      this.$parent.addDlVisible = false
    }
  }
}
</script>

<style lang="less">
.add-enterprise {
  .el-dialog {
    width: 600px;
    height: 508px;
  }
}
</style>
