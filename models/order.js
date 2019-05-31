const db = require("../db");

class Order {

    create(order) {

        return new Promise(async (resolve, reject) => {

            try {
                let orderIds = await db.query("call shopping_cart_create_order("
                        + db.escape(order.cart_id) + "," + db.escape(order.customer_id)
                        + "," + db.escape(order.shipping_id) + "," + db.escape(order.tax_id) + ")");

                console.log(orderIds);

                resolve(orderIds[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "ORD_01";
                reject(e);
            }
        });
    }

    get(order_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let query = "SELECT o.order_id, o.total_amount, o.created_on, "
                        + "o.shipped_on, o.status, o.comments, o.customer_id, o.auth_code,"
                        + "o.reference, o.shipping_id, s.shipping_type, s.shipping_cost,"
                        + "o.tax_id, t.tax_type, t.tax_percentage "
                        + "FROM orders o "
                        + "INNER JOIN tax t ON t.tax_id = o.tax_id "
                        + "INNER JOIN shipping s ON s.shipping_id = o.shipping_id "
                        + "WHERE o.order_id = " + db.escape(order_id);
                
                console.log("get order detailt query ",query);

                let orders = await db.query(query);

                if (orders.length === 0) {
                    let notFoundErr = new Error("Order Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ORD_03";
                    reject(notFoundErr);
                    return;
                }

                resolve(orders[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "ORD_02";
                reject(e);
            }
        });
    }

    inCustomer(customer_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let orders = await db.query("SELECT * "
                        + "FROM orders "
                        + "WHERE customer_id=" + db.escape(customer_id));

                resolve(orders);

            } catch (e) {
                e.status = 500;
                e.errCode = "ORD_02";
                reject(e);
            }
        });
    }

}

module.exports = Order;