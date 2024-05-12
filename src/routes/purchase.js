"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// PURCHASE CONTROLLER

// routes/purchase
const router = require("express").Router();
const permissions = require("../middlewares/permissions");
const purchase = require("../controllers/purchase");
/* ------------------------------------------------------- */

// URL: purchases
router
  .route("/")
  .get(permissions.isStaff, purchase.list)
  .post(permissions.isStaff, purchase.create);
router
  .route("/id")
  .get(permissions.isLogin, purchase.read)
  .put(permissions.isStaff, purchase.update)
  .patch(permissions.isAdmin, purchase.delete);
/* ------------------------------------------------------- */
module.exports = router;
