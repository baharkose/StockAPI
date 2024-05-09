"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

// CATEGORY ROUTER
const category = require("../controllers/category");
const permissions = require("../middlewares/permissions");
const router = require("express").Router();

// PATH: category
// URL: /categories
router
  .route("/")
  .get(permissions.isStaff, category.list)
  .post(permissions.isAdmin, category.create);

router
  .route("/:id")
  .get(permissions.isStaff, category.read)
  .put(permissions.isStaff, category.update)
  .patch(permissions.isAdmin, category.update)
  .delete(permissions.isAdmin, category.delete);

module.exports = router;
