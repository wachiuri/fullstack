const db = require("../db");
const QueryBuilder = require("../querybuilder");

class Product {

    create(product) {

        return new Promise(async (resolve, reject) => {

            try {
                let query = "INSERT INTO product(name,description,price,discounted_price,"
                        + "display) "
                        + "VALUES(" + db.escape(product.name) + ","
                        + db.escape(product.description) + ","
                        + db.escape(product.price) + ","
                        + db.escape(product.discounted_price) + ","
                        + db.escape(product.display) + ")";
                let insertResult = await db.query(query);

                let newProduct = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(insertResult.insertId));

                resolve(newProduct[0]);
            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_01";
                reject(e);
            }
        });
    }

    update(product) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product.product_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_02";
                    reject(notFoundErr);
                    return;
                }

                let query = "UPDATE product SET "
                        + "name=" + db.escape(product.name) + ","
                        + "description=" + db.escape(product.description) + ","
                        + "price=" + db.escape(product.price) + ","
                        + "discounted_price=" + db.escape(product.discounted_price) + ","
                        + "display=" + db.escape(product.display)
                        + " WHERE product_id=" + db.escape(product.product_id)
                        ;
                let updateResult = await db.query(query);

                let newProduct = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product.product_id));

                resolve(newProduct[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_03";
                reject(e);
            }
        });
    }

    list(fields) {

        return new Promise(async (resolve, reject) => {

            try {
                let queryBuilder = new QueryBuilder();
                queryBuilder.select("p.*,IF(LENGTH(p.description) <= "
                        + fields.description_length + ","
                        + "p.description,"
                        + "CONCAT(LEFT(p.description, " + fields.description_length + "),"
                        + "'...')) AS description")
                        .from("product p")
                        ;
                if (fields.category_id || fields.department_id) {
                    queryBuilder.leftJoin("product_category pc using(product_id)");
                    if (fields.category_id) {
                        queryBuilder.where("category_id=" + db.escape(fields.category_id));
                    }

                    if (fields.department_id) {
                        queryBuilder.leftJoin("category c using(category_id)")
                                .where("c.department_id=" + db.escape(fields.department_id));
                        ;
                    }
                }

                if (fields.start && fields.limit) {
                    queryBuilder.limit(fields.start + "," + fields.limit);
                } else if (fields.limit) {
                    queryBuilder.limit(fields.limit);
                }

                if (fields.query_string && fields.all_words === "on") {
                    queryBuilder.where("MATCH(p.name,p.description) AGAINST ("
                            + db.escape(fields.query_string) + " IN BOOLEAN MODE)");
                    queryBuilder.order("MATCH(p.name,p.description) AGAINST ("
                            + db.escape(fields.query_string) + " IN BOOLEAN MODE) DESC");
                } else if (fields.query_string) {
                    queryBuilder.where("MATCH(p.name,p.description) AGAINST ("
                            + db.escape(fields.query_string) + ")");
                    queryBuilder.order("MATCH(p.name,p.description) AGAINST ("
                            + db.escape(fields.query_string) + ") DESC");
                }

                let results = await db.query(queryBuilder.toString());

                queryBuilder.columns = [];
                queryBuilder.select("count(*) as countAll");
                let countResults = await db.query(queryBuilder.toString());

                resolve({
                    count: countResults[0].countAll,
                    rows: results
                });

            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_04";
                reject(e);
            }
        });
    }

    delete(product_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_05";
                    reject(notFoundErr);
                    return;
                }

                await db.query("call catalog_delete_product(" + db.escape(product_id) + ")");

                resolve(getOneResult[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_06";
                reject(e);
            }
        });

    }

    uploadImage(product_id, image) {

        return new Promise(async (resolve, reject) => {

            try {
                await db.query("UPDATE product SET "
                        + "image=" + db.escape(image)
                        + "WHERE product_id=" + db.escape(product_id));

                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));
                resolve(getOne);

            } catch (e) {

                e.status = 500;
                e.errCode = "PRD_07";
                reject(e);
            }
        });
    }

    uploadImage2(product_id, image2) {

        return new Promise(async (resolve, reject) => {

            try {
                await db.query("UPDATE product SET "
                        + "image_2=" + db.escape(image2)
                        + "WHERE product_id=" + db.escape(product_id));

                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));
                resolve(getOne);

            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_08";
                reject(e);
            }
        });
    }

    uploadThumbnail(product_id, thumbnail, handler) {

        return new Promise(async (resolve, reject) => {

            try {
                await db.query("UPDATE product SET "
                        + "thumbnail=" + db.escape(thumbnail)
                        + "WHERE product_id=" + db.escape(product_id));
                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));
                resolve(getOne);
            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_09";
                reject(e);
            }

        });
    }

    getOne(product_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let results = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));

                if (results.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_10";
                    reject(notFoundErr);
                    return;
                }

                let result = results[0];
                result.categories = await db.query("SELECT c.* "
                        + "FROM product_category pc "
                        + "INNER JOIN category c using(category_id) "
                        + "WHERE pc.product_id=" + db.escape(product_id));

                result.attributes = await db.query("SELECT pa.*,a.name,"
                        + "av.value "
                        + "FROM product_attribute pa "
                        + "INNER JOIN attribute_value av USING(attribute_value_id) "
                        + "INNER JOIN attribute a USING(attribute_id) "
                        + "WHERE pa.product_id=" + db.escape(product_id));

                resolve(result);


            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_11";
                reject(e);
            }
        });
    }

    locations(product_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));

                if (getOne.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_12";
                    reject(notFoundErr);
                    return;
                }

                let locations = await db.query("SELECT c.category_id, "
                        + "c.name AS category_name, c.department_id,"
                        + "(SELECT name "
                        + "FROM   department "
                        + "WHERE  department_id = c.department_id) AS department_name "
                        + "FROM   category c "
                        + "WHERE  c.category_id IN "
                        + "(SELECT category_id "
                        + "FROM   product_category "
                        + "WHERE  product_id = " + db.escape(product_id) + ")");

                resolve(locations);
            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_13";
            }

        });
    }

    reviews(product_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(product_id));

                if (getOne.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_14";
                    reject(notFoundErr);
                    return;
                }

                let reviews = db.query("SELECT c.name, r.review, r.rating, r.created_on "
                        + "FROM review r "
                        + "INNER JOIN customer c "
                        + "ON c.customer_id = r.customer_id "
                        + "WHERE r.product_id = " + db.escape(product_id)
                        + "ORDER BY r.created_on DESC");

                resolve(reviews);


            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_15";
                reject(e);
            }
        });

    }

    saveReview(review) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOne = await db.query("SELECT * "
                        + "FROM product "
                        + "WHERE product_id=" + db.escape(review.product_id));
                if (getOne.length === 0) {
                    let notFoundErr = new Error("Product Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "PRD_16";
                    reject(notFoundErr);
                    return;
                }

                let reviewId = 0;

                let existingReview = await db.query("SELECT * "
                        + "FROM review "
                        + "WHERE customer_id=" + db.escape(review.customer_id)
                        + " AND product_id=" + db.escape(review.product_id));
                if (existingReview.length === 0) {

                    let insertQuery = "INSERT INTO review(review,rating,customer_id,product_id,created_on) "
                            + "VALUES(" + db.escape(review.review) + ","
                            + db.escape(review.rating) + "," + db.escape(review.customer_id) + ","
                            + db.escape(review.product_id) + ",now())"
                            ;

                    let insertResult = await db.query(insertQuery);
                    reviewId = insertResult.insertId;

                } else {
                    reviewId = existingReview[0].review_id;
                    await db.query("UPDATE review "
                            + "SET review=" + db.escape(review.review) + ","
                            + "rating=" + db.escape(review.rating)
                            + " WHERE review_id=" + db.escape(reviewId));
                }

                let newReview = await db.query("SELECT * "
                        + "FROM review "
                        + "WHERE review_id=" + db.escape(reviewId));

                resolve(newReview);

            } catch (e) {
                e.status = 500;
                e.errCode = "PRD_17";
                reject(e);
            }
        });
    }
}

module.exports = Product;