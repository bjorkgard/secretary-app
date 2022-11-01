import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router'
import InitView from '../views/InitView.vue'

const routes = [
    {
        path      : '/about',
        name      : 'about',
        component : () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    },
    {
        path      : '/',
        name      : 'init',
        component : InitView,
    },
    {
        path      : '/home',
        name      : 'home',
        component : () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    },
    {
        path      : '/publishers',
        name      : 'publishers',
        component : () => import(/* webpackChunkName: "home" */ '../views/PublisherView.vue'),
    },
    {
        path      : '/publishers/add',
        name      : 'publishers.add',
        component : () => import(/* webpackChunkName: "home" */ '../views/PublisherFormView.vue'),
    },
    {
        path      : '/settings',
        name      : 'settings',
        component : () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue'),
    },
]

const router = createRouter({
    history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
    routes,
    scrollBehavior(to) {
        if (to && to.hash) {
            return {
                selector : to.hash,
                offset   : { x: 0, y: 80 }, // avoid blocking the view when having fixed components
                behavior : 'smooth',
            }
        }

        return { x: 0, y: 0, behavior: 'smooth' }
    },
})

export default router
