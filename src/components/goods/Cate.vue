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
                    <el-button type="primary" @click="showAddCateDialog"
                        >添加分类</el-button
                    >
                </el-col>
            </el-row>
            <!-- 分类列表区  -->
            <el-tree
                :data="cateList"
                :props="defaultProps"
                node-key="id"
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
            >
                <template #default="{ node, data }">
                    <span
                        class="custom-tree-node"
                        style="
                            hight: 30px;
                            border-top: 1px solid rgb(226, 225, 225);
                        "
                    >
                        <span>{{ node.label }}</span>
                        <span>
                            <i
                                class="el-icon-success"
                                v-if="data.cat_deleted === false"
                                style="color: lightgreen"
                                >有效</i
                            >
                            <i
                                class="el-icon-error"
                                v-else
                                style="color: lightgreen"
                                >无效</i
                            >
                        </span>
                        <span>
                            <el-tag size="mini" v-if="data.cat_level === 0"
                                >一级</el-tag
                            >
                            <el-tag
                                size="mini"
                                type="success"
                                v-else-if="data.cat_level === 1"
                                >二级</el-tag
                            >
                            <el-tag size="mini" type="warning" v-else
                                >三级</el-tag
                            >
                        </span>
                        <span>
                            <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-edit"
                                @click="showModifyCate(data)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteCateById(node, data)"
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
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            <el-row></el-row>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            v-model="addCateDialogVisible"
            width="50%"
            @close="addCateClose"
        >
            <!-- 添加表单 -->
            <el-form
                :model="addCateForm"
                :rules="addCateFormRules"
                ref="addCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <el-cascader
                        v-model="selectedParentKey"
                        :options="ParentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog
            title="编辑分类"
            v-model="modifyCateDialogVisible"
            width="50%"
            @close="modifyCateClose"
        >
            <!-- 添加表单 -->
            <el-form
                :model="modifyCateForm"
                :rules="modifyCateFormRules"
                ref="modifyCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="modifyCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="modifyCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyCate">确 定</el-button>
                </span>
            </template>
        </el-dialog>
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
            addCateDialogVisible: false,
            addCateForm: { cat_name: "", cat_pid: 0, cat_level: 0 },
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
            },
            ParentCateList: [],
            selectedParentKey: [],//级联选择框双向绑定到的数组
            cascaderProps: {
                expandTrigger: "hover",
                value: "cat_id",
                label: "cat_name",
                children: "children",
                checkStrictly: true,
            },
            modifyCateDialogVisible: false,
            modifyCateForm: {cat_name: "", cat_pid: 0, cat_level: 0 },
            modifyCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
            },
            
        }
    },
    created() {
        this.getCateList(), this.getParentCateList()
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
            this.queryInfo.pagesize = newVal
            this.getCateList()
            // console.log(`每页 ${newVal} 条`);
        },
        handleCurrentChange(newVal) {
            this.queryInfo.pagenum = newVal
            this.getCateList()
            //  console.log(`当前页: ${val}`);
        },
        showAddCateDialog() {
            this.addCateDialogVisible = true
        },
        async getParentCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: { type: 2 },
            })
            if (res.meta.status !== 200) {
                return this.$message.error("获取父级分类失败")
            }
            // console.log(res);
            this.ParentCateList = res.data
        },
        parentCateChange() {
            // console.log(value)
            // this.selectedParentKey = value
            if (this.selectedParentKey == null) {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
                console.log(
                    this.addCateForm.cat_pid,
                    this.addCateForm.cat_level
                )
                return
            }
            if (this.selectedParentKey.length > 0) {
                this.addCateForm.cat_pid = this.selectedParentKey[
                    this.selectedParentKey.length - 1
                ]
                this.addCateForm.cat_level = this.selectedParentKey.length
                // console.log(this.addCateForm.cat_pid,this.addCateForm.cat_level)
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
                //  console.log(this.addCateForm.cat_pid,this.addCateForm.cat_level)
            }
        },
        addCateClose() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedParentKey = []
            this.addCateForm = {}
        },
        addCate() {
            this.$refs.addCateFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    `categories`,
                    this.addCateForm
                )
                if (res.meta.status !== 201) {
                    return this.message.error("添加分类失败")
                }
                this.$message.success(res.meta.msg) //成功提示
                this.getCateList() //刷新权限列表
                this.addCateDialogVisible = false //关 闭弹窗
            })
        },
        // ----------------------------------
        handleNodeClick(data) {
            // console.log(data);
            this.cateCurrentData = data
        },
        async showModifyCate(cateInfo) {            
             const { data: res } = await this.$http.get(`categories/${cateInfo.cat_id}`)
            if (res.meta.status !== 200) {
                return this.$message.error("分类查询出错啦")                                
            }
            this.modifyCateForm =res.data
           this.modifyCateDialogVisible = true 
        },
        modifyCateClose() {
            this.$refs.modifyCateFormRef.resetFields()
            this.modifyCateForm = {}
        },
        
         modifyCate() {
            this.$refs.modifyCateFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    "categories/" + this.modifyCateForm.cat_id,
                    this.modifyCateForm
                )
                // console.log(this.modifyForm);
                if (res.meta.status !== 200) {
                    return this.$message.error("商品分类修改失败")
                }
                this.$message.success(res.meta.msg)
                this.modifyCateDialogVisible = false
                this.getCateList()
            })
        },
        // ----------------------------------
        deleteCate(node, data) {
            console.log(node, data)
           
        },
        async deleteCateById(node,cateInfo) {
            const result = await this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err)
            if (result !== "confirm") {
                return this.$message("已取消删除")
            }
            const { data: res } = await this.$http.delete(
                "categories/" + cateInfo.cat_id
            )
            if (res.meta.status !== 200) {
                return this.$message.error("删除失败")
            }
            this.$message.success(res.meta.msg)
            this.getCateList()
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
.el-row {
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
.el-cascader {
    width: 100% !important;
}
</style>