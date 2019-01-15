const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ExpenseSchema = new Schema(
    {
        id: Number, 
        name: String,
        price: Number
    },
    { timestamps: true }
)

module.exports = mongoose.model("Expense", ExpenseSchema)