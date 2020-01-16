<template>
  <div class="edit-dialog">
    <el-dialog
      center
      title="编辑学科"
      :visible.sync="$parent.editDlVisible"
      :before-close="cancelEditSubject"
    >
      <el-form
        ref="editSubjectRef"
        :rules="editSubjectRul"
        :model="editSubjectForm"
        label-width="80px"
      >
        <el-form-item label="学科编号" prop="rid">
          <el-input disabled v-model="editSubjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="editSubjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="editSubjectForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input type="textarea" v-model="editSubjectForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="editSubjectForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditSubject">取 消</el-button>
        <el-button type="primary" @click="submitEditSubject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { subjectEdit } from '@/api/subject.js'
export default {
  name: 'editSubject',
  data() {
    return {
      // 编辑表单对象
      editSubjectForm: {},
      // 表单验证规格
      editSubjectRul: {
        rid: [{ required: true }],
        name: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 取消编辑按钮
    cancelEditSubject() {
      this.$parent.editDlVisible = false
      this.$refs.editSubjectRef.resetFields()
    },
    // 确定编辑按钮
    submitEditSubject() {
      subjectEdit(this.editSubjectForm).then(res => {
        console.log('编辑返回结果', res)
        if (res.code === 200) {
          this.$message.success('学科修改成功')
          this.$parent.editDlVisible = false
          this.$parent.getSubjectList()
        } else if (res.code === 201) {
          return this.$message.warning('学科名称不能为空')
        } else {
          return this.$message.error('学科修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less">
.edit-dialog {
  .el-dialog {
    width: 600px;
    height: 508px;
  }
}
</style>
