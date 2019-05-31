const AttributeValueModel = require("../models/attributevalue");
const express = require("express");

const attributeValueModel = new AttributeValueModel();
const expressRouter = express.Router();


expressRouter.post("/", async (req, res) => {

    const fields = {
        start: req.body.start ? req.body.start : 0,
        limit: req.body.limit ? req.body.limit : 24,
        searchStr: req.body.searchStr ? req.body.searchStr : null
    };

    try {
        let result = await attributeValueModel.list(fields);
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
        let result = await attributeValueModel.delete(req.params.id);
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

expressRouter.get("/:id", async (req, res) => {

    try {
        let result = await attributeValueModel.getOne(req.params.id);

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

expressRouter.post("/save", async (req, res) => {

    const attributeValue = req.body;

    try {
        let result = await attributeValueModel.save(attributeValue);
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