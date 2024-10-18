<template>
<h2>Hello {{ state.name }}</h2>
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
}) 


</script>