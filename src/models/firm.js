"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

const { mongoose } = require("../configs/dbConnection");

// Firm Model

/* ------------------------------------------------------- *
{
    "name": "Firm 1",
    "phone": "555 55 55",
    "address": "Address Line",
    "image": "http://imageURL"
}
/* ------------------------------------------------------- */

const FirmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "firm",
  }
);

module.exports = mongoose.model("Firms", FirmSchema);
