"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// PURCHASE MODEL
const { mongoose } = require("../configs/dbConnection");
const PurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // referans alınacak modelin adı
      required: true,
    },
    firmId: {
      type: mongoose.Types.ObjectId,
      ref: "Firm",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: function () {
        return this.price * this.quantity;
      }, // FOR CREATE
      transform: function () {
        return this.price * this.quantity;
      }, // FOR UPDATE - yani dönüştür
    },
  },
  {
    timestamps: true,
    collection: "purchases",
  }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
