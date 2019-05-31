const express = require("express");
const expressRouter = express.Router();
const OrderModel = require("../models/order");
const auth = require("../middleware/auth");

let orderModel = new OrderModel();

expressRouter.post("/", auth, async(req, res) => {

    let order = req.body;
    order.customer_id = req.user.customer_id;
    try {
        let result = await orderModel.create(order);
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

expressRouter.get("/shortDetail/:order_id", auth, async(req, res) => {

    try {
        let result = await orderModel.get(req.params.order_id);
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

expressRouter.get("/inCustomer", auth, async(req, res) => {

    try {
        let result = await orderModel.inCustomer(req.user.customer_id);
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


expressRouter.get("/:order_id", auth, async(req, res) => {

    try {
        let result = await orderModel.get(req.params.order_id);
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