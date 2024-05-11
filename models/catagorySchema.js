const mongoose = require('mongoose');


const CategorySchema=new mongoose.Schema({
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

const Category= mongoose.model('Categories',CategorySchema) 

module.exports = Category