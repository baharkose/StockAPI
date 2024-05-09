"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// PATH: brand
// URL: /brands
const router = require("express").Router();
const brands = require("../controllers/brand");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.isStaff, brands.list)
  .post(permissions.isStaff, brands.create);

router
  .route("/:id")
  .get(permissions.isStaff, brands.read)
  .put(permissions.isStaff, brands.update)
  .patch(permissions.isStaff, brands.update)
  .delete(permissions.isAdmin, brands.delete);

module.exports = router;
