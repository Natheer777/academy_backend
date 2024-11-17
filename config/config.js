const mysql = require('mysql2/promise');

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createPool({
    // host: 'b6cg8mpnnxei6eygavd5-mysql.services.clever-cloud.com',
    // port: 3306,
    // user: 'uo3sgblsubaqgefa',
    // database: 'b6cg8mpnnxei6eygavd5',
    // password: '3xtHxqDjQCw0JMDpY1NN',

    host: 'srv621.hstgr.io',
    password: 'Sawavps2024%',
    user: 'u229294786_T7V3N',
    database: 'u229294786_pGFtY',
});


// اختبار الاتصال
(async () => {
    try {
        const connection = await db.getConnection();  // الحصول على اتصال
        console.log('Good connection');
        connection.release();  // تحرير الاتصال بعد الاستخدام
    } catch (err) {
        console.error('Bad connection', err);
    }
})();

module.exports = db;
