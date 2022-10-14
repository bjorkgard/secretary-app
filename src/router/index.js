import {
    createRouter,
    createWebHashHistory,
    createWebHistory
} from 'vue-router'
import InitView from '../views/InitView.vue'

const routes = [
    {
      path      : '/',
      name      : 'init',
      component : InitView,
    },
    {
        path      : '/home',
        name      : 'home',
        component : () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
    },
    {
        path      : '/about',
        name      : 'about',
        component : () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
]

const router = createRouter({
    history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
    routes
})

export default router
