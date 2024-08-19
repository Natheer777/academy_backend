const mysql = require('mysql2')
const db = mysql.createPool({
    host:'b6cg8mpnnxei6eygavd5-mysql.services.clever-cloud.com',
    port:3306,
    user:'uo3sgblsubaqgefa',
    database:'b6cg8mpnnxei6eygavd5',
    password:'3xtHxqDjQCw0JMDpY1NN'
})
db.getConnection((err , connection)=>{
    if(err){
        console.error('Bad connect' ,err)
        return;
    }else{
        console.log('good connect');
        connection.release()
    }
})
module.exports = db