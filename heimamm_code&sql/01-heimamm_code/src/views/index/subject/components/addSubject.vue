<template>
  <div class="add-dialog">
    <el-dialog
      center
      title="新增学科"
      :visible.sync="$parent.subjectDlVisible"
      :before-close="cancelAddSubject"
    >
      <el-form
        ref="addSubjectRef"
        :rules="addSubjectRul"
        :model="addSubjectForm"
        label-width="80px"
      >
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="addSubjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="addSubjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="addSubjectForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input type="textarea" v-model="addSubjectForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="addSubjectForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddSubject">取 消</el-button>
        <el-button type="primary" @click="ensureAddSubject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { subjectAdd } from '@/api/subject.js'
export default {
  name: 'addSubject',
  data() {
    return {
      // 新增学科对象请求参数
      addSubjectForm: {
        // 学科编号--必传
        rid: '',
        // 学科名称--必传
        name: '',
        // 学科简称
        short_name: '',
        // 学科简介
        intro: '',
        // 备注
        remark: ''
      },
      // 新增学科表单验证
      addSubjectRul: {
        rid: [{ required: true, message: '请输入学科编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 取消新增学科取消按钮
    cancelAddSubject() {
      this.$parent.subjectDlVisible = false
      this.$refs.addSubjectRef.resetFields()
    },
    // 确认新增学科
    ensureAddSubject() {
      this.$refs.addSubjectRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请完善学科信息')
        }
        subjectAdd(this.addSubjectForm).then(res => {
          console.log('新增学科：', res)
          if (res.code === 200) {
            this.$message.success('新增学科成功')
            this.$parent.getSubjectList()
            this.$parent.subjectDlVisible = false
            this.$refs.addSubjectRef.resetFields()
          } else if (res.code === 201) {
            this.$message.warning('学科编号已存在')
          } else {
            this.$message.error('新增学科失败')
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.add-dialog {
  .el-dialog {
    width: 600px;
    height: 508px;
  }
}
</style>
