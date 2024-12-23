const mysql =require('mysql2');
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'abc.123',
    database:'e_pharmacy'
});
db.connect(err=>{
    if(err){
        console.error("Database connection error");
        process.exit(1);
    }
    console.log("Database is connected");
});
module.exports = db;