<template>
  <div class="enterprise-container">
    <!--头部 卡片区域 -->
    <el-card>
      <el-form :inline="true" :model="enterPriseForm" class="demo-form-inline" ref="enterPriseRef">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="enterPriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterPriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="enterPriseForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="enterPriseForm.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" @keyup.enter="search">搜索</el-button>
          <el-button @click="resetForm">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addEnterPrise">新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主体 卡片区域 -->
    <el-card class="card-main">
      <el-table :data="enterPriseList" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="180"></el-table-column>
        <el-table-column prop="name" label="企业名称" width="180"></el-table-column>
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
            <el-button type="text" @click="editEnterprise(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="changeStatus(scope.row)"
            >{{scope.row.status===0?'启用':'禁用'}}</el-button>
            <el-button type="text" @click="removeEnterprise(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="enterPriseForm.page"
        :page-sizes="[5, 8, 15, 20]"
        :page-size="enterPriseForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 新增企业对话框 -->
    <add-enterprise></add-enterprise>
    <!-- 编辑企业对话框 -->
    <edit-enterprise ref="editEnterpriseRef"></edit-enterprise>
  </div>
</template>

<script>
import addEnterprise from './components/addEnterprise.vue'
import editEnterprise from './components/editEnterprise.vue'
import { enterpriseList, enterpriseStatus, enterpriseRemove } from '@/api/enterprise'
export default {
  name: 'enterprise',
  components: {
    // 新增企业组件
    'add-enterprise': addEnterprise,
    // 编辑企业组件
    'edit-enterprise': editEnterprise
  },
  data() {
    return {
      // 企业表单
      enterPriseForm: {
        name: '',
        page: 1,
        limit: 8,
        eid: '',
        username: '',
        status: ''
      },
      // 企业数据列表
      enterPriseList: [],
      // 企业列表总条数
      total: 0,
      // 新增企业对话框显示状态
      addDlVisible: false,
      // 编辑企业对话框显示状态
      editDlVisible: false
    }
  },
  methods: {
    // 声明请求企业列表数据函数
    getEnterpriseList() {
      enterpriseList(this.enterPriseForm).then(res => {
        console.log('企业列表：', res)
        if (res.code === 200) {
          this.enterPriseList = res.data.items
          this.total = res.data.pagination.total
        }
      })
    },
    // 搜索
    search() {
      // 跳转到页码1
      this.enterPriseForm.page = 1
      this.getEnterpriseList()
    },
    // 清除
    resetForm() {
      this.$refs.enterPriseRef.resetFields()
      this.getEnterpriseList()
    },
    // 新增企业
    addEnterPrise() {
      this.addDlVisible = true
    },
    // 编辑企业
    editEnterprise(row) {
      this.editDlVisible = true
      // 深拷贝并赋值给组件的表单对象
      this.$refs.editEnterpriseRef.editEnterpriseForm = JSON.parse(JSON.stringify(row))
    },
    // 修改企业状态
    changeStatus(row) {
      enterpriseStatus(row.id).then(res => {
        console.log('企业状态修改：', res)
        if (res.code === 200) {
          this.$message.success('状态修改成功')
          this.getEnterpriseList()
        } else {
          return this.$message.error('状态修改失败')
        }
      })
    },
    // 删除企业
    async removeEnterprise(row) {
      let confirmRes = await this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'confirm') {
        enterpriseRemove(row.id).then(res => {
          console.log('删除企业：', res)
          if (res.code === 200) {
            // TODO:判断当前页中数据，若数据为1，删完当前页无数据，跳转前一页，若数据大于1，删完后无须跳转前一页，当当前页处于第一页时，删完后无数据让页码强制为1
            if (this.enterPriseList.length === 1) {
              this.enterPriseForm.page--
              this.enterPriseForm.page = this.enterPriseForm.page === 0 ? 1 : this.enterPriseForm.page
            }
            this.$message.success('删除成功')
            this.getEnterpriseList()
          } else {
            return this.$message.error('删除失败')
          }
        })
      } else {
        return this.$message.info('已取消删除企业')
      }
    },
    // 分页-页码尺寸改变时触发
    handleSizeChange(newSize) {
      this.enterPriseForm.limit = newSize
      this.getEnterpriseList()
    },
    // 分页-当前页码改变时触发
    handleCurrentChange(newPage) {
      this.enterPriseForm.page = newPage
      this.getEnterpriseList()
    }
  },
  created() {
    this.getEnterpriseList()
  }
}
</script>

<style lang="less">
.enterprise-container {
  width: 100%;
  height: 100%;
}
</style>
