"use strict";
// controllerda yapılması gerekenler
// öncelikle expressin router motorunu çalıştır.
// ardından kullancağın permission middlewareleri varsa çağır. Ardından controllerımızı çağırıyoruz.
// sonrasında routelarını tanımla
// adresimizi yazıyoruz. ancak indexte yolu tam söyledik. Sonrasında da isteğimizi yazıyoruz post mu get mi vs.
// son olarak modulümüzü export ediyoruz

const router = require("express").Router();
const permissions = require("../middlewares/permissions");
const user = require("../controllers/user");

// adresimizi yazıyoruz. ancak indexte yolu tam söyledik. Sonrasında da isteğimizi yazıyoruz post mu get mi vs. list işlemi bir get vs. vs.
router.route("/").get(permissions.isLogin, user.list).post(user.create);

// parametreli route işlemlerini ayrıca tanımlamamız gerekiyor.
router
  .route("/:id")
  .get(permissions.isLogin, user.read)
  .post(permissions.isLogin, user.update)
  .put(permissions.isLogin, user.update)
  .patch(permissions.isLogin, user.update)
  .delete(permissions.isAdmin, user.delete);

module.exports = router;
