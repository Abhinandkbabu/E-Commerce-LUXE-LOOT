const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    walletAmount:{
        type: Number
    },
    invited:{
        type: Array
    }
})

const wallet = mongoose.model("wallet",walletSchema)

module.exports = wallet