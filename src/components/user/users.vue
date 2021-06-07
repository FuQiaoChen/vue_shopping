<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="15">
                    <el-input
                        v-model="queryInfo.query"
                        placeholder="请输入内容"
                        clearable
                        @clear="getUserList"
                    >
                        <template #append>
                            <el-button
                                icon="el-icon-search"
                                @click="getUserList"
                            ></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="addVisible"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table :data="userList" border stripe>
                <el-table-column label="#" type="index"> </el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"> </el-table-column>
                <el-table-column label="电话" prop="mobile"> </el-table-column>
                <el-table-column label="角色" prop="role_name">
                </el-table-column>
                <el-table-column label="状态" prop="mg_state" width="100px">
                    <!-- 解构出子组件插槽中的row(即每一行的信息) 将状态用switch表示-->
                    <template #="{ row }">
                        <el-switch
                            v-model="row.mg_state"
                            @change="userStateChange(row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="175px">
                    <template #="{ row }">
                        <!-- 修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="modifyVisible(row)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteUserById(row)"
                        ></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="deployVisible(row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            v-model="addDialogVisible"
            width="50%"
            @close="addFormClose"
        >
            <el-form
                :model="addForm"
                :rules="addRules"
                ref="addFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            v-model="modifyDialogVisible"
            width="50%"
            @close="modifyFormClose"
        >
            <el-form
                :model="modifyForm"
                :rules="modifyRules"
                ref="modifyFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="modifyForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="modifyForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="modifyForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="modifyDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="modifyUser"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>     
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" v-model="deployDialogVisible" width="50%" @close="deployRoleClose">
            <div>
                <p>当前的用户名：{{userInfo.username}}</p>
                <p>当前的角色是：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRolesId" placeholder="请选择">
                        <el-option
                        v-for="item in RolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deployDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="deployRole"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import RolesVue from '../power/Roles.vue'
export default {
    data() {
        return {
            //获取用户列表的参数对象
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5,
            },
            userList: [],
            total: 0,
            addDialogVisible: false,
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            addRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 10,
                        message: "长度在 4 到 10 个字符之间",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符之间",
                        trigger: "blur",
                    },
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱地址",
                        trigger: "blur",
                    },
                    {
                        type: "email", //相当于自定义邮箱的校验规则
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"],
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    {
                        //用正则表达式自定义校验规则
                        validator: function (rule, value, callback) {
                            if (/^1[34578]\d{9}$/.test(value) == false) {
                                callback(new Error("手机号格式错误"))
                            } else {
                                callback()
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
            modifyDialogVisible: false,
            modifyForm: {},
            modifyRules: {
                email: [
                    {
                        required: true,
                        message: "请输入邮箱地址",
                        trigger: "blur",
                    },
                    {
                        type: "email", //相当于自定义邮箱的校验规则
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"],
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    {
                        //用正则表达式自定义校验规则
                        validator: function (rule, value, callback) {
                            if (/^1[34578]\d{9}$/.test(value) == false) {
                                callback(new Error("手机号格式错误"))
                            } else {
                                callback()
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
            deployDialogVisible: false,            
            userInfo:{},//需分配角色的用户信息
            RolesList:[],
            selectedRolesId:"",
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        //获取用户表数据
        async getUserList() {
            const { data: res } = await this.$http.get("users", {
                params: this.queryInfo,
            })

            if (res.meta.status !== 200) {
                return this.$message.error("获取菜单列表失败")
            }

            this.userList = res.data.users
            this.total = res.data.total
            // console.log(res)
        },
        //监听页面范围改变事件
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
            this.queryInfo.pagesize = val
            this.getUserList()
        },
        //监听当前页码值改变事件
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            this.queryInfo.pagenum = val
            this.getUserList()
        },
        //switch的change事件，改变用户状态
        async userStateChange(userInfo) {
            //  console.log(userInfo)
            const { data: res } = await this.$http.put(
                `users/${userInfo.id}/state/${userInfo.mg_state}` //请求路径：users/:uId/state/:type,其中的‘:xx’表示变量,可用模板字符串赋值
            )
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state //状态修改不成功应恢复为原值
                return this.$message.error("设置状态出错啦")
            }
            this.$message.success(res.meta.msg)
        },
        addVisible() {
            this.addDialogVisible = true
        },
        //添加用户对话框关闭时表单重置，用的是子组件el-form的方法
        addFormClose() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    "users",
                    this.addForm
                )
                if (res.meta.status !== 201) {
                    return this.$message.error("添加用户失败")
                }
                this.$message.success(res.meta.msg)
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        async modifyVisible(userInfo) {
            //  console.log(userInfo.id);
            //  console.log( `users/${userInfo.id}`);
            const { data: res } = await this.$http.get(`users/${userInfo.id}`)
            if (res.meta.status !== 200) {
                return this.$message.error("查询出错啦")
            }
            // console.log(res.data)
            this.modifyForm = res.data
            this.modifyDialogVisible = true
        },
        modifyFormClose() {
            this.$refs.modifyFormRef.resetFields()
        },
        modifyUser() {
            this.$refs.modifyFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    "users/" + this.modifyForm.id,
                    this.modifyForm
                )
                if (res.meta.status !== 200) {
                    return this.$message.error("修改用户失败")
                }
                this.$message.success(res.meta.msg)
                this.modifyDialogVisible = false
                this.getUserList()
            })
        },
        //删除用户 不能执行getUserList()刷新？？？？？？？？？？
        // deleteUserById(userInfo) {
        //     this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //     })
        //         .then((res) => {
        //             this.$http.delete("users/" + userInfo.id)
        //             this.getUserList()
        //             this.$message({
        //                 type: "success",
        //                 message: "删除成功!",
        //             })
        //         })
        //         .catch(() => {
        //
        //         })
        // },
        async deleteUserById(userInfo) {
            const result = await this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err)
            if (result !== 'confirm') {
                return this.$message("已取消删除")
            }
            const { data: res } = await this.$http.delete(
                "users/" + userInfo.id
            )
            if (res.meta.status !== 200) {
                return this.$message.error("删除失败")
            }
            this.$message.success(res.meta.msg)
            this.getUserList()
        },
        async deployVisible(userInfo) {
            this.userInfo=userInfo //存储用户信息备用
             const { data: res } = await this.$http.get(`roles`)
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败")
            }
            this.RolesList=res.data
            // console.log(res.data) 
            this.deployDialogVisible = true
        },
        //分配角色对话框关闭复位
        deployRoleClose(){
            this.selectedRolesId=[]            
        },
        //点击确认按钮，分配角色
        async deployRole(){
            if(!this.selectedRolesId){return this.$message.error('请选择要分配的角色')}
             const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRolesId})
            if (res.meta.status !== 200) {
                return this.$message.error("分配角色失败")
            }
            this.$message.success(res.meta.msg) //成功提示 
            this.getUserList()
            this.deployDialogVisible = false
        }
    },
}
</script>

<style lang="scss" scoped>
</style>