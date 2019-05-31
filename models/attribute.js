const db = require("../db");
const QueryBuilder = require("../querybuilder");
class Attribute {

    create(attribute) {

        return new Promise(async (resolve, reject) => {

            try {
                let query = "INSERT INTO attribute(name) "
                        + "VALUES(" + db.escape(attribute.name) + ")";

                let insertResult = await db.query(query);

                let fetchInsertedResult = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(insertResult.insertId)
                        );

                resolve(fetchInsertedResult[0]);
            } catch (e) {

                e.status = 500;
                e.errCode = "ATT_01";
                reject(e);
            }

        });
    }

    update(attribute) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(attribute.attribute_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Attribute Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATT_02";
                    reject(notFoundErr);
                    return;
                }

                let query = "UPDATE attribute SET "
                        + "name=" + db.escape(attribute.name)
                        + " WHERE attribute_id=" + db.escape(attribute.attribute_id)
                        ;

                let updateResult = await db.query(query);

                let fetchUpdatedResults = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id="
                        + db.escape(attribute.attribute_id));

                resolve(fetchUpdatedResults[0]);


            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_03";
                reject(e);
            }
        });

    }

    list() {

        return new Promise(async (resolve, reject) => {
            try {
                let result = await db.query("SELECT * "
                        + "FROM attribute");
                resolve(result);
            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_04";
                reject(e);
            }
        });

    }

    delete(id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Attribute Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATT_04";
                    reject(notFoundErr);
                    return;
                }

                const checkProductAttributesQuery = "SELECT * "
                        + "FROM product_attribute "
                        + "WHERE attribute_value_id IN ("
                        + " SELECT attribute_value_id "
                        + " FROM attribute_value "
                        + " WHERE attribute_id=" + db.escape(id)
                        + ")";
                let checkProductAttributesResults = await db.query(checkProductAttributesQuery);

                if (checkProductAttributesResults.length > 0) {
                    let productAttributesExistError = new Error("There are "
                            + checkProductAttributesResults.length + " products "
                            + "with this attribute. Kindly remove the attribute "
                            + "from all products")
                            ;
                    productAttributesExistError.status = 400;
                    productAttributesExistError.errCode = "ATT_05";
                    reject(productAttributesExistError);
                    return;
                }

                const checkAttributeValueQuery = "SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_id=" + db.escape(id);

                let checkAttributeValueResults = await db.query(checkAttributeValueQuery);

                if (checkAttributeValueResults.length > 0) {
                    let attributeValuesExistError = new Error("There are "
                            + checkAttributeValueResults.length + " attribute "
                            + "values for this attribute. Kindly remove all attribute values "
                            + "for this attribute first");
                    attributeValuesExistError.status = 400;
                    attributeValuesExistError.errCode = "ATT_06";
                    reject(attributeValuesExistError);
                    return;
                }

                const deleteAttributeQuery = "DELETE "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(id);

                let results = await db.query(deleteAttributeQuery);

                resolve(getOneResult);

            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_07";
                reject(e);
            }
        });

    }

    getOne(id) {

        return new Promise(async (resolve, reject) => {

            try {
                let results = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(id));
                if (results.length === 0) {
                    let notFoundErr = new Error("Attribute Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATT_08";
                    reject(notFoundErr);
                    return;
                }

                let result = results[0];

                resolve(result);
            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_09";
                reject(e);
            }
        });

    }

    getValues(attribute_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM attribute "
                        + "WHERE attribute_id=" + db.escape(attribute_id));
                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Attribute Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATT_11";
                    reject(notFoundErr);
                    return;
                }

                let results = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_id=" + db.escape(attribute_id));

                resolve(results);

            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_10";
                reject(e);
            }
        });
    }

    getInProduct(product_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let results = await db.query("SELECT  av.attribute_value_id,a.name,av.value "
                        + "FROM product_attribute pa "
                        + "INNER JOIN attribute_value av USING(attribute_value_id) "
                        + "INNER JOIN attribute a USING(attribute_id) "
                        + "WHERE pa.product_id=" + db.escape(product_id));

                resolve(results);

            } catch (e) {
                e.status = 500;
                e.errCode = "ATT_11";
                reject(e);
            }
        });
    }
}

module.exports = Attribute;