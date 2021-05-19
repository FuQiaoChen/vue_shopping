import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'//全部导入element-plus
import { ElMessage } from 'element-plus'//从element-plus中仅导入ElMessage模块
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'  //设置axios的基地址



// createApp(App).use(router).use(ElementPlus).mount('#app')

const app = createApp(App)
app.use(ElementPlus) //全部挂载
app.use(router)
app.mount('#app')
// app.prototype.$http = axios   //2.x版本用
app.config.globalProperties.$http = axios // 将axios导入为全局配置，通过this.$http进行使用
app.config.globalProperties.$message = ElMessage //仅挂载ElMessage作为全局配置，通过this.$message进行使用

