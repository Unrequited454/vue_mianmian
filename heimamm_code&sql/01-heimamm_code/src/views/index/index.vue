<template>
  <el-container class="index-container">
    <!-- 顶栏区域 -->
    <el-header class="header">
      <div class="title-con">
        <span class="icon" @click="collapse">
          <i class="el-icon-s-operation"></i>
        </span>
        <img class="logo" src="../../assets/logo_b.png" />
        <span class="title-desc">黑马面面</span>
      </div>
      <div class="user-info">
        <img class="avatay" :src="userInfo.avatar" />
        <span class="info">{{userInfo.username}}，你好</span>
        <el-button type="primary" size="small" @click="logoutBtn">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-aside width="auto">
          <el-menu
            :collapse="isCollapse"
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            router
          >
            <template v-for="(item, index) in routes[2].children">
              <el-menu-item
                v-if="item.meta.roles.includes($store.state.userInfo.role)"
                :index="item.meta.fullPath"
                :key="index"
              >
                <i :class="item.meta.icon"></i>
                <span slot="title">{{item.meta.title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from '@/utils/token.js'
import { logout, userinfo } from '@/api/login.js'
import routes from '@/router/routes.js'
export default {
  data() {
    return {
      // 侧边栏是否折叠
      isCollapse: false,
      // 路由信息
      routes
    }
  },
  methods: {
    // 退出登录
    async logoutBtn() {
      let confirmRes = await this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消退出登录')
      }
      logout().then(res => {
        if (res.code === 200) {
          this.$message.success('已退出登录')
          this.$router.push('/login')
          removeToken()
          // 将Vuex中的值清空
          this.$store.commit('setInfo', '')
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      userinfo().then(res => {
        console.log('用户信息：', res)
        if (res.code === 200) {
          // 给图片设置基地址
          res.data.avatar = `${process.env.VUE_APP_BASEURL}/${res.data.avatar}`
          this.$store.commit('setInfo', res.data)
        }
      })
    },
    // 侧边栏折叠切换
    collapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    // 处理用户信息
    userInfo() {
      return this.$store.state.userInfo
    }
  }
}
</script>

<style lang="less">
.index-container {
  width: 100%;
  height: 100%;
  // 头部样式
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0px 2px 5px 0px rgba(63, 63, 63, 0.35);
    // 图标
    .icon {
      font-size: 32px;
    }
    .logo {
      width: 33px;
      height: 28px;
      margin: 0 11px 0 22px;
      vertical-align: bottom;
    }
    .title-desc {
      font-size: 22px;
      color: #49a1ff;
    }
    .avatay {
      width: 43px;
      height: 43px;
      border-radius: 50%;
    }
    .info {
      margin: 0 38px 0 9px;
      font-size: 14px;
      font-weight: 600;
      font-family: Microsoft YaHei;
      color: #636363;
    }
  }
  // 侧边栏样式
  .el-container {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      // min-height: 877px;
    }
    .el-aside {
      background-color: #fff;
    }
  }
  .el-menu {
    border-right: 0;
  }
  .el-main {
    background-color: #e8e9ec;
    overflow: hidden;
  }
}
</style>
