import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'//全部导入element-plus
import 'element-plus/lib/theme-chalk/index.css'//全局导入element-plus中的css文件
import './assets/css/global.css'    
import './assets/fonts/iconfont.css'//全局导入阿里图标字符


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'           //设置axios的基地址
axios.interceptors.request.use(config => {                                 //token拦截器
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

// createApp(App).use(router).use(ElementPlus).mount('#app')

const app = createApp(App)
app.use(ElementPlus)   //全部挂载
app.use(router)
app.mount('#app')
// app.prototype.$http = axios   //2.x版本用
app.config.globalProperties.$http = axios // 将axios导入为全局配置，通过this.$http进行使用
// app.config.globalProperties.$message = ElMessage //需要单独导出再用此语法进行挂载，再通过this.$message进行使用(2.0语法，3.0已默认挂载)

