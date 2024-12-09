<template>
    <div id="dashboard">
        <div class="links">
            <RouterLink class="link" to="/Orders">Orders</RouterLink>
            <RouterLink class="link" to="/Inventory">Inventory</RouterLink>
        </div>
        <h2 id="dashboard-title">Hello, {{ (state.name) ? state.name : ", you are not logged in"}}</h2>  
        <p>Welcome to the industry leading inventory tracker for Amazon sellers!</p>
        <p>You may get started by heading to the order page when you are ready.</p>
        <p>The inventory page will also show you the details for every SKU you have bought</p>
        <p>We hope to provide the best inventory tracking capabilities we can and help you track the leakage in your business!</p>  
    </div>

</template>

<script setup>
import axios from 'axios'
import {reactive, onBeforeMount } from 'vue'

const state = reactive({
    name: null
})

onBeforeMount(() => {
    axios.get('http://localhost:1337/api/user/info', {withCredentials:true})
        .then(response => {
            state.name = response.data.user.name
        })
        .catch((err) => {
            console.log(err)
        })
});
</script>