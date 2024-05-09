"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// FIRM ROUTER
// routes/firm
// URL: /firms

const router = require("express").Router;
const firm = require("../controllers/firm");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.isStaff, firm.list)
  .post(permissions.isStaff, firm.create);

router("/:id")
  .get(permissions.isStaff, firm.read)
  .put(permissions.isStaff, firm.update)
  .patch(permissions.isStaff, firm.update)
  .delete(permissions.isAdmin, firm.delete);
