const DepartmentModel = require("../models/department");
const express = require("express");
const departmentModel = new DepartmentModel();

const expressRouter = express.Router();

expressRouter.get("/", async (req, res) => {

    const fields = {
        start: req.query.start ? req.query.start : 0,
        limit: req.query.limit ? req.query.limit : 10
    };

    try {
        let result = await departmentModel.list(fields);
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

expressRouter.delete("/:department_id", async (req, res) => {

    try {
        let result = await departmentModel.delete(req.params.department_id);
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

expressRouter.get("/:department_id", async (req, res) => {

    try {
        let result = await departmentModel.getOne(req.params.department_id);
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

    const department = req.body;

    try {
        let result = await departmentModel.create(department);
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

expressRouter.put("/:department_id", async (req, res) => {

    let department = req.body;
    department.department_id = req.params.department_id;

    try {
        let result = await departmentModel.update(department);
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