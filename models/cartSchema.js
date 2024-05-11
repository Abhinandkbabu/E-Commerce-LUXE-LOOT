const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const CartSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: 'user'},
  Items: [
    {
      ProductId: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;