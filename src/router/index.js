import { createRouter, createWebHistory } from 'vue-router'


const routes = [   //里面创建的都是每一个route实例，里面的数据可以用$route来引用
    {
      path: '',             //path必须设置为空值
      redirect: '/login'   //重定向默认跳转位置
    },
    {
      path: '/login',
      name: 'login',      //此处的name可以不写,只是为了在导航守卫中调用
      meta: {              //加入元数据属性，放入一些自定义数据，以便在路由时在导航守卫中调用
        title:'基本组件'
      },
      component: () => import('../components/Login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../components/Home.vue'), // 匿名方式的懒加载
      
    }
  ]
  

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()
})

export default router
