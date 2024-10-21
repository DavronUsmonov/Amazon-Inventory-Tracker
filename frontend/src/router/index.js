import { createRouter, createWebHistory} from 'vue-router'

import Lander from '../components/Lander.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Orders from '../components/Orders.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Lander},
        { path: '/register', component: Register},
        { path: '/login', component: Login},
        { path: '/dashboard', component: Dashboard},
        { path: '/orders', component: Orders}
    ]
})

export default router