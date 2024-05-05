"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// User Controller:

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    // ! 1 /user yazınca sadece kendi kaydını görebilsin
    // sadece kendi kayıtlarını görebilsin
    const customFilters = req.user?.isAdmin ? {} : { _id: req.user._id };
    const data = await res.getModelList(User, customFilters);

    res.status(201).send({
      error: false,
      details: await res.getModelListDetails(User, customFilters),

      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "isActive": true,
                    "isStaff": false,
                    "isAdmin": false,
                }
            }
        */

    // yeni kayıtlarda admin/staff her zaman false. kimse kendisine isStaff veya isAdmin olarak kaydedemez.

    req.body.isStaff = false;
    req.body.isAdmin = false;

    // req.body ile userCreate işlemi yap.
    const data = await User.create(req.body);
    /* Auto login*/
    //    bir kullanıcı create edince otomatik token oluşsun

    const tokenData = await Token.create({
      userId: data._id,
      token: passwordEncrypt(data._id + Date.now()),
    });
    /* Auto login*/

    res.status(201).send({
      error: false,
      token: tokenData,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */

    // Başka bir kullanıcıyı görmesini engelle:
    // let customFilter = { _id: req.params.id };
    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { _id: req.user._id };
    }

    // sadece kendi kayıtlarını görebilir
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    // const data = await User.findOne({ _id: req.params.id });
    const data = await User.findOne(customFilters);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "isActive": true,
                    "isStaff": false,
                    "isAdmin": false,
                }
            }
        */

    // Admin olmayan, isStaff ve isAdmin durumunu değiştiremez.
    if (!req.user.isAdmin) {
      delete req.body.isStaff;
      delete req.body.isAdmin;
    }
    // Başka bir kullanıcıyı güncellemesini engelle:
    let customFilter = { _id: req.params.id };
    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { _id: req.user._id };
    }

    const data = await User.updateOne(customFilter, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await User.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    const data = await User.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
