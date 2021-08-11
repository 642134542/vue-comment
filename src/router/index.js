import Vue from "vue";
import VueRouter from "vue-router";
import homePage from '@/views/homePage.vue';

const constantRoutes = [
  {
    path: '/',
    redirect: { name: 'home' },
  },
  {
    path: '/home',
    name: 'home',
    component: homePage,
  },
  {
    path: '/canvas',
    name: 'canvasPage',
    component: () => import('@/views/canvasPage.vue'),
  }
];

Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

