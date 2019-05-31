const db = require("../db");
const QueryBuilder = require("../querybuilder");

class Department {

    create(department) {

        return new Promise(async (resolve, reject) => {

            try {
                const query = "INSERT INTO department(name,description) "
                        + "VALUES(" + db.escape(department.name) + ","
                        + db.escape(department.description) + ")";

                let insertResult = await db.query(query);

                let newDepartment = await db.query("SELECT * "
                        + "FROM department "
                        + "WHERE department_id=" + db.escape(insertResult.insertId));

                resolve(newDepartment[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "DEP_03";
                reject(e);
            }
        });
    }

    update(department) {

        return new Promise(async (resolve, reject) => {

            try {
                let getOneResult = await db.query("SELECT * "
                        + "FROM department "
                        + "WHERE department_id="
                        + db.escape(department.department_id));

                if (getOneResult.length === 0) {
                    let notFoundErr = new Error("Department Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "DEP_02";
                    reject(notFoundErr);
                    return;
                }

                const query = "UPDATE department SET "
                        + "name=" + db.escape(department.name)
                        + ",description=" + db.escape(department.description)
                        + " WHERE department_id=" + db.escape(department.department_id)
                        ;

                let updateResult = await db.query(query);

                let newDepartment = await db.query("SELECT * "
                        + "FROM department "
                        + "WHERE department_id=" + db.escape(department.department_id));

                resolve(newDepartment[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "DEP_03";
                reject(e);
            }
        });
    }

    list(fields) {

        return new Promise(async (resolve, reject) => {

            try {
                let queryBuilder = new QueryBuilder();

                queryBuilder.select("d.*")
                        .from("department d")
                        ;

                if (fields.start && fields.limit) {
                    queryBuilder.limit(fields.start + "," + fields.limit);
                } else if (fields.limit) {
                    queryBuilder.limit(fields.limit);
                }

                let listResults = db.query(queryBuilder.toString());

                resolve(listResults);

            } catch (e) {

                e.status = 500;
                e.errCode = "DEP_04";
                reject(e);
            }
        });
    }

    delete(department_id) {

        return new Promise(async (resolve, reject) => {

            try {
                let departments = await db.query("SELECT * "
                        + "FROM department "
                        + "WHERE department_id=" + db.escape(department_id));

                if (departments.length === 0) {
                    let notFoundErr = new Error("Department Not Found");
                    notFoundErr.status = 404;
                    notFoundErr.errCode = "DEP_02";
                    reject(notFoundErr);
                    return;
                }

                const findCategoriesQuery = "SELECT * "
                        + "FROM category "
                        + "WHERE department_id=" + db.escape(department_id);

                let categories = await db.query(findCategoriesQuery);

                if (categories.length > 0) {
                    let categoriesExistError = new Error("There are " + categories.length
                            + " categories in this department. Kindly move them to another "
                            + "department  or delete them first");
                    categoriesExistError.status = 400;
                    categoriesExistError.errCode = "DEP_05";
                    reject(categoriesExistError);
                    return;
                }

                const deleteDepartmentQuery = "DELETE "
                        + "FROM department "
                        + "WHERE department_id=" + db.escape(department_id);

                await db.query(deleteDepartmentQuery);

                resolve(departments[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "DEP_06";
                reject(e);
            }
        });
    }

    getOne(id) {

        return new Promise(async (resolve, reject) => {

            try {
                let departments = await db.query("SELECT * "
                        + "FROM department "
                        + "WHERE department_id=" + db.escape(id));

                if (departments.length === 0) {
                    let notFoundError = new Error("Department Not Found.");
                    notFoundError.status = 404;
                    notFoundError.errCode = "DEP_02";
                    reject(notFoundError);
                    return;
                }

                resolve(departments[0]);

            } catch (e) {
                e.status = 500;
                e.errCode = "DEP_07";
                reject(e);
            }
        });
    }
}

module.exports = Department;