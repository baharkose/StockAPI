"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

// Middleware: permissions

module.exports = {
  isLogin: (req, res, next) => {
    // set passive
    // return next()

    // req user içerisinde bilgi varsa ve bu kullanıcı banlanmadıysa o zaman isLogin yap. Devam et.yoksa 403 hata kodu yolla.
    if (req.user && req.user.isActive) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("No permisson: You must login");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user?.isAdmin && req.user.isActive) {
      next();
    } else {
      res.errorStatusCode(403).send("No permission: You must be admin");
    }
  },
  isStaff: (req, res, next) => {
    if (req.user?.isStaff && req.user?.isActive) {
      next();
    } else {
      res.errorStatusCode(403).send("No permission: You must be staff");
    }
  },
};
