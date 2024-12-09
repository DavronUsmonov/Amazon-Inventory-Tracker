<template>
    <div id="login">
        <form action="http://localhost:1337/users/login" method="post">
            <label for="email">Email: </label>
            <input type="text" id="email" name="email"><br>
            <label for="password">Password: </label>
            <input type="password" id="password" name="password"><br>
            <input id="logSubmit" type="submit" value="Submit">
        </form>
        <p>Don't have an account?</p>
    <RouterLink class="link" to="/Register">Sign up</RouterLink>
    </div>
    
</template>