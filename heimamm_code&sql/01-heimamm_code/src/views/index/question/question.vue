<template>
  <div class="question-container">
    <!-- 头部 卡片区域 -->
    <el-card>
      <el-form :inline="true" ref="questionRef" :model="questionForm" class="demo-form-inline">
        <el-row>
          <el-col>
            <el-form-item label="学科" prop="subject">
              <el-select v-model="questionForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="(item, index) in subjectData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="阶段" prop="step">
              <el-select v-model="questionForm.step" placeholder="请选择阶段">
                <el-option label="初级" :value="1"></el-option>
                <el-option label="中级" :value="2"></el-option>
                <el-option label="高级" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="questionForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="(item, index) in enterpriseData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题型" prop="type">
              <el-select v-model="questionForm.type" placeholder="请选择题型">
                <el-option label="单选" :value="1"></el-option>
                <el-option label="多选" :value="2"></el-option>
                <el-option label="简单" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="questionForm.difficulty" placeholder="请选择难度">
                <el-option label="简单" value="1"></el-option>
                <el-option label="一般" value="2"></el-option>
                <el-option label="困难" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="username">
              <el-input v-model="questionForm.username"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="questionForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="questionForm.create_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="标题" prop="title">
              <el-input class="input-title" v-model="questionForm.title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">清除</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addQuestionBtn">新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 主体 卡片区域 -->
    <el-card class="card-main">
      <el-table :data="questionData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="title" label="题目" width="180">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科、阶段" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.subject_name + '.' + {1: '初级', 2: '中级', 3: '高级'}[scope.row.step]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span>{{{1: '单选', 2: '多选', 3: '简答'}[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">启用</span>
            <span v-else class="forbidden">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editQuestion(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="changeStatus(scope.row)"
            >{{scope.row.status===1?'启用':'禁用'}}</el-button>
            <el-button type="text" @click="removeQuestion(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="questionForm.page"
        :page-sizes="[5, 10, 16, 22]"
        :page-size="questionForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 新增试题对话框组件 -->
    <add-question></add-question>
    <!-- 编辑试题对话框组件 -->
    <edit-qeustion ref="editQuestionRef"></edit-qeustion>
  </div>
</template>

<script>
// 导入新增试题组件
import addQuestion from './components/addQuestion.vue'
import editQuestion from './components/editQuestion.vue'
import { questionList, questionRemove, questionStatus } from '@/api/question.js'
// 导入subject
import { subjectList } from '@/api/subject.js'
// 导入enterprise
import { enterpriseList } from '@/api/enterprise.js'
export default {
  name: 'question',
  components: {
    'add-question': addQuestion,
    'edit-qeustion': editQuestion
  },
  data() {
    return {
      // 题库表单
      questionForm: {
        // 页码，默认为1
        page: 1,
        // 页尺寸，默认为10
        limit: 10
      },
      // 学科数据
      subjectData: [],
      // 企业数据
      enterpriseData: [],
      // 题库列表数据
      questionData: [],
      // 题库列表总条数
      total: 0,
      // 新增题目对话框显示状态
      addDlvisible: false,
      // 编辑题库对话框显示状态
      editDlvisible: false
    }
  },
  methods: {
    // 声明发送请求获取学科数据函数
    getSubjectList() {
      subjectList().then(res => {
        console.log('试题列表获取学科数据：', res)
        if (res.code === 200) {
          this.subjectData = res.data.items
        } else {
          return this.$message.error('获取学科数据列表失败！')
        }
      })
    },
    // 声明发送请求获取企业数据函数
    getEnterpriseList() {
      enterpriseList().then(res => {
        console.log('试题列表中企业数据：', res)
        if (res.code === 200) {
          this.enterpriseData = res.data.items
        }
      })
    },
    // 声明发送请求题库数据函数
    getQuestionList() {
      questionList(this.questionForm).then(res => {
        console.log('题库列表', res)
        if (res.code === 200) {
          this.questionData = res.data.items
          this.total = res.data.pagination.total
        } else {
          return this.$message.error('获取题库列表失败')
        }
      })
    },
    // 搜索题型按钮
    search() {
      this.questionForm.page = 1
      this.getQuestionList()
    },
    // 清除题型搜索
    reset() {
      this.$refs.questionRef.resetFields()
      this.questionForm.page = 1
      this.getQuestionList()
    },
    // 新增题库按钮
    addQuestionBtn() {
      this.addDlvisible = true
    },
    // 编辑题库按钮
    editQuestion(row) {
      this.editDlvisible = true
      let editForm = JSON.parse(JSON.stringify(row))
      // 多选项需要传入一个数组，因返回的多选中是一个字符串，需转换为数组
      editForm.multiple_select_answer = editForm.multiple_select_answer.split(',').filter(item => {
        return item !== ''
      })
      // 城市也是需要传入一个数组，返回的城市是一个字符串，需转换为数组
      editForm.city = editForm.city.split(',')
      // 处理选项的顺序
      let selectOptions = []
      editForm.select_options.forEach(item => {
        switch (item.label) {
          case 'A':
            selectOptions[0] = item
            break
          case 'B':
            selectOptions[1] = item
            break
          case 'C':
            selectOptions[2] = item
            break
          case 'D':
            selectOptions[3] = item
            break
        }
      })
      editForm.select_options = selectOptions
      this.$refs.editQuestionRef.editQuestionForm = editForm
    },
    // 删除题型按钮
    async removeQuestion(row) {
      let confirmRes = await this.$confirm('是否永久删除该题型', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'confirm') {
        questionRemove(row.id).then(res => {
          if (res.code === 200) {
            if (this.questionData.length === 1) {
              this.questionForm.page--
              this.questionForm.page = this.questionForm.page === 0 ? 1 : this.questionForm.page
            }
            this.$message.success('删除成功')
            this.getQuestionList()
          } else {
            return this.$message.error('删除失败')
          }
        })
      } else {
        return this.$message.info('已取消删除')
      }
    },
    // 改变题型状态
    changeStatus(row) {
      questionStatus(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('状态更改成功')
          this.getQuestionList()
        } else {
          return this.$message.error('状态更改失败')
        }
      })
    },
    // 分页-页尺寸改变触发
    handleSizeChange(newSize) {
      this.questionForm.limit = newSize
      this.getQuestionList()
    },
    // 分页-当前页码改变触发
    handleCurrentChange(newPage) {
      this.questionForm.page = newPage
      this.getQuestionList()
    }
  },
  created() {
    // 调用学科请求数据函数
    this.getSubjectList()
    // 调用企业请求数据函数
    this.getEnterpriseList()
    // 调用题库请求数据函数
    this.getQuestionList()
  }
}
</script>

<style lang="less">
.question-container {
  width: 100%;
  height: 100%;
  .el-card {
    .el-form-item {
      margin-right: 30px;
      .el-input {
        width: 150px;
      }
      .input-title {
        width: 388px;
      }
    }
    .el-form-item__label {
      padding-right: 30px;
    }
  }
}
</style>
