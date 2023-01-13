import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router'
import InitView             from '../views/InitView.vue'
import CongregationSettings from '../views/Settings/Congregation.vue'
const CircuitOverseer = () => import('../views/Settings/CircuitOverseer.vue')

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
        component : () => import(/* webpackChunkName: "publishers" */ '../views/PublisherView.vue'),
    },
    {
        path      : '/publishers/add',
        name      : 'publishers.add',
        component : () => import(/* webpackChunkName: "publishersForm" */ '../views/PublisherFormView.vue'),
    },
    {
        path      : '/publishers/:id',
        name      : 'publishers.edit',
        component : () => import(/* webpackChunkName: "publishersForm2" */ '../views/PublisherFormView.vue'),
    },
    {
        path      : '/exports',
        name      : 'exports',
        component : () => import(/* webpackChunkName: "exports" */ '../views/ExportView.vue'),
    },
    {
        path      : '/settings',
        name      : 'settings',
        component : () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue'),
        children  : [
            { path: '', name: 'congregationSettings', components: { settings: CongregationSettings } },
            { path: '/circuitOverseer', name: 'circuitOverseer', components: { settings: CircuitOverseer } },
        ],
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
