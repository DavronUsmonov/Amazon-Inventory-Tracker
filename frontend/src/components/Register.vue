<template>
<form @submit.prevent="registerUser">
    <input v-model="register.name" type="text" id="name" placeholder="Name" name="name">
    <input v-model="register.email" type="text" id="email" placeholder="Email" name="email">
    <input v-model="register.password" type="password" id="password" placeholder="Password" name="password">
    <input v-model="register.password2" type="password" id="password2" placeholder="Confirm Password" name="password2">
    <button type="submit">Submit</button>
</form>

<RouterLink class="link" to="/">Home</RouterLink>
</template>

<script setup> 
import axios from 'axios'
import {reactive} from 'vue'
import router from '../router/index.js'

const register = reactive({
    name: '',
    email: '',
    password: '',
    password2: ''
})

const registerUser = () => {
    const name = register.name;
    const email = register.email;
    const password = register.password;
    const password2 = register.password2;
    const newUser = {name, email, password, password2}
    axios.post('http://localhost:1337/users/register', newUser, {withCredentials: true}).then(response => {
        if(response.status == 200) router.push({path: 'login'})
    }).catch(err => {
        console.log(err)
    })
}


</script>