const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./config/config');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// إعدادات Express
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://natheer777.github.io",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://academy-backend-pq91.onrender.com",
      "https://japaneseacademy.online"
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(router);
app.use(express.static(path.join(__dirname, "public")));
//////////////////////////

app.get('/accept-cookies' , (req , res) =>{
  res.cookie('acceptCookies' , 'true' ,{maxAge: 30 * 24 * 60 * 60 * 1000});
  res.json({message: 'Cookies accept'});
})


//////////////////////////
app.put('/api/update-level', (req, res) => {
  const { studentId, levelName } = req.body;

  if (!studentId || !levelName) {
    return res.status(400).json({ message: 'الرجاء إرسال كل المعطيات المطلوبة' });
  }

  // تحديث مستوى الطالب في قاعدة البيانات
  const query = 'UPDATE users SET Level = ? WHERE id = ?';
  db.query(query, [levelName, studentId], (err, result) => {
    if (err) {
      console.error('خطأ في التحديث:', err);
      return res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'الطالب غير موجود' });
    }

    res.status(200).json({ message: 'تم التحديث بنجاح' });
  });
});


//////////////////////

// إعداد البريد الإلكتروني باستخدام Nodemailer
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
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
    firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const sql = `INSERT INTO users (firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, password, verificationCode) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, hashedPassword, verificationCode,
    ]);

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



// نقطة نهاية لتسجيل الدخول مع توليد رمز JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];
    const hash = user.password;

    const isMatch = await bcrypt.compare(password, hash);

    if (isMatch) {
      // إنشاء التوكن
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid password.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// دالة مصادقة JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // التأكد من وجود Bearer

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};


//////////////

// نقطة نهاية للحصول على بيانات المستخدم المسجل
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT firstName, lastName, email FROM users WHERE id = ?', [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

//////////////////////////////////////




app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
