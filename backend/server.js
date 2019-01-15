const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Expense = require('./data')

const API_PORT = 3001
const app = express()
const router = express.Router()

const dbRoute = `<your mongodb route`

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

router.get('/getData', (req, res) => {
    Expense.find((err, data) => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true, data: data })
    })
})

router.post('/updateData', (req, res) => {
    const { id, update } = req.body
    Expense.findOneAndUpdate(id, update, err => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

router.delete('/deleteData', (req, res) => {
    const { id } = req.body
    Expense.findOneAndDelete(id, err => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true }) 
    })
})

router.post('/putData', (req, res) => {
    let data = new Expense() 
    const { id, name, price } = req.body

    if((!id && id !== 0) || !name || !price){
        return res.json({ success: false, error: "Invalid Input" })
    }

    data.name = name 
    data.price = price
    data.id = id 
    data.save(err => {
        if(err) return res.json({ success: false, error: err })
        return res.json({ success: true }) 
    })
})

app.use("/api", router) 

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`))