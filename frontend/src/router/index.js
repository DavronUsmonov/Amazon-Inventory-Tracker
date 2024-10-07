import { createRouter, createMemoryHistory} from 'vue-router'

import Lander from '../components/Lander.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'

const router = createRouter({
    history: createMemoryHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Lander},
        { path: '/register', component: Register},
        { path: '/login', component: Login}
    ]
})

export default router