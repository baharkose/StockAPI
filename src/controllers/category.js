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
    const data = await Category.create(req.body);
    res.status(202).send({
      error: false,
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags=["Categories"]
      #swagger.summary="Get A Category"
      #swagger.description=""
    */
    // const data = await getModelList(Category, { _id: req.params.id });
    const data = await Category.findOne({ _id: req.params.id });
    res.status(201).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags=["Categories"]
      #swagger.summary="Uptade A Category"
      #swagger.description:""
    */
    const data = await Category.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data,
      new: await Category.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /* 
      #swagger.tags=["Categories"]
      #swagger.summary="Delete A Category"
      #swagger.description=""
    */

    const data = await Category.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
