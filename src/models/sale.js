"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// SALE MODEL

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------*/

const SaleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    brandId: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      //   FOR CREATE
      default: function () {
        return this.price * this.quantity;
      },
      //   FORM UPDATE
      transform: function () {
        return this.price * this.quantity;
      },
    },
  },
  {
    timestamps: true,
    collection: "sales",
  }
);

/* ------------------------------------------------------*/
module.exports = mongoose.model("Sale", SaleSchema);
