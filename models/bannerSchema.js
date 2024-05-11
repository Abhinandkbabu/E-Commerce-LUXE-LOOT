const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
    bannerType:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    status: {
        type:String,
        default:'Active'
    }
})

module.exports = mongoose.model('banner',BannerSchema)