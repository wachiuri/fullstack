const db = require("../db");
const QueryBuilder = require("../querybuilder");
const EventEmitter = require("events");
class AttributeValue extends EventEmitter {

    create(attributeValue) {

        return new Promise(async (resolve, reject) => {

            try {
                let query = "INSERT INTO attribute_value(attribute_id,value) "
                        + "VALUES(" + db.escape(attributeValue.attribute_id) + ","
                        + db.escape(attributeValue.value) + ")";
                let insertResult = await db.query(query);
                let newAttributeValue = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_value_id=" + db.escape(insertResult.insertId));
                resolve(newAttributeValue[0]);
            } catch (e) {
                e.status = 500;
                e.errCode = "ATV_01";
                reject(e);
            }
        });
    }

    update(attributeValue) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attributevalue_id=" + db.escape(attributeValue.attribute_value_id));
                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Attrbute Value Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATV_02";
                    reject(notFoundErr);
                    return;
                }

                let query = "UPDATE attribute SET "
                        + "attribute_id=" + db.escape(attributeValue.attribute_id)
                        + ",value=" + db.escape(attributeValue.value)
                        + " WHERE attribute_value_id=" + db.escape(attributeValue.attribute_value_id)
                        ;
                let updateResult = await db.query(query);
                let getUpdatedResult = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_value_id="
                        + db.escape(attributeValue.attribute_value_id));
                resolve(getUpdatedResult[0]);
            } catch (e) {
                e.status = 500;
                e.errCode = "ATV_03";
                reject(e);
            }
        });
    }

    list(fields) {

        return new Promise(async (resolve, reject) => {

            try {
                let queryBuilder = new QueryBuilder();
                queryBuilder.select("av.*")
                        .from("attribute_value av")
                        ;
                if (fields.attribute_id) {
                    queryBuilder.where("av.attribute_id=" + db.escape(fields.attribute_id));
                }

                if (fields.start && fields.limit) {
                    queryBuilder.limit(fields.start + "," + fields.limit);
                } else if (fields.limit) {
                    queryBuilder.limit(fields.limit);
                }

                if (fields.searchStr) {
                    queryBuilder.where("MATCH(av.value) AGAINST ("
                            + db.escape(fields.searchStr) + ")");
                    queryBuilder.order("MATCH(av.value) AGAINST ("
                            + db.escape(fields.searchStr) + ") DESC");
                }

                let listResults = await db.query(queryBuilder.toString());

                queryBuilder.columns = [];
                queryBuilder.select("count(*) as countAll");

                let countResults = await  db.query(queryBuilder.toString());

                resolve({
                    totalItems: countResults[0].countAll,
                    items: listResults
                });
            } catch (e) {

                e.status = 500;
                e.errCode = "ATV_04";
                reject(e);


            }
        });

    }

    delete(attribute_value_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_value_id=" + db.escape(attribute_value_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Attribute value not found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATV_05";
                    reject(notFoundErr);
                    return;
                }

                const checkProductAttributeQuery = "SELECT * "
                        + "FROM product_attribute "
                        + "WHERE attribute_value_id = " + db.escape(attribute_value_id);
                let checkProductAttributeResult = await db.query(checkProductAttributeQuery);
                if (checkProductAttributeResult.length > 0) {
                    let productsAttributesExistErr = new Error("Some products have "
                            + "have this attribute value. Kindly remove this attribute value "
                            + "from all products first.");
                    productsAttributesExistErr.status = 400;
                    reject(productsAttributesExistErr);
                    return;
                }

                const deleteAttributeValueQuery = "DELETE "
                        + "FROM attribute_value "
                        + "WHERE attribute_value_id=" + db.escape(attribute_value_id);
                let deleteResult = await db.query(deleteAttributeValueQuery);

                resolve(getOneResult[0]);


            } catch (e) {
                e.status = 500;
                e.errCode = "ATV_06";
                reject(e);
            }
        });
    }

    getOne(attribute_value_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResults = await db.query("SELECT * "
                        + "FROM attribute_value "
                        + "WHERE attribute_value_id=" + db.escape(attribute_value_id));
                if (getOneResults.length === 0) {
                    let notFoundErr = new Error("Attribute Value Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "ATV_07";
                    reject(notFoundErr);
                    return;
                }
                
                resolve(getOneResults[0]);
                
            } catch (e) {
                
                e.status=500;
                e.errCode="ATV_08";
                reject(e);
            }
        });
    }
}

module.exports = AttributeValue;