const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    username: {
        type: String,
        //when creaTE A new document,must not conflict or duplicate username
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    secret: String, // key for encryption
    hash: String, //encrypted password
    name: String,
    role: String,
    createdAt: Date,
    completed: {
        type : Boolean,
        default: false
    },
    profile: String,
    pushToken: [{
        os: String, // operating system os : android or ios
        token: String
    }]
    

});

const User = mongoose.model('user', userSchema);
// same with export default
module.exports = User ; 