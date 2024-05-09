"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */
const Brand = require("../models/brand");
module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags=["Brands"]
        #swagger.summary="Get Brands"
    */
    const data = await res.getModelList(Brand);
    res.status(200).send({
      error: false,
      data,
      detail: await res.getModelListDetails(Category),
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags=["Brands"]
        #swagger.summary="Create A Brand"
    */

    const data = await Brand.create(req.body);
    res.status(202).send({
      error: false,
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags=["Brands"]
        #swagger.summary="Get A Brand"
    */
    const data = await Brand.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags=["Brands"]
        #swagger.summary="Update A Brand"
    */
    const data = await Brand.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data,
      new: await Brand.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags=["Brands"]
        #swagger.summary="Delete A Brand"
    */
    const data = await Brand.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
