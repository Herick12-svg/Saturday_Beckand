const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    taskList: {
        type: String,
        //when creaTE A new document,must not conflict or duplicate username
        required: true,
        unique: true,
        lowercase: true,
        trim: true


    },
    name: String,
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: Date

});

const tasklist = mongoose.model('tasklist', userSchema);
// same with export default
module.exports = tasklist ; 

