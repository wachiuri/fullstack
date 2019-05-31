const express = require("express");
const expressRouter = express.Router();
const Customer = require('../models/customer');
const auth = require("../middleware/auth");

let customerModel = new Customer();

expressRouter.post("/", async (req, res) => {

    let customer = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        let result = await customerModel.register(customer);
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

expressRouter.post("/login", async (req, res) => {

    try {
        let result = await customerModel.login(req.body);
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

expressRouter.post("/facebook", async (req, res) => {

    try {
        let result = await customerModel.facebook(req.body.access_token);
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

expressRouter.put("/address", auth, async (req, res) => {

    let customer = req.body;
    customer.customer_id = req.user.customer_id;

    try {
        let result = await customerModel.address(customer);
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

expressRouter.put("/creditCard", auth, async (req, res) => {

    let customer = req.body;
    customer.customer_id = req.user.customer_id;

    try {
        let result = await customerModel.creditCard(customer);
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