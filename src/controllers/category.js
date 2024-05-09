"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
// CATEGORY CONTROLLER
const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags=["Categories"]
        #swagger.summary="Get Categories"
    */
    const data = await res.getModelList(Category);
    res.status(200).send({
      error: false,
      data,
      detail: await res.getModelListDetails(Category),
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Create A Category"
        #swagger.description=
    */
  
  },
  read: async (req, res) => {},
  update: async (req, res) => {},
  delete: async (req, res) => {},
};
