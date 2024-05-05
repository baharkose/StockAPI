"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

// USER CONTROLLER

// 1- öncelikle modeli import et

const User = require("../models/user");
// burada user create olduğunda güvenlikli api oluşturabilmek için bir token oluşturmamız gerekiyor. Aynı zamanda password oluşturulduğunda encyript işleminin yapılması gerekiyor. o nedenle tokenModelimizi ve passwordEncrypt dosyamızı çağırıyoruz.

const Token = require("../models/token")



module.exports = {
  list: {},
  create: {},
  read: {},
  update: {},
  delete: {},
};
