const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
    },
    products:[
        {
            ProductId:{type: Schema.Types.ObjectId,ref:'products'},
            quantity: { type: Number },
            price: {type:Number},
            OrderStatus:{type:String,default:'Order Processing'},
            rejectReason:String,
            returnReason:String,
            returnStatus:String
        },
    ],
    address: {
        name:String,
        addressLane: String,
        locality: String, 
        city: String,
        district: String,
        state: String,
        pincode: Number,
        mobile:Number,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      expectedDeliveryDate: Date,
      paymentMethod: String,
      PaymentStatus: String,
      totalAmount: Number,
      deliveryDate: Date,
      orderStatus: String,
      couponDiscount:Number,
      walletDiscount: Number,
      couponCode: String,
      discountAmount: Number,
      subTotal: Number,
      returnRequest:{type:String,default:"NO"}
})
const order = mongoose.model("order", orderSchema);
module.exports = order;