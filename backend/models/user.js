const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') 
const Schema = mongoose.Schema 

const UserSchema = new Schema({
        id: Number, 
        name: String,
        email: {
            type: String,
            required: true
        },
        password: {
            type: String, 
            required: true
        },
        expenses: [
            { name: { type: String, require: true }, price: { type:Number, required:true }}
        ]
    },
    { timestamps: true }
)

const User = module.exports = mongoose.model("User", UserSchema)

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback) 
}

module.exports.getUserByEmail = (email, callback) => {
    const query = { email: email }
    User.findOne(query, callback) 
}

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err 
            newUser.password = hash 
            newUser.save(callback) 
        })
    })
}

module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if(err) throw err 
        callback(null, isMatch)
    })
}