"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// BRAND MODEL
const { mongoose } = require("../configs/dbConnection");

const BrandSchema = new mongoose.schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestapms: true,
    collection: "brands",
  }
);

module.exports = mongoose.model("Brand", BrandSchema);
