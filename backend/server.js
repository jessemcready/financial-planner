const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./models/user')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./config')

const API_PORT = 3001
const app = express()
const router = express.Router()

const dbRoute = config.db

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
)

let db = mongoose.connection

db.once('open', () => console.log('Connected to DB'))

db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 
app.use(cors())

app.use(passport.initialize())
app.use(passport.session()) 

require('./config/passport')(passport)

router.post('/updateData', (req, res) => {
    const { id, update } = req.body
    User.findOneAndUpdate(id, update, err => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

router.delete('/deleteData', (req, res) => {
    const { id, email, name, price } = req.body
    User.updateOne({"email": `${email}`}, { $pull: { expenses: { "id": `${id}`, "price": `${price}`, "name": `${name}` }}}, (err, raw) => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

router.post('/putData', (req, res) => {
    let data = {}
    const { id, name, price, email } = req.body

    if((!id && id !== 0) || !name || !price){
        return res.json({ success: false, error: "Invalid Input" })
    }

    data.name = name 
    data.price = price
    data.id = id 
    User.updateOne({ "email": `${email}`} , { $push: { expenses: data }}, (err, raw) => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body
    let newUser = new User({ name, email, password })

    User.addUser(newUser, (err, user) => {
        if(err) res.json({ success: false, msg: err })
        else res.json({ success: true, msg: 'User registered', user: {
            id: user._id, name: user.name, email: user.email
        }})
    })
})

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body 

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err 
        if(!user) return res.json({ success: false, msg: 'User not found' })

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err 
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 
                })
                const { _id, name, email } = user 
                res.json({
                    success: true, 
                    token: 'JWT ' + token,
                    user: { id: _id, name, email }
                })
            } else return res.json({ success: false, msg: 'Wrong email/password' })
        })
    })
})

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { _id, name, email, expenses  } = req.user
    res.json({ user: { id: _id, name, email, expenses }})
})

app.use("/api", router) 

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`))