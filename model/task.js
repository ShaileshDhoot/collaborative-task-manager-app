const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    description:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending' 
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

})

module.exports= mongoose.model('Task', taskSchema)