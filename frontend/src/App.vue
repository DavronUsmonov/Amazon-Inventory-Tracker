<script> 
import {RouterLink, RouterView} from 'vue-router'

import Lander from './components/Lander.vue' 
import Register from './components/Register.vue'
import Login from './components/Login.vue'

</script>


<template> 

<Lander/>

<nav>
  <RouterLink to="/Register">Sign Up</RouterLink>
  <RouterLink to="/Login">Login</RouterLink>
</nav>
<RouterView/>
</template>
