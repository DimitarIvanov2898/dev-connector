const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDb = async () => {
    try{
        await mongoose.connect(db, {useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true})
        
    }catch(err){
        console.log(err)
        //exit if db connection fails
        process.exit(1)
    }
}

module.exports = connectDb