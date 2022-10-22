const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    description: String,
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    dueDate: Date,
    user: mongoose.Schema.Types.ObjectId

});

const tasklist = mongoose.model('tasklist', userSchema);
// same with export default
module.exports = tasklist ; 

