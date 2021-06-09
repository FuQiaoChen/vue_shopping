<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类列表区  -->            
            <el-tree
                :data="cateList"
                :props="defaultProps"
                node-key="id"
                @node-click="handleNodeClick">
                <template #default="{ node, data }">
                    <span class="custom-tree-node" style="hight: 30px; border-top: 1px solid rgb(226, 225, 225);">
                       
                        <span >{{ node.label }}</span>
                        <span >
                            <i class="el-icon-success" v-if="data.cat_deleted===false" style="color:lightgreen;">有效</i>
                            <i class="el-icon-error" v-else style="color:lightgreen;">无效</i>
                        </span>
                        <span >
                            <el-tag size="mini" v-if="data.cat_level===0">一级</el-tag>
                            <el-tag size="mini" type="success" v-else-if="data.cat_level===1">二级</el-tag>
                            <el-tag size="mini" type="warning" v-else>三级</el-tag>
                        </span>    
                        <span>                            
                            <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-edit"
                                @click="append(data)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="remove(node, data)"
                                >删除</el-button
                            >
                        </span>
                    </span>
                </template>
            </el-tree>           
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3,5,10,15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <el-row></el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: { type: 3, pagenum: 1, pagesize: 5 }, //查询参数
            cateList: [],
            total: 0,
            defaultProps: {
                children: "children",
                label: "cat_name",
            },
            cateCurrentData: [],
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败")
            }
            this.cateList = res.data.result
            this.total = res.data.total //总数据条数赋值
            // console.log(this.cateList);
        },
        handleSizeChange(newVal) {
            this.queryInfo.pagesize=newVal
            this.getCateList()
            // console.log(`每页 ${newVal} 条`);
        },
        handleCurrentChange(newVal) {
            this.queryInfo.pagenum=newVal
            this.getCateList()
        //  console.log(`当前页: ${val}`);
        },



        handleNodeClick(data) {
            // console.log(data);
            this.cateCurrentData = data
        },
        append(data) {
            // console.log(data);
            // const newChild = { id: id++, label: 'testtest', children: [] };
            // if (!data.children) {
            // data.children = []
            // }
            // data.children.push(newChild);
            // this.data = [...this.data]
        },
        remove(node, data) {
            console.log(node, data)
            // const parent = node.parent;
            // const children = parent.data.children || parent.data;
            // const index = children.findIndex(d => d.id === data.id);
            // children.splice(index, 1);
            // this.data = [...this.data]
        },
    },
}
</script>

<style scoped>
.el-tree-node__content {  
    display: flex;    
    -ms-flex-align: center;
    align-items: center;
    height: 40px !important;
     line-height: 30px !important; 
   
}
.el-row{
    margin-bottom: 20px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px; 
    padding-left: 10px; 
     text-align: center;
    
}

</style>