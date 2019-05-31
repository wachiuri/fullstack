const express = require("express");
const expressRouter = express.Router();
const Customer = require('../models/customer');
const auth = require("../middleware/auth");

let customerModel = new Customer();

expressRouter.put("/", auth, async (req, res) => {

    let customer = req.body;
    customer.customer_id = req.user.customer_id;

    try {
        let result = await customerModel.update(customer);
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

expressRouter.get("/", auth, async (req, res) => {

    try {
        let result = await customerModel.get(req.user.customer_id);
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