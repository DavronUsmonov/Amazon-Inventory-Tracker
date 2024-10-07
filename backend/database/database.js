require('dotenv').config()

const { Pool } = require('pg')

const port = process.env.DB_PORT || 5432;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'login',
    password: process.env.DB_PASSWORD,
    port: port,
});

module.exports = pool