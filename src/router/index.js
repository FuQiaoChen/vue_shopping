import { createRouter, createWebHistory } from 'vue-router'
//里面创建的都是每一个route实例，里面的数据可以用$route来引用
const routes = [
  {
    //path必须设置为空值
    path: '',
    //重定向默认跳转位置
    redirect: '/login'
  },
  {
    path: '/login',
    //此处的name可以不写,只是为了在导航守卫中调用
    name: 'login',
    //加入元数据属性，放入一些自定义数据，以便在路由时在导航守卫中调用
    meta: {
      title: '基本组件'
    },
    component: () => import(/* webpackChunkName:"Login" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: 'welcome', //重定向到时welcome页面
    component: () => import(/* webpackChunkName:"home" */ '../components/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName:"Welcome" */ '../components/Welcome.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName:"users" */ '../components/user/Users.vue')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import(/* webpackChunkName:"rights" */ '../components/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName:"roles" */ '../components/power/Roles.vue')
      },
      {
        path: '/categories',
        name: 'cate',
        component: () => import(/* webpackChunkName:"cate" */ '../components/goods/Cate.vue')
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import(/* webpackChunkName:"params" */ '../components/goods/Params.vue')
      },
      {
        path: '/goods',
        name: 'GoodsList',
        component: () => import(/* webpackChunkName:"goods" */ '../components/goods/GoodsList.vue')
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: () => import(/* webpackChunkName:"add" */ '../components/goods/Add.vue')
      },
      {
        path: '/goods/modify',
        name: 'Modify',
        component: () => import(/* webpackChunkName:"modify" */ '../components/goods/Modify.vue')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName:"Orders" */ '../components/orders/Order.vue')
      },
      {
        path: '/reports',
        name: 'Report',
        component: () => import(/* webpackChunkName:"Report" */ '../components/reports/Report.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//路由导航守卫，即进入特定页面前的token验证，如果没有token应该进入到登录页面
router.beforeEach((to, from, next) => {
  //如果用户进入到登录页面就直接放行
  if (to.path === '/login') return next()
  //从sessionStorage中获取登录时保存的token
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
