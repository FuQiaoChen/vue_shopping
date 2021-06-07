<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addVisible">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column  type="expand">
                    <template #={row}>
                        <el-row :class="['bdbottom',index01===0?'bdtop':'','vcenter']" v-for="(item01,index01) in row.children" :key="item01.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5"><el-tag closable @close="romoveRightById(row,item01.id)">{{item01.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                            <!-- 渲染二、三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[index02===0?'':'bdtop','vcenter']" v-for="(item02,index02) in item01.children" :key="item02.id">
                                    <el-col :span="6"><el-tag type="success" closable @close="romoveRightById(row,item02.id)">{{item02.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                                    <el-col :span="18"><el-tag type="warning" v-for="item03 in item02.children" :key="item03.id" closable @close="romoveRightById(row,item03.id)">{{item03.authName}}</el-tag></el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre> {{row}}</pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"> </el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="290px">
                    <template #={row}>
                        <el-button size="mini" type="primary" icon="el-icon-edit"  @click="modifyVisible(row)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUserById(row)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="showSetRightDialog(row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            v-model="addDialogVisible"
            width="50%"
            @close="addFormClose"
        >
            <el-form
                :model="addForm"
                :rules="addRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addRole">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改角色对话框 -->
        <el-dialog
            title="修改角色"
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
                <el-form-item label="角色名称">
                    <el-input v-model="modifyForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="modifyForm.roleDesc"></el-input>
                </el-form-item>                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="modifyDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="modifyRole"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog> 
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            v-model="SetRightDialogVisible"
            width="50%" @close="setRightDialogClose">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key='id' 
                     default-expand-all :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allowRights">确 定</el-button>
                </span>
            </template>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            addDialogVisible:false,            
            addForm: {
                roleName: "",
                roleDesc: "",               
            },
            addRules: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 20,
                        message: "长度在 4 到 20 个字符之间",
                        trigger: "blur",
                    },
                ],
                roleDesc: [
                    { required: true, message: "请输入角色描述", trigger: "blur" },
                    {
                        min: 6,
                        max: 50,
                        message: "长度在 6 到 50 个字符之间",
                        trigger: "blur",
                    },
                ], 
            },
            modifyDialogVisible:false,
            modifyForm: {},
            modifyRules: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur",
                    },
                    {
                        min: 4,
                        max: 20,
                        message: "长度在 4 到 20 个字符之间",
                        trigger: "blur",
                    },
                ],
                roleDesc: [
                    { required: true, message: "请输入角色描述", trigger: "blur" },
                    {
                        min: 6,
                        max: 50,
                        message: "长度在 6 到 50 个字符之间",
                        trigger: "blur",
                    },
                ], 
            },
            SetRightDialogVisible:false,
            rolesList: [],
            rightsList:[],
            treeProps:{
                children: 'children',
                label: 'authName'
            },
            //默认选中的权限值
            defaultKeys:[],
            //将分配权限角色的id
            roleId:""
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
         async getRolesList() {
            const { data: res } = await this.$http.get("roles")
            if (res.meta.status !== 200) {
                return this.$message.error("角色列表获取失败")
            }
            // console.log(res.data)
            this.rolesList = res.data
        },

        addVisible() {
            this.addDialogVisible = true
        },
        addFormClose() {
            this.$refs.addFormRef.resetFields()
        },
        addRole() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    "roles",
                    this.addForm
                )
                if (res.meta.status !== 201) {
                    return this.$message.error("添加用户失败")
                }
                this.$message.success(res.meta.msg)
                this.addDialogVisible = false
                this.getRolesList()
            })
        },
        async modifyVisible(roleInfo) {
             const { data: res } = await this.$http.get(`roles/${roleInfo.id}`)
            if (res.meta.status !== 200) {
                return this.$message.error("角色查询出错啦")
            }
            // console.log(res.data)
            this.modifyForm = res.data
            this.modifyDialogVisible = true
        },
        modifyFormClose() {
            this.$refs.modifyFormRef.resetFields()
        },
        modifyRole() {
            this.$refs.modifyFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    "roles/" + this.modifyForm.roleId,
                    this.modifyForm
                )
                console.log(this.modifyForm);
                if (res.meta.status !== 200) {
                    return this.$message.error("角色修改失败")
                }
                this.$message.success(res.meta.msg)
                this.modifyDialogVisible = false
                this.getRolesList()
            })
        },
       async deleteUserById(roleInfo) {
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
                "roles/" + roleInfo.id
            )
            if (res.meta.status !== 200) {
                return this.$message.error("删除失败")
            }
            this.$message.success(res.meta.msg)
            this.getRolesList()
        },
        async romoveRightById(roleInfo,rightId){            
        const result= await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).catch(err=>err)
        if(result!=='confirm'){return this.$message("已取消删除")}
         const { data: res } = await this.$http.delete(
                "roles/" + roleInfo.id+'/rights/'+rightId
            )
            if (res.meta.status !== 200) {
                return this.$message.error("删除权限失败")
            }
            this.$message.success(res.meta.msg)
            // this.getRolesList()   //重新获取数据时会刷新页面，导致折叠
            // console.log(roleInfo.children);
            // console.log(res.data);
           
            roleInfo.children=res.data  //此操作服务器会返回新数据，故直接赋值即可，则不会折叠？？？？？？？？？不好使！
       },
       async showSetRightDialog(roleInfo){
           this.roleId=roleInfo.id//在后面用于权限分配时的参数
           const {data:res}=await this.$http.get('rights/tree')
           if(res.meta.status!==200){return this.message.error("权限数据获取失败")}
           this.rightsList=res.data
        //    console.log(this.rightsList);
            this.getDefaultKeys(roleInfo,this.defaultKeys)//获取默认有三级权限的节点，并通过defaultKeys展示
           this.SetRightDialogVisible=true
       },
       //通过递归获取三级节点的id
       getDefaultKeys(node,arr){
           if(!node.children){return arr.push(node.id)}
           node.children.forEach(item => {
               this.getDefaultKeys(item,arr)
           });
       },
       //监听分配权限对话框关闭事件，关闭时将默认key值复原，否则会累计
       setRightDialogClose(){
           this.defaultKeys=[]
       },
       //分配权限的确认按钮触发事件
       async allowRights(){
           const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
           const keysString=keys.join(',')  //将数组keys用‘，’号进行字符串拼接
           const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysString})
           if(res.meta.status!==200){return this.message.error("权限分配失败")}
           this.$message.success(res.meta.msg) //成功提示
           this.getRolesList()                 //刷新权限列表                     
           this.SetRightDialogVisible=false    //关闭弹框
       }
    }
}
</script>

<style scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top: 1px solid rgb(226, 225, 225);
}
.bdbottom{
    border-bottom: 1px solid rgb(226, 225, 225);
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>