import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView                                                 from '../views/HomeView.vue'

const routes = [
  {
    path      : '/',
    name      : 'home',
    component : HomeView
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
