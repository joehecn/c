
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import auth from '../auth/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/retain/:where',
  //   name: 'retain',
  //   component: () => import('../views/Retain.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/testing',
  //   name: 'testing',
  //   component: () => import('../views/Testing.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/config',
    name: 'config',
    component: () => import('../views/Config.vue')
  },
  {
    path: '/github',
    name: 'github',
    component: () => import('../views/Github.vue')
  },
  // {
  //   path: '/report',
  //   name: 'report',
  //   component: () => import('../views/Report.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/importList',
  //   name: 'importList',
  //   component: () => import('../views/ImportList.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/import/:organize/:id',
  //   name: 'import',
  //   component: () => import('../views/Import.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/tasklist/:organize',
  //   name: 'tasklist',
  //   component: () => import('../views/TaskList.vue'),
  //   meta: { requiresAuth: true }
  // }
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

router.beforeEach((to, _, next) => {
  // console.log({ to, from })
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath || '/' }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
