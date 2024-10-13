// server.js (Express and MySQL Backend)
const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // لإدارة التوكن
const nodemailer = require('nodemailer');
const db = require('./config/config'); // إعداد قاعدة البيانات
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// إعدادات Express
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://natheer777.github.io",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// استخدام الروترات
app.use(router);
app.use(express.static(path.join(__dirname, "public")));

// إعداد البريد الإلكتروني باستخدام Nodemailer
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // يمكنك تغييره حسب المزود
    auth: {
      user: process.env.EMAIL, // بريدك الإلكتروني
      pass: process.env.EMAIL_PASSWORD, // كلمة مرور بريدك
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// نقطة نهاية للتسجيل
app.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    country,
    age,
    gender,
    educationLevel,
    japaneseLevel,
    phone,
    email,
    password,
  } = req.body;

  try {
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء رمز التفعيل
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const sql = `INSERT INTO users (firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, password, verificationCode) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      firstName,
      lastName,
      country,
      age,
      gender,
      educationLevel,
      japaneseLevel,
      phone,
      email,
      hashedPassword,
      verificationCode,
    ]);

    // إرسال البريد الإلكتروني مع رمز التفعيل
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'User registered, verification email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error in database operation' });
  }
});

// نقطة نهاية للتحقق
app.post('/verify', async (req, res) => {

  const { email, verificationCode } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE email = ? AND verificationCode = ?';
    const [rows] = await db.query(sql, [email, verificationCode]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid verification code or email.' });
    }

    const updateSql = 'UPDATE users SET emailVerified = 1 WHERE email = ?';
    await db.query(updateSql, [email]);

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating verification status' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // التحقق من صحة المدخلات
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // استرجاع المستخدم من قاعدة البيانات
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];
    const hash = user.password; // التجزئة المخزنة في قاعدة البيانات

    // مقارنة كلمة المرور المدخلة مع التجزئة المخزنة
    const isMatch = await bcrypt.compare(password, hash);

    if (isMatch) {
      // تسجيل الدخول ناجح
      res.status(200).json({ message: 'Login successful!', user });
    } else {
      // كلمة المرور غير صحيحة
      res.status(401).json({ message: 'Invalid password.' });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
