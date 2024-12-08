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
    const {asin, supplier, product_name, quantity, price, total_price, date, status, sku, order_number, location} = req.body

    try {
        await pool.query(
            `INSERT INTO orders(user_id,asin,supplier,product_name,quantity,price,total_price,date,status,sku,order_number,location)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [req.user.id, asin, supplier, product_name, quantity, price, total_price, date, status, sku, order_number, location]
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

app.post('/orders/save', ensureAuth, async (req,res) => {
    const orders = req.body
    try {
        for(let i = 0; i < orders.length; i++) {
            if(orders[i].order_id == null) {
                await pool.query(
                    `INSERT INTO orders(user_id,asin,supplier,product_name,quantity,price,total_price,date,status,sku,order_number,location)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [orders[i].user_id,orders[i].asin, orders[i].supplier, orders[i].product_name, orders[i].quantity, orders[i].price, orders[i].total_price,
                    orders[i].date,orders[i].status,orders[i].sku,orders[i].order_number,orders[i].location]
                )
            }else {
                await pool.query(
                    `UPDATE orders 
                    SET asin = $1, supplier = $2, product_name = $3, quantity = $4, price = $5, total_price = $6,
                    date = $7, status = $8, sku = $9,order_number = $10, location = $11 
                    WHERE order_id = $12`, [orders[i].asin, orders[i].supplier, orders[i].product_name, orders[i].quantity, orders[i].price, orders[i].total_price,
                    orders[i].date,orders[i].status,orders[i].sku,orders[i].order_number,orders[i].location, orders[i].order_id]
                )
            }
        }
        res.status(200).send('Orders updated.')
    }catch(err) {
        console.log(err)
        res.status(500)
    }
})

app.post('/orders/deleteOrder', ensureAuth, async (req,res) => {
    const order_id = req.body
    try {
        await pool.query(`DELETE FROM orders WHERE order_id = $1`, [order_id])
        res.status(200).send('Order deleted')
    }catch(err) {
        console.log(err)
        res.status(500)
    }
})



app.listen(port, () => console.log(`Server started on port: ${port}`))