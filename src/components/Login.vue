<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                     <el-button type="primary" @click="login">登录</el-button>
                     <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <router-view />
</template>

<script>
export default {
    data(){
        return {
            // 登录表单数据
            loginForm:{
                username:'admin',
                password:'123456',
            },
             loginFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
         resetLoginForm(){
            // console.log(this);
            // console.log(this.$refs.loginFormRef);
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return; 
               const {data:res}=await this.$http.post("login",this.loginForm); //await与valid成对使用，用于直接输出数据而非promise
               if(res.meta.status!==200) return this.$message.error("登录失败");
               this.$message.success("登录成功"); 
               window.sessionStorage.setItem("token",res.data.token);
                this.$router.push("/home")
            })            
        }       
    }
};
</script>

<style scoped lang="scss">
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.avatar {
    width: 130px;
    height: 130px;
    border: 2px solid #ddd;
    padding: 10px 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(255, 255, 255);
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(202, 199, 199);
    }
}
.login_form{
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 30px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
