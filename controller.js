const express = require("express");
const expressRouter = express();
expressRouter.use(express.json());
expressRouter.use(express.urlencoded({extended:true}));
expressRouter.use(express.static("public"));

const productRouter = require("./controllers/product");
const categoryRouter = require("./controllers/category");
const departmentRouter = require("./controllers/department");
const attributeRouter = require("./controllers/attribute");
const attributeValueRouter = require("./controllers/attributevalue");
const customersRouter = require("./controllers/customers");
const customerRouter = require("./controllers/customer");
const orderRouter = require("./controllers/order");

expressRouter.use("/products", productRouter);
expressRouter.use("/categories", categoryRouter);
expressRouter.use("/departments", departmentRouter);
expressRouter.use("/attributes", attributeRouter);
expressRouter.use("/attributevalues", attributeValueRouter);
expressRouter.use("/customers", customersRouter);
expressRouter.use("/customer", customerRouter);
expressRouter.use("/orders", orderRouter);

expressRouter.listen(3000);