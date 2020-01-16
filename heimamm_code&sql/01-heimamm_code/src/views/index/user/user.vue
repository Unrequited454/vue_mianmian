<template>
  <div class="user-container">
    <!--头部 卡片区域 -->
    <el-card>
      <el-form :inline="true" :model="userForm" class="demo-form-inline" ref="userRef">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="userForm.role_id" placeholder="请选择角色">
            <el-option label="管理员" value="2">管理员</el-option>
            <el-option label="老师" value="3">老师</el-option>
            <el-option label="学生" value="4">学生</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addUser">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主体 卡片区域 -->
    <el-card class="card-main">
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-else class="forbidden">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.role_id ===1">
              <el-button disabled type="text" @click="editUser(scope.row)">编辑</el-button>
              <el-button
                type="text"
                disabled
                @click="changeStatus(scope.row)"
              >{{scope.row.status===0?'启用':'禁用'}}</el-button>
              <el-button disabled type="text" @click="removeUser(scope.row)">删除</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="changeStatus(scope.row)"
              >{{scope.row.status===0?'启用':'禁用'}}</el-button>
              <el-button type="text" @click="removeUser(scope.row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userForm.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="userForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 新增用户对话框区域 -->
    <add-user></add-user>
    <!-- 编辑用户对话框区域 -->
    <edit-user ref="editUserRef"></edit-user>
  </div>
</template>

<script>
import addUser from './components/addUser.vue'
import editUser from './components/editUser.vue'
import { userList, userStatus, userRemove } from '@/api/user.js'
export default {
  name: 'user',
  components: {
    'add-user': addUser,
    'edit-user': editUser
  },
  data() {
    return {
      // 用户表单
      userForm: {
        // 昵称
        username: '',
        // 邮箱
        email: '',
        // 角色数字
        role_id: '',
        // 页码，默认为1
        page: 1,
        // 页尺寸,默认为10
        limit: 10
      },
      // 用户数据列表
      userList: [],
      // 用户数据列表总条数
      total: 0,
      // 添加用户对话框显示状态
      addDlVisible: false,
      // 编辑用户对话框显示状态
      editDlVisible: false
    }
  },
  methods: {
    // 声明发送请求获取用户列表数据
    getUserList() {
      userList(this.userForm).then(res => {
        console.log('用户列表：', res)
        if (res.code === 200) {
          this.userList = res.data.items
          this.total = res.data.pagination.total
        }
      })
    },
    // 搜索按钮
    search() {
      this.userForm.page = 1
      this.getUserList()
    },
    // 清除按钮
    reset() {
      this.$refs.userRef.resetFields()
      this.getUserList()
    },
    // 新增用户按钮
    addUser() {
      this.addDlVisible = true
    },
    // 编辑用户按钮
    editUser(row) {
      this.editDlVisible = true
      this.$refs.editUserRef.editUserForm = JSON.parse(JSON.stringify(row))
    },
    // 改变用户状态
    changeStatus(row) {
      userStatus(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('状态修改成功')
          this.getUserList()
        } else {
          return this.$message.error('状态修改失败')
        }
      })
    },
    // 删除用户
    async removeUser(row) {
      let confirmRes = await this.$confirm('是否永久删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'confirm') {
        userRemove(row.id).then(res => {
          if (res.code === 200) {
            if (this.userList.length === 1) {
              this.userForm.page--
              this.userForm.page = this.userForm.page === 0 ? 1 : this.userForm.page
            }
            this.$message.success('删除用户成功')
            this.getUserList()
          } else {
            return this.$message.error('删除用户失败')
          }
        })
      } else {
        return this.$message.info('已取消删除用户')
      }
    },
    // 分页-页尺寸改变触发
    handleSizeChange(newSize) {
      this.userForm.limit = newSize
      this.getUserList()
    },
    // 分页-页码改变触发
    handleCurrentChange(newPage) {
      this.userForm.page = newPage
      this.getUserList()
    }
  },
  created() {
    // 调用获取用户列表数据函数
    this.getUserList()
  }
}
</script>

<style lang="less">
.user-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
