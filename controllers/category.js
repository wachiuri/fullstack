const CategoryModel = require("../models/category");
const express = require("express");

const categoryModel = new CategoryModel();
const expressRouter = express.Router();

expressRouter.get("/", async (req, res) => {

    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 20;

    let order = req.query.order;

    if (order !== 'category_id' && order !== 'name') {
        order = null;
    }

    let start = (page - 1) * limit;

    const fields = {
        department_id: req.query.department_id ? req.query.department_id : null,
        start: start,
        limit: limit,
        order: order
    };

    try {
        let result = await categoryModel.list(fields);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }
});

expressRouter.delete("/:id", async (req, res) => {

    try {
        let result = await categoryModel.delete(req.params.id);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }

});

expressRouter.get("/:category_id", async (req, res) => {

    try {
        let result = await categoryModel.getOne(req.params.category_id);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }

});

expressRouter.get("/inProduct/:product_id", async (req, res) => {

    try {
        let result = await categoryModel.listInProduct(req.params.product_id);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }

});

expressRouter.get("/inDepartment/:department_id", async (req, res) => {

    try {
        let result = await categoryModel.listInDepartment(req.params.department_id);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }

});

expressRouter.post("/", async (req, res) => {

    const category = req.body;

    try {
        let result = await categoryModel.create(category);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }
});

expressRouter.put("/:id", async (req, res) => {

    let category = req.body;
    category.category_id = req.params.id;

    try {
        let result = await categoryModel.update(category);
        res.send(result);
        res.end();
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
    }
});

module.exports = expressRouter;
