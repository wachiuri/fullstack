const AttributeModel = require("../models/attribute");
const express = require("express");

const expressRouter = express.Router();
const attributeModel = new AttributeModel();

expressRouter.get("/", async (req, res) => {

    try {
        let result = await attributeModel.list();
        res.send(result);
        res.end();
    } catch (err) {
        res.status(err.status);
        res.send({
            code: err.errCode,
            message: err.message,
            status: err.status
        });
        res.end();
    }
});


expressRouter.delete("/:attribute_id", async (req, res) => {

    try {
        let result = await attributeModel.delete(req.params.attribute_id);
        res.send(result);
        res.end();
    } catch (err) {
        res.status(err.status);
        res.send({
            code: err.errCode,
            message: err.message,
            status: err.status
        });
        res.end();
    }


});

expressRouter.get("/:attribute_id", async (req, res) => {

    try {
        let result = await attributeModel.getOne(req.params.attribute_id);
        res.send(result);
        res.end();
    } catch (err) {
        res.status(err.status);
        res.send({
            code: err.errCode,
            message: err.message,
            status: err.status
        });
        res.end();
    }

});

expressRouter.post("/", async (req, res) => {

    const attribute = req.body;
    try {
        let result = await attributeModel.create(attribute);
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

expressRouter.put("/:attribute_id", async (req, res) => {

    let attribute = req.body;
    attribute.attribute_id = req.params.attribute_id;

    try {
        let updateResult = await attributeModel.update(attribute);

        res.send(updateResult);
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

expressRouter.get("/values/:attribute_id", async (req, res) => {

    try {
        let results = await attributeModel.getValues(req.params.attribute_id);
        res.send(results);
        res.end();
    } catch (err) {
        res.status(err.status);
        res.send({
            code: err.errCode,
            message: err.message,
            status: err.status
        });
        res.end();
    }
});

expressRouter.get("/inProduct/:product_id", async (req, res) => {

    try {
        let results = await attributeModel.getInProduct(req.params.product_id);
        res.send(results);
    } catch (err) {
        res.status(err.status);
        res.send({
            code: err.errCode,
            message: err.message,
            status: err.status
        });
    }
});


module.exports = expressRouter;