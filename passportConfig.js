const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./database/database.js')
const bcrypt = require('bcrypt')


function initialize(passport) {
    
    const authenticateUser = async (email,password,done)=>{
        console.log(email)
        console.log(password)
        try{
            const emails = await pool.query(
                `SELECT * FROM users 
                WHERE email = $1`, [email]
            )
            /*if(emails.rows.length > 0 ) {
                const user = results.rows[0]
                const match = bcrypt.compare(password, user.password)
                if(!match) return done(null,false,{message: 'Password is incorrect.'})
                else {
                    return done(null,user)   
                }
            } else {
                return done(null, false, {message: 'Email is not registered.'})
            }*/
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
            else return done(null, results.rows[0])
        })
        
    })
}

module.exports = initialize