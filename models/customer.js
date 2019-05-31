const db = require("../db");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");

class Customer {

    register(customer) {

        return new Promise(async (resolve, reject) => {

            try {

                let emailExists = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE email=" + db.escape(customer.email));

                if (emailExists.length > 0) {
                    let emailExistsErr = new Error("Email Already Exists");
                    emailExistsErr.status = 400;
                    emailExistsErr.errCode = "USR_04";
                    reject(emailExistsErr);
                    return;
                }

                let hash = await bcrypt.hash(customer.password, 10);

                let insertQuery = "INSERT INTO customer(name,email,password) "
                        + "VALUES(" + db.escape(customer.name) + ","
                        + db.escape(customer.email) + ","
                        + db.escape(hash)
                        + ")";

                let insertResult = await db.query(insertQuery);

                let inserted = await db.query("SELECT * "
                        + "FROM customer "
                        + "where customer_id=" + db.escape(insertResult.insertId));

                let newCustomer = inserted[0];
                let accessToken = jwt.sign({
                    customer_id: newCustomer.customer_id,
                    email: newCustomer.email
                }, config.get('jwtPrivateKey'));

                let newCustomerWithoutPassword = _.omit(newCustomer, ['password']);

                resolve({
                    customer: {
                        schema: newCustomerWithoutPassword
                    },
                    accessToken: "Bearer " + accessToken
                });
                ;

            } catch (e) {
                e.status = 500;
                e.errCode("USR_10");
                reject(e);
            }
        });
    }

    login(credentials) {

        return new Promise(async (resolve, reject) => {

            try {

                let customers = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE email=" + db.escape(credentials.email));

                if (customers.length === 0) {
                    let invalidEmailErr = new Error("Invalid email or password");
                    invalidEmailErr.status = 400;
                    invalidEmailErr.errCode = "USR_01";
                    reject(invalidEmailErr);
                    return;
                }

                let customer = customers[0];

                let passwordMatches = await bcrypt.compare(credentials.password, customer.password);

                if (!passwordMatches) {
                    let invalidPasswordErr = new Error("Invalid email or password");
                    invalidPasswordErr.status = 400;
                    invalidPasswordErr.errCode = "USR_01";
                    reject(invalidPasswordErr);
                    return;
                }

                let accessToken = jwt.sign({
                    customer_id: customer.customer_id,
                    email: customer.email
                }, config.get('jwtPrivateKey'));

                let newCustomerWithoutPassword = _.omit(customer, ['password']);

                resolve({
                    customer: {
                        schema: newCustomerWithoutPassword
                    },
                    accessToken: "Bearer " + accessToken
                });

            } catch (e) {

                e.status = 500;
                e.errCode = "USR_11";
                reject(e);
            }
        });
    }

    update(customer) {

        return new Promise(async (resolve, reject) => {

            try {

                //TODO: check that email doesn't already exist

                let query = "UPDATE customer "
                        + "SET name=" + db.escape(customer.name) + ","
                        + "email=" + db.escape(customer.email)
                        ;

                if (customer.day_phone && customer.day_phone.length > 0) {
                    query += ",day_phone=" + db.escape(customer.day_phone);
                }
                if (customer.eve_phone && customer.eve_phone.length > 0) {
                    query += ",eve_phone=" + db.escape(customer.eve_phone);
                }
                if (customer.mob_phone && customer.mob_phone.length > 0) {
                    query += ",mob_phone=" + db.escape(customer.mob_phone);
                }

                if (customer.password && customer.password.length > 0) {
                    let hash = await bcrypt.hash(customer.password, 10);
                    query += ",password=" + db.escape(hash);
                }

                query += " WHERE customer_id=" + db.escape(customer.customer_id);

                await db.query(query);

                let customers = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE customer_id=" + db.escape(customer.customer_id));

                let newCustomer = customers[0];

                let accessToken = jwt.sign({
                    customer_id: newCustomer.customer_id,
                    email: newCustomer.email
                }, config.get('jwtPrivateKey'));

                let newCustomerWithoutPassword = _.omit(newCustomer, ['password']);

                resolve({
                    customer: {
                        schema: newCustomerWithoutPassword
                    },
                    accessToken: "Bearer " + accessToken
                });


            } catch (e) {
                e.status = 500;
                e.errCode = "USR_13";
                reject(e);
            }

        });

    }

    get(customer_id) {
        return new Promise(async (resolve, reject) => {

            try {
                let customers = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE customer_id=" + db.escape(customer_id));

                let customer = customers[0];

                let accessToken = jwt.sign({
                    customer_id: customer.customer_id,
                    email: customer.email
                }, config.get('jwtPrivateKey'));

                let newCustomerWithoutPassword = _.omit(customer, ['password']);

                resolve({
                    customer: {
                        schema: newCustomerWithoutPassword
                    },
                    accessToken: "Bearer " + accessToken
                });
            } catch (e) {
                e.status = 500;
                e.errCode = "USR_12";
                reject(e);
            }
        });
    }

    facebook(access_token) {
        return {};
    }

    address(customer) {
        return new Promise(async (resolve, reject) => {
            try {

                let query = "UPDATE customer "
                        + "SET address_1=" + db.escape(customer.address_1)
                        + ",city=" + db.escape(customer.city)
                        + ",region=" + db.escape(customer.region)
                        + ",postal_code=" + db.escape(customer.postal_code)
                        + ",country=" + db.escape(customer.country)
                        + ",shipping_region_id=" + db.escape(customer.shipping_region_id);

                if (customer.address_2) {
                    query += ",address_2=" + db.escape(customer.address_2);
                }

                query += " WHERE customer_id=" + db.escape(customer.customer_id);

                await db.query(query);

                let newCustomers = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE customer_id=" + db.escape(customer.customer_id));

                let newCustomer = newCustomers[0];

                let newCustomerWithoutPassword = _.omit(newCustomer, ['password']);

                resolve(newCustomerWithoutPassword);

            } catch (e) {
                e.status = 500;
                e.errCode = "USR_14";
                reject(e);
            }
        });
    }

    creditCard(customer) {

        return new Promise(async (resolve, reject) => {

            try {
                let query = "UPDATE customer "
                        + "SET credit_card=" + db.escape(customer.credit_card)
                        + " WHERE customer_id=" + db.escape(customer.customer_id);
                
                await db.query(query);
                
                let newCustomers = await db.query("SELECT * "
                        + "FROM customer "
                        + "WHERE customer_id=" + db.escape(customer.customer_id));

                let newCustomer = newCustomers[0];

                let newCustomerWithoutPassword = _.omit(newCustomer, ['password']);

                resolve(newCustomerWithoutPassword);
                
            } catch (e) {
                
                e.status=500;
                e.errCode="USR_15";
                reject(e);
            }
        });
    }
}

module.exports = Customer;