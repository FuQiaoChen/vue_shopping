<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                center
                show-icon
            >
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectedCataKey"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="CateChange"
                        clearable
                    ></el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isButtonDisabled"
                        @click="addDialogVisible = true"
                        >添加动态参数</el-button
                    >
                    <el-table :data="manyTabData" border stripe >
                        <el-table-column type="expand">
                            <template #="{ row }">
                                <el-tag
                                    v-for="(item,index) in row.attr_vals"
                                    :key="index"
                                    closable  
                                    @close="handleTagDeleteClose(index,row)"                               
                                    >{{ item }}</el-tag
                                >
                                <el-input
                                    class="input-new-tag"
                                    v-if="row.inputVisible"
                                    v-model="row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(row)"
                                    @blur="handleInputConfirm(row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="#"
                            type="index"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template #="{ row }">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="modifyVisible(row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="deleteParamsById(row)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isButtonDisabled"
                        @click="addDialogVisible = true"
                        >添加静态属性</el-button
                    >
                    <el-table :data="onlyTabData" border stripe  default-expand-all>
                        <el-table-column type="expand">
                            <template #="{ row }">
                                <el-tag
                                    v-for="(item,index) in row.attr_vals"
                                    :key="index"
                                    closable  
                                    @close="handleTagDeleteClose(index,row)"                               
                                    >{{ item }}</el-tag
                                >
                                <el-input
                                    class="input-new-tag"
                                    v-if="row.inputVisible"
                                    v-model="row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(row)"
                                    @blur="handleInputConfirm(row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="#"
                            type="index"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template #="{ row }">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="modifyVisible(row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="deleteParamsById(row)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加动态参数或静态属性对话框 -->
        <el-dialog
            :title="'添加' + titleText"
            v-model="addDialogVisible"
            width="50%"
            @close="addDialogClose"
        >
            <el-form
                :model="addParamsForm"
                :rules="addParamFormsRules"
                ref="addParamsFormRef"
                label-width="100px"
            >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input
                        v-model="addParamsForm.attr_name"
                    ></el-input> </el-form-item
            ></el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addParams"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>
        <!-- 修改动态参数或静态属性对话框 -->
        <el-dialog
            :title="'修改' + titleText"
            v-model="modifyDialogVisible"
            width="50%"
            @close="modifyDialogClose"
        >
            <el-form
                :model="modifyParamsForm"
                :rules="modifyParamFormsRules"
                ref="modifyParamsFormRef"
                label-width="100px"
            >
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input
                        v-model="modifyParamsForm.attr_name"
                    ></el-input> </el-form-item
            ></el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="modifyDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="modifyParams"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],
            cascaderProps: {
                expandTrigger: "hover",
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
            selectedCataKey: [], //级联选择框双向绑定到的数组
            activeName: "many",
            manyTabData: [],
            onlyTabData: [],
            addDialogVisible: false,
            addParamsForm: { attr_name: "" },
            addParamFormsRules: {
                attr_name: [
                    {
                        required: true,
                        message: "请输入参数名称",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 20,
                        message: "长度在 4 到 20 个字符之间",
                        trigger: "blur",
                    },
                ],
            },
            modifyDialogVisible: false,
            modifyParamsForm: {},
            modifyParamFormsRules: {
                attr_name: [
                    {
                        required: true,
                        message: "请输入参数名称",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 20,
                        message: "长度在 4 到 20 个字符之间",
                        trigger: "blur",
                    },
                ],
            },
            expandRowKeys:[1]
        }
    },
    computed: {
        isButtonDisabled() {
            if (this.selectedCataKey.length !== 3) {
                return true
            }
            return false
        },
        cateId() {
            if (this.selectedCataKey.length === 3) {
                return this.selectedCataKey[2]
            }
            return null
        },
        // 动态参数或静态属性对话框的标题
        titleText() {
            if (this.activeName === "many") {
                return "动态参数"
            } else {
                return "静态属性"
            }
        },
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories")
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败")
            }
            this.cateList = res.data
            // console.log(this.cateList);
        },
        //级联选择框变化触发方法
        CateChange() {
            // console.log(this.selectedCataKey);
            if (this.selectedCataKey === null) {
                this.selectedCataKey = []
                return
            }
            this.getParamsData()
            // this.paramsList = res.data
        },
        handleTabClick() {
            if (this.selectedCataKey === null) {
                this.selectedCataKey = []
                return
            }
            this.getParamsData()
        },
        //获取数据方法，供动态与静态参数分别调用 ,
        async getParamsData() {
            if (this.selectedCataKey.length !== 3) {
                this.selectedCataKey = []
                this.manyTabData=[]
                this.onlyTabData=[]
                return
            }
            // console.log(this.selectedCataKey)
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                    params: { sel: this.activeName },
                }
            )
            if (res.meta.status !== 200) {
                return this.$message.error("获取参数列表失败")
            }
            // console.log(res.data);
            // 把attr_vals字符串转换为数组，若空字符串则转为空数组
            res.data.forEach((item) => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
                item.inputVisible = false
                item.inputValue = ""
            })      
            if (this.activeName === "many") {
                this.manyTabData = res.data
            } else {
                this.onlyTabData = res.data
            }
        },
        addDialogClose() {
            this.$refs.addParamsFormRef.resetFields()
        },
        addParams() {
            this.$refs.addParamsFormRef.validate(async (valid) => {
                if (!valid) {
                    return
                }
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    {
                        attr_name: this.addParamsForm.attr_name,
                        attr_sel: this.activeName,
                    }
                )
                if (res.meta.status !== 201) {
                    return this.$message.error(`${this.titleText}添加失败`)
                }
                this.$message.success(`${this.titleText}添加成功`)
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        async modifyVisible(paramsInfo) {
            const {
                data: res,
            } = await this.$http.get(
                `categories/${this.cateId}/attributes/${paramsInfo.attr_id}`,
                { params: { attr_sel: this.activeName } }
            )
            if (res.meta.status !== 200) {
                return this.$message.error("参数查询出错啦")
            }

            this.modifyParamsForm = res.data
            this.modifyDialogVisible = true
        },
        modifyDialogClose() {
            this.$refs.modifyParamsFormRef.resetFields()
        },
        modifyParams() {
            this.$refs.modifyParamsFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    "categories/" +
                        this.cateId +
                        "/attributes/" +
                        this.modifyParamsForm.attr_id,
                    {
                        attr_name: this.modifyParamsForm.attr_name,
                        attr_sel: this.activeName,
                    }
                )
                // console.log(this.modifyForm)
                if (res.meta.status !== 200) {
                    return this.$message.error("参数修改失败")
                }
                this.$message.success(res.meta.msg)
                this.modifyDialogVisible = false
                this.getParamsData()
            })
        },
        async deleteParamsById(paramsInfo) {
            const result = await this.$confirm(
                "此操作将永久删除该参数, 是否继续?",
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
                "categories/" +
                    this.cateId +
                    "/attributes/" +
                    paramsInfo.attr_id
            )
            if (res.meta.status !== 200) {
                return this.$message.error("删除失败")
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
        },
        showInput(row) {
            row.inputVisible = true
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },

        //对attr_vals数据进行操作，并保存到数据库
        async saveAttrVals(row){
             const { data: res } = await this.$http.put(
                "categories/" +
                    this.cateId +
                    "/attributes/" +
                    row.attr_id,{
                        attr_name:row.attr_name,
                        attr_sel:row.attr_sel,
                        attr_vals:row.attr_vals.join(' ')}
            )
            if (res.meta.status !== 200) {
                return this.$message.error("更新失败")
            }
            this.$message.success(res.meta.msg)           
        },
        async handleInputConfirm(row) {
            
            if(row.inputValue.trim().length===0){
                row.inputVisible = false
                row.inputValue = ""
                return
            }
            row.attr_vals.push(row.inputValue.trim())
           row.inputVisible = false
                row.inputValue = ""
                //提交数据
           this.saveAttrVals(row)
        },
        //删除参数对应的可选项
        handleTagDeleteClose(index,row){
            // console.log(attr);
            row.attr_vals.splice(index,1)
            this.saveAttrVals(row)

        },        
    },
}
</script>

<style scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 2px 10px;
}
.input-new-tag {
    width: 200px;
}
</style>