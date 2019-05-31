class QueryBuilder {

    constructor() {
        this.columns = [];
        this.fromTable = null;
        this.joinTables = [];
        this.whereConditions = [];
        this.orderColumns = [];
        this.limits = null;
    }

    select(columns) {
        this.columns.push(columns);
        return this;
    }

    from(fromTable) {
        this.fromTable = fromTable;
        return this;
    }

    join(joinTable) {
        this.joinTables.push(" JOIN " + joinTable);
        return this;
    }

    leftJoin(joinTable) {
        this.joinTables.push(" LEFT JOIN " + joinTable);
        return this;
    }

    rightJoin(joinTable) {
        this.joinTables.push(" RIGHT JOIN " + joinTable);
        return this;
    }

    innerJoin(joinTable) {
        this.joinTables.push(" INNER JOIN " + joinTable);
        return this;
    }

    where(condition) {
        this.whereConditions.push(condition);
        return this;
    }

    order(orderColumn) {
        this.orderColumns.push(orderColumn);
        return this;
    }

    limit(limits) {
        this.limits = limits;
        return this;
    }

    toString() {
        let str = "";
        str += "SELECT " + this.columns.join(",");
        str += " FROM " + this.fromTable;

        if (this.joinTables.length > 0) {
            this.joinTables.forEach((joinTable, joinTableIndex) => {
                str += " " + joinTable
            });
        }

        if (this.whereConditions.length > 0) {
            str += " WHERE " + this.whereConditions.join(" AND ");
        }

        if (this.orderColumns.length > 0) {
            str += " ORDER BY " + this.orderColumns.join(",");
        }

        if (this.limits) {
            str += " LIMIT " + this.limits;
        }

        return str;

    }
}

module.exports = QueryBuilder;