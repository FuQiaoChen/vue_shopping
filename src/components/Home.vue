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
            <!--侧边栏  -->
            <el-aside :width="isCollapse? '64px':'200px'">
              <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    background-color="#444c5e"
                    text-color="#fff"
                    active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.id + ''"
                        v-for="item in menuList"
                        :key="item.id"
                    >
                        <template #title>
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="subItem.id + ''"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                        >
                            <template #title>
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--内容区  -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [],
            iconsObj: {
                125: "iconfont icon-user",
                103: "iconfont icon-tijikongjian",
                101: "iconfont icon-shangpin",
                102: "iconfont icon-danju",
                145: "iconfont icon-baobiao",
            },
            isCollapse:false,
        }
    },
    created() {
        this.getMenuList()
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push("/login")
        },
        async getMenuList() {
            const { data: res } = await this.$http.get("menus")
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.menuList = res.data
            // console.log(res)
        },
        toggleCollapse(){
          this.isCollapse=!this.isCollapse
        }
    },
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
.el-menu{
  border-right:0
}
.toggle-button{
background-color: rgb(68, 67, 67);
font-size: 12px;
line-height: 25px;
color: #fff;
text-align: center;
letter-spacing: 0.3em;
cursor: pointer;
 }
</style>