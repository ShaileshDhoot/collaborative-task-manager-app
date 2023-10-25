const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to database')
    }catch(error){
        console.log('Error in Database connection ', error)
    }
}

module.exports =  {connectDB}