<template>
<form action="http://localhost:1337/users/register" method="post">
    <label for="name">Full name: </label>
    <input type="text" id="name" name="name"><br>
    <label for="email">Email: </label>
    <input type="text" id="email" name="email"><br>
    <label for="password">Password: </label>
    <input type="password" id="password" name="password"><br>
    <label for="password2">Confirm Password: </label>
    <input type="password" id="password2" name="password2"><br>
    <input type="submit" value="Submit">
</form>

</template>