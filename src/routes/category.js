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
router.route("/").get(permissions.isStaff, category.list);

router
  .route("/:id")
  .get(permissions.isStaff, category.read)
  .put(permissions.isStaff, category.update)
  .patch(permissions.isStaff, category.update)
  .delete(permissions.isAdmin, category.delete);

module.exports = router;
