const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'pratik@2601',
    database:'car-reantal'
});

pool.getConnection((err, connection)=>{
    if(err){
        console.log("DB ERROR:", err);
    }else{
        console.log("MYSQL CONNECTED");
        connection.release();
    }
});

module.exports = pool.promise();