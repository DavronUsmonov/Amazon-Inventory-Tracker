const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cors = require('cors')

const initializePassport = require('../passportConfig.js')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false}
}))
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}))

app.use(flash({


}))

function ensureAuth(req,res,next) {
    if(req.isAuthenticated()) {
        console.log("auth succeeded")
        return next();
    }else {
        console.log("auth failed")
        res.status(500).redirect('http://localhost:5173/Login')
    }
}

app.use(passport.initialize())
app.use(passport.session())

//initializePassport(passport)
const authenticateUser = async (email,password,done)=>{
    console.log(email)
    console.log(password)
    try{
        const emails = await pool.query(
            `SELECT * FROM users 
            WHERE email = $1`, [email]
        )
        if(emails.rows.length > 0 ) {
            const user = emails.rows[0]
            console.log(user)
            const match = await bcrypt.compare(password, user.password)
            console.log(match)
            if(!match) return done(null,false,{message: 'Password is incorrect.'})
            else {
                console.log("User logged in!")
                return done(null,user)   
            }
        } else {
            return done(null, false, {message: 'Email is not registered.'})
        }
    }catch(err) {
        console.log(err)
    }
    
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
authenticateUser
))

passport.serializeUser((user,done) => done(null,user.id))

passport.deserializeUser((id,done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err,results) => {
        if(err) return done(err)
        return done(null, results.rows[0])
    })
    
})


const pool = require('../database/database.js')
const port = process.env.port || 1337

app.get('/', async (req,res) => {
    res.sendStatus(200)
})

app.post('/users/register', async (req,res) => {
    const { name, email, password, password2 } = req.body

    try {

        if(password != password2) throw new Error('Passwords do not match.')

        const hashedPassword = await bcrypt.hash(password, 10)

        const emails = await pool.query(
            `SELECT * FROM users 
            WHERE email = $1`, [email]
        )
        if(emails.rows.length > 0) {
            throw new Error('Email already registered.')
        }else {
            pool.query(
                `INSERT INTO users(name,email,password)
                VALUES ($1, $2, $3)`, [name, email, hashedPassword]
            )
            req.flash('success', 'You have been registered! Please log in now.')
        }
        res.status(200).send('User registered')
        console.log('User registered')
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

app.post('/users/login', passport.authenticate('local', {
    successRedirect:'http://localhost:5173/dashboard',
    failureRedirect:'http://localhost:5173/login',
    faiilureFlash: 'true'
}))

app.post('/orders/new', ensureAuth, async (req,res) => {
    const {asin, supplier, product_name, quantity, price, total_price} = req.body

    try {
        await pool.query(
            `INSERT INTO orders(user_id,asin,supplier,product_name,quantity,price,total_price)
            VALUES ($1,$2,$3,$4,$5,$6,$7)`, [req.user.id, asin, supplier, product_name, quantity, price, total_price]
        )
        res.status(200).send('Order added.')
    }catch(err) {
        console.log(err)
        res.status(500)
    }
})

app.get('/api/user/info', ensureAuth, (req,res) => {
    res.status(200).json({user: req.user})
}) 

app.get('/api/user/orders', ensureAuth, async (req,res) => {
    try{
        const user_orders = await (await pool.query(`SELECT * FROM orders WHERE user_id = $1`, [req.user.id])).rows
        res.status(200).json(Object.values(user_orders))
    }catch(err) {
        console.log(err)
        res.status(500)
    }
}) 

app.listen(port, () => console.log(`Server started on port: ${port}`))