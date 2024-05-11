const mongoose = require('mongoose');


const ReferalSchema=new mongoose.Schema({
    OfferAmount:{
        type:Number,
    },
    ExpairyDate:{
        type:String,
        default:'Active'
    }
})

const Brands= mongoose.model('Referal',ReferalSchema)

module.exports = Brands