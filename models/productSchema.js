const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
    },

    price: {
      type: Number,
    },

    discountPrice: {
      type: Number,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },

    description: {
      type: String,
    },

    specification: {
      type: Array,
    },

    stock: {
      type: Number,
    },

    color: {
      type: String,
    },

    tag: {
      type: String,
    },
    status: {
      type: String,
      default:'Active'
    },

    images: {
      type: Array,
      required: true,
    },
    inCategoryOffer: Boolean,
    beforeOffer: Number,
    categoryoffer: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productschema);
