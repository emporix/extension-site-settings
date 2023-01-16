import { createRouter, createWebHashHistory } from 'vue-router'
import { syncUrl } from 'md-ext/lib'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Sites.vue'),
        },
        {
            path: '/site/:code',
            name: 'site',
            component: () => import('../views/Site.vue'),
        },
        {
            path: '/create-site',
            name: 'create-site',
            component: () => import('../views/Site.vue'),
        },
        {
            path: '/site',
            name: 'about',
            component: () => import('../views/Sites.vue'),
        },
    ],
})

router.afterEach((to, from) => {
    if (to.fullPath !== from.fullPath) {
        syncUrl(to.fullPath)
    }
})

export default router
