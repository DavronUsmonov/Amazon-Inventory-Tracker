<template>
    <form action="http://localhost:1337/users/login" method="post">
        <label for="email">Email: </label>
        <input type="text" id="email" name="email"><br>
        <label for="password">Password: </label>
        <input type="password" id="password" name="password"><br>
        <input type="submit" value="Submit">
    </form>
    
    </template>