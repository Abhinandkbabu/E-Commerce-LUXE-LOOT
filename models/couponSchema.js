const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    couponCode : {
        type : String,
     },
     minPurchaseAmount : {
        type : Number,
     },
     discountAmount : {
        type : Number,
     },
     expiryDate : {
        type : Date,
     },
     description : {
         type : String
     },
     discountPercentage : {
         type : String
     }
}) 

const Coupons = mongoose.model('Coupons',CouponSchema)

module.exports = Coupons