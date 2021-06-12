<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏  绑定width的值随isCollapse的值变化而变化-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- :collapse-transition="false"前的‘：’是为了把后面的false解释为布尔值 -->
        <el-menu background-color="#444c5e" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 index须为唯一值 且为string类型-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区（插槽） -->
            <template #title>
              <!-- 图标 动态绑定自定义图标-->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 动态绑定一级菜单名-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 把索引号设为数据中的path值（router默认跳转路径），而数据中的path中并无/,故需加上-->

            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单模板区（插槽） -->
              <template #title>
                <!-- 图标 固定-->
                <i class="el-icon-menu"></i>
                <!-- 文本 动态绑定二级菜单名-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--内容区  -->
      <el-main>
        <!-- 为welcome页面设置路由占位符(重定向) -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [], //左侧菜单数据
      iconsObj: {
        //自定义菜单图标，key用索引号，value用element-plus的图标名
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false, //是否折叠设置
      activePath: '' //被激活的链接地址
    }
  },
  created() {
    //项目建立后马上获取菜单列表
    this.getMenuList()
    //刷新后获取sessionStorage中保存的activePath值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //请求获取所有菜单项方法
    async getMenuList() {
      //axios的get方法返回的是promise，用async与await来简化取值，否则需用.then函数
      const { data: res } = await this.$http.get('menus') //解构data并重命名为res
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    toggleCollapse() {
      //折叠事件方法
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态，要保存到sessionStorage中，这样在页面刷新后依然能用
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //每次点击时重新赋值
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(49, 55, 67);
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #fff;
  padding-left: 20px;
  align-items: center;
  img {
    height: 50px;
    vertical-align: middle;
  }
  span {
    margin-left: 15px;
  }
  .el-button {
    margin-right: 40px;
  }
}
.el-aside {
  background-color: rgb(68, 76, 94);
}
.el-main {
  background-color: rgb(236, 230, 230);
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: rgb(68, 67, 67);
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
