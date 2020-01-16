<template>
  <div class="subject-container">
    <!--头部 卡片区域 -->
    <el-card>
      <el-form :inline="true" :model="subjectForm" class="demo-form-inline" ref="subjectRef">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="subjectForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="subjectForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" @keyup.enter="search">搜索</el-button>
          <el-button @click="resetForm">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addSubject">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主体 卡片区域 -->
    <el-card class="card-main">
      <el-table :data="subjectList" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="rid" label="学科编号" width="180"></el-table-column>
        <el-table-column prop="name" label="学科名称" width="180"></el-table-column>
        <el-table-column prop="intro" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">启用</span>
            <span v-else class="forbidden">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editSubject(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="changeStatus(scope.row)"
            >{{scope.row.status==0?'启用': '禁用'}}</el-button>
            <el-button type="text" @click="removeSubject(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="subjectForm.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="subjectForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加学科对话框 -->
    <add-subject></add-subject>
    <!-- 修改学科对话框 -->
    <edit-subject ref="editSubjectRef"></edit-subject>
  </div>
</template>

<script>
import { subjectList, subjectStatus, subjectRemove } from '@/api/subject.js'
import addSubject from './components/addSubject.vue'
import editSubject from './components/editSubject.vue'
export default {
  components: {
    'add-subject': addSubject,
    'edit-subject': editSubject
  },
  data() {
    return {
      // 学科对象
      subjectForm: {
        // 学科名称
        name: '',
        // 创建者用户名
        username: '',
        status: '',
        // 页码 默认为1
        page: 1,
        // 页尺寸 默认为10
        limit: 10,
        // 学科编号
        rid: ''
      },
      // 学科列表表格
      subjectList: [],
      // 学科列表总数量
      total: 0,
      // 新增学科对话框显示状态
      subjectDlVisible: false,
      // 编辑学科对话框显示状态
      editDlVisible: false
    }
  },
  methods: {
    // 发送请求获取学科列表数据函数
    getSubjectList() {
      subjectList(this.subjectForm).then(res => {
        console.log('学科列表数据', res)
        if (res.code !== 200) {
          return this.$message.warning('获取学科列表失败')
        }
        this.subjectList = res.data.items
        this.total = res.data.pagination.total
      })
    },
    // 搜索学科
    search() {
      console.log('搜索表单：', this.subjectForm)
      this.subjectForm.page = 1
      this.getSubjectList()
    },
    // 清除按钮
    resetForm() {
      // 重置表单
      // TODO:重置表单必须需要加prop
      this.$refs.subjectRef.resetFields()
      this.getSubjectList()
    },
    // 新增学科
    addSubject() {
      this.subjectDlVisible = true
    },
    // 编辑学科
    editSubject(row) {
      this.editDlVisible = true
      this.$refs.editSubjectRef.editSubjectForm = JSON.parse(JSON.stringify(row))
    },
    // 改变状态
    changeStatus(row) {
      subjectStatus(row.id).then(res => {
        if (res.code !== 200) {
          return this.$message.warning('状态改变失败')
        }
        this.$message.success('状态修改成功')
        this.getSubjectList()
      })
    },
    // 删除学科
    async removeSubject(row) {
      let confirmRes = await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'confirm') {
        subjectRemove(row.id).then(res => {
          if (res.code !== 200) {
            return this.$message.warning('删除失败')
          }
          // TODO: 判断当前页数据是否为1，是-->跳转上一页，否不用跳，当前页是第一页时，不同跳转上一页
          if (this.subjectList.length === 1) {
            this.subjectForm.page--
            this.subjectForm.page = this.subjectForm.page === 0 ? 1 : this.subjectForm.page
          }
          this.$message.success('删除成功')
          this.getSubjectList()
        })
      } else {
        this.$message.info('删除已取消')
      }
    },
    // 页码尺寸改变触发
    handleSizeChange(newSize) {
      this.subjectForm.limit = newSize
      this.getSubjectList()
    },
    // 页码改变触发
    handleCurrentChange(newPage) {
      this.subjectForm.page = newPage
      this.getSubjectList()
    }
  },
  created() {
    // 调用请求学科数据函数
    this.getSubjectList()
  }
}
</script>

<style lang="less">
.subject-container {
  width: 100%;
  height: 100%;
}
</style>
