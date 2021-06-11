<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>修改商品信息</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>后续完成</h3>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    created() {},
    methods: {},
}
</script>

<style>
</style>