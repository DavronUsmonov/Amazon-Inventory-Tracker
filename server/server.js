const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const initializePassport = require('../passportConfig.js')

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
            const match = bcrypt.compare(password, user.password)
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

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash({


}))

app.get('/', async (req,res) => {
    res.sendStatus(200)
})

app.post('/users/register', async (req,res) => {
    const { name, email, password, password2 } = req.body

    console.log("hi")
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
            //req.flash('success', 'You have been registered! Please log in now.')
            //res.redirect('/users/login')
        }
        res.status(200).send('User registered.')
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

app.post('/users/login', passport.authenticate('local'))

app.listen(port, () => console.log(`Server started on port: ${port}`))