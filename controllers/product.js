const formidable = require("formidable");
const fs = require("fs");
const express = require("express");
const expressRouter = express.Router();
const auth = require("../middleware/auth");
const ProductModel = require('../models/product');
expressRouter.get("/", async (req, res) => {

    let productModel = new ProductModel();
    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 20;
    let start = (page - 1) * limit;
    const fields = {
        start: start,
        limit: limit,
        description_length: req.query.description_length ? req.query.description_length : 200,
        department_id: req.query.department_id ? req.query.department_id : null,
        category_id: req.query.category_id ? req.query.category_id : null,
        query_string: req.query.query_string ? req.query.query_string : null,
        all_words: req.query.all_words ? req.query.all_words : "on"
    };
    try {
        let result = await productModel.list(fields);
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
expressRouter.get("/search", async (req, res) => {

    let productModel = new ProductModel();
    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 20;
    let start = (page - 1) * limit;
    const fields = {
        start: start,
        limit: limit,
        description_length: req.query.description_length ? req.query.description_length : 200,
        department_id: req.query.department_id ? req.query.department_id : null,
        category_id: req.query.category_id ? req.query.category_id : null,
        query_string: req.query.query_string ? req.query.query_string : null,
        all_words: req.query.all_words ? req.query.all_words : "on"
    };
    try {
        let result = await productModel.list(fields);
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
expressRouter.get("/inCategory/:category_id", async (req, res) => {

    let productModel = new ProductModel();
    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 20;
    let start = (page - 1) * limit;
    const fields = {
        start: start,
        limit: limit,
        description_length: req.query.description_length ? req.query.description_length : 200,
        department_id: req.query.department_id ? req.query.department_id : null,
        category_id: req.params.category_id ? req.params.category_id : null,
        query_string: req.query.query_string ? req.query.query_string : null,
        all_words: req.query.all_words ? req.query.all_words : "on"
    };
    try {
        let result = await productModel.list(fields);
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

    let productModel = new ProductModel();
    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 20;
    let start = (page - 1) * limit;
    const fields = {
        start: start,
        limit: limit,
        description_length: req.query.description_length ? req.query.description_length : 200,
        department_id: req.params.department_id ? req.params.department_id : null,
        category_id: req.query.category_id ? req.query.category_id : null,
        query_string: req.query.query_string ? req.query.query_string : null,
        all_words: req.query.all_words ? req.query.all_words : "on"
    };
    try {
        let result = await productModel.list(fields);
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
expressRouter.post("/:product_id/uploadimage", async (req, res) => {

    let product_id = req.params.product_id;
    let productModel = new ProductModel();
    try {
        let getOne = await productModel.getOne(product_id);
    } catch (e) {
        res.status(e.status);
        res.send({
            code: e.errCode,
            message: e.message,
            status: e.status
        });
        res.end();
        return;
    }

    let form = formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (err) {
            res.status(500);
            res.send({
                code: "PRD_02",
                message: err.message,
                status: 500
            });
            res.end();
            return;
        }

        fs.rename(files.image.path, "../public/images/" + files.image.name, async (uploadImageErr) => {
            if (uploadImageErr) {
                res.status(500);
                res.send({
                    code: "PRD_03",
                    message: uploadImageErr.message,
                    status: 500
                });
                res.end();
                return;
            }

            try {
                let result = await productModel.uploadImage(product_id, files.image.name);
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
    });
});

expressRouter.post("/:product_id/uploadimage_2", async (req, res) => {

    let product_id = req.params.product_id;
    let productModel = new ProductModel();
    try {
        let getOne = await productModel.getOne(product_id);
    } catch (e) {
        res.status(e.status);
        res.send({
            message: e.message,
            code: e.errCode,
            status: e.status
        });
        res.end();
        return;
    }

    let form = formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (err) {
            res.status(500);
            res.send({
                code: "PRD_05",
                message: err.message,
                status: 500
            });
            res.end();
            return;
        }

        fs.rename(files.image_2.path, "../public/images/" + files.image_2.name, async (uploadImageErr) => {
            if (uploadImageErr) {
                res.status(500);
                res.send({
                    code: "PRD_06",
                    message: uploadImageErr.message,
                    status: 500
                });
                res.end();
                return;
            }

            try {
                let result = await productModel.uploadImage2(product_id);
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
    });
});

expressRouter.post("/:product_id/uploadthumbnail", async (req, res) => {

    let product_id = req.params.product_id;
    let productModel = new ProductModel();

    try {
        await productModel.getOne(product_id);
    } catch (getOneErr) {

        res.status(getOneErr.status);
        res.send({
            message: getOneErr.message,
            code: getOneErr.errCode,
            status: getOneErr.status
        });
        res.end();
        return;
    }

    let form = formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (err) {
            res.status(500);
            res.send({
                code: "PRD_09",
                message: err.message,
                status: 500
            });
            res.end();
            return;
        }

        fs.rename(files.thumbnail.path, "../public/images/" + files.thumbnail.name, async (uploadImageErr) => {
            if (uploadImageErr) {
                res.status(500);
                res.send({
                    code: "PRD_10",
                    message: uploadImageErr.message,
                    status: 500
                });
                res.end();
                return;
            }

            try {
                let result = await productModel.uploadThumbnail(product_id);
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
    });
});

expressRouter.post("/", async (req, res) => {

    let productModel = new ProductModel();
    let product = req.body;

    try {
        let result = await productModel.create(product);
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

expressRouter.put("/:product_id", async (req, res) => {

    let productModel = new ProductModel();
    let product = req.body;
    product.product_id = req.params.product_id;

    try {
        let result = await productModel.update(product);
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

expressRouter.delete("/:product_id", async (req, res) => {

    let productModel = new ProductModel();

    try {
        let result = await productModel.delete(req.params.product_id);
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

expressRouter.get("/:product_id", async (req, res) => {
    let productModel = new ProductModel();

    try {
        let result = await productModel.getOne(req.params.product_id);
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

expressRouter.get("/:product_id/details", async (req, res) => {

    let productModel = new ProductModel();

    try {
        let result = await productModel.getOne(req.params.product_id);
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

expressRouter.get("/:product_id/locations", async (req, res) => {

    let productModel = new ProductModel();

    try {
        let result = await productModel.locations(req.params.product_id);
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

expressRouter.get("/:product_id/reviews", async (req, res) => {
    
    let productModel = new ProductModel();
    
    try {
        let result = await productModel.reviews(req.params.product_id);
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

expressRouter.post("/:product_id/reviews", auth, async (req, res) => {
    console.log("in post product reviews");
    let productModel = new ProductModel();
    let review = req.body;
    review.customer_id = req.user.customer_id;
    review.product_id = req.params.product_id;
    
    try {
        let result = await productModel.saveReview(review);
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