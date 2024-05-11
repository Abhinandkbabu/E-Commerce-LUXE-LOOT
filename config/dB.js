const mongoose = require('mongoose');
require('dotenv').config()

// const MONGO_URL=process.env.MONGO_URL

// const db=mongoose.connect(MONGO_URL).then(()=>{console.log("Mongoose connected");})

const connectdb = function(){
    const MONGO_URL=process.env.MONGO_URL

const db=mongoose.connect(MONGO_URL).then(()=>{console.log("Mongoose connected");})
}

module.exports = connectdb

