<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="访问路径" prop="path"> </el-table-column>
        <el-table-column label="权限层级" prop="level">
          <template #="bb">
            <el-tag v-if="bb.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="bb.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表获取失败')
      }
      // console.log(res.data)
      this.rightsList = res.data
    }
  }
}
</script>

<style></style>
