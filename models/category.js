const db = require("../db");
const QueryBuilder = require("../querybuilder");

class Category {

    create(category) {

        return new Promise(async (resolve, reject) => {

            try {
                const query = "INSERT INTO category(department_id,name,description) "
                        + "VALUES(" + db.escape(category.department_id) + ","
                        + db.escape(category.name) + "," + db.escape(category.description) + ")";
                let insertResult = await db.query(query);

                let fetchInsertedResult = await db.query("SELECT * "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(insertResult.insertId));

                resolve(fetchInsertedResult[0]);

            } catch (e) {

                e.status = 500;
                e.errCode = "CAT_02";
                reject(e);
            }
        });

    }

    update(category) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(category.category_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Category Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "CAT_01";
                    reject(notFoundErr);
                    return;
                }

                const query = "UPDATE category SET "
                        + "department_id=" + db.escape(category.department_id)
                        + ",name=" + db.escape(category.name)
                        + ",description=" + db.escape(category.description)
                        + " WHERE category_id=" + db.escape(category.category_id)
                        ;

                let updateResult = await db.query(query);

                let findUpdated = await db.query("SELECT * "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(category.category_id));
                resolve(findUpdated[0]);


            } catch (e) {
                e.status = 500;
                e.errCode = "CAT_03";
                reject(e);
            }
        });
    }

    listInProduct(product_id, handler) {

        return new Promise(async (resolve, reject) => {

            try {
                let results = await db.query("SELECT c.* "
                        + "FROM product_category pc "
                        + "INNER JOIN category c USING(category_id) "
                        + "WHERE pc.product_id=" + db.escape(product_id));
                resolve(results);
            } catch (e) {
                e.status = 500;
                e.errcode = "CAT_04";
                reject(e);
            }
        });
    }

    listInDepartment(department_id, handler) {

        return new Promise(async (resolve, reject) => {

            try {
                let results = await db.query("SELECT c.* "
                        + "FROM category c "
                        + "WHERE c.department_id=" + db.escape(department_id));
                resolve(results);
            } catch (e) {
                e.status = 500;
                e.errCode = "CAT_05";
            }
        });

    }

    list(fields) {

        return new Promise(async(resolve, reject) => {

            try {
                let queryBuilder = new QueryBuilder();

                queryBuilder.select("c.*")
                        .from("category c")
                        ;

                if (fields.department_id) {
                    queryBuilder.where("c.department_id=" + db.escape(fields.department_id));
                }

                if (fields.start && fields.limit) {
                    queryBuilder.limit(fields.start + "," + fields.limit);
                } else if (fields.limit) {
                    queryBuilder.limit(fields.limit);
                }

                if (fields.order) {
                    queryBuilder.order(fields.order);
                }

                let listResults = await db.query(queryBuilder.toString());

                queryBuilder.columns = [];
                queryBuilder.limits = null;
                queryBuilder.select("count(*) as countAll");

                let countResults = await db.query(queryBuilder.toString());

                resolve({
                    count: countResults[0].countAll,
                    rows: listResults
                });

            } catch (e) {

                e.status = 500;
                e.errCode = "CAT_06";
                reject(e);
            }
        });

    }

    delete(category_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(category_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Category Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "CAT_01";
                    reject(notFoundErr);
                    return;
                }

                const checkProductsQuery = "SELECT COUNT(*) AS countOfProducts "
                        + "FROM product_category "
                        + "WHERE category_id=" + db.escape(category_id);

                let checkProductsResults = await db.query(checkProductsQuery);

                if (checkProductsResults[0].countOfProducts > 0) {
                    let productsExistErr = new Error("There are "
                            + checkProductsResults[0].countOfProducts
                            + " products in this category. Kindly move them to another category "
                            + "or delete them first.");
                    productsExistErr.status = 400; //conflict
                    productsExistErr.errCode = "CAT_09";
                    reject(productsExistErr);
                    return;
                }

                const deleteCategoryQuery = "DELETE "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(category_id);

                let deleteResult = await db.query(deleteCategoryQuery);

                resolve(getOneResult[0]);

            } catch (e) {

                e.status = 500;
                e.errCode = "CAT_07";
                reject(e);
            }
        });

    }

    getOne(category_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResults = await db.query("SELECT * "
                        + "FROM category "
                        + "WHERE category_id=" + db.escape(category_id));

                if (getOneResults.length === 0) {
                    let notFoundErr = new Error("Category Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "CAT_01";
                    reject(notFoundErr);
                }
                
                resolve(getOneResults[0]);

            } catch (e) {
                
                e.status=500;
                e.errCode="CAT_08";
            }
        });
    }
}

module.exports = Category;