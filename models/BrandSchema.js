const mongoose = require('mongoose');


const BrandSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    Status:{
        type:String,
        default:'Active'
    }
})

const Brands= mongoose.model('Brands',BrandSchema)

module.exports = Brands