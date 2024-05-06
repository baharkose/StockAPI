"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

// TOKEN MODEL
const { mongoose } = require("../configs/dbConnection");

// create ya da login olan kullanıcıları için bir token oluşturulacağı için burada userModeli ref alıp her bir user için bir token modeli oluşturuyoruz.

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
  },
  { collection: "token", timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
