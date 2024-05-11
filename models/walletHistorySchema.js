const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    actions:[{
        amount : {type: Number},
        reason : {type: String},
        type : {type: String},
        Date : {type: Date},
        orderId:{type:mongoose.Schema.Types.ObjectId}
    }]
})

const walletHistory = mongoose.model('walletHistory',walletHistorySchema)

module.exports = walletHistory