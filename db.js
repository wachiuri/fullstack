const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kabu0902",
    database: "turing_fullstack"
});

connection.connect((err) => {

    if (err) {
        console.log("db connection err ", err.message);
    }
});


class Database {

    query(query) {
        return new Promise((resolve, reject) => {
            
            connection.query(query,(err,result)=>{
                
                if(err){
                    reject(err);
                    return;
                }
                
                resolve(result);
            });
        });
    }
    
    escape(value){
        return connection.escape(value);
    }
}


module.exports = new Database();