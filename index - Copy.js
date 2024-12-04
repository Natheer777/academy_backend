const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("./config/config");
const cookieParser = require("cookie-parser");

const http = require("http");

// const { createServer } =require ('http');
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// إعدادات Express
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://natheer777.github.io",
        "http://localhost:5173",
        "https://academy-backend-pq91.onrender.com",
        "https://japaneseacademy.online",

      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"], // إضافة الطرق المسموحة
  })
);
app.use(cors());
app.use(router);
app.use(express.static(path.join(__dirname, "public")));

////////////////////////////////////////////////////////////////////////////////////////////////


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://japaneseacademy.online",
      "https://academy-backend-pq91.onrender.com",
      "http://localhost:5173",

    ],
    methods: ["GET", "POST"],
  },
});


// قائمة لتتبع جميع المستخدمين المتصلين
// const connectedUsers = {};

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // عند الاتصال، يتم إضافة المستخدم إلى قائمة المستخدمين
//   connectedUsers[socket.id] = socket.id;

//   // إبلاغ جميع المستخدمين الآخرين بوجود مستخدم جديد
//   socket.broadcast.emit("message", { type: "ready", from: socket.id });

//   // استقبال الرسائل من المستخدمين
//   socket.on("message", (message) => {
//     const { to } = message;

//     if (to) {
//       // إذا كانت الرسالة موجهة إلى مستخدم معين
//       if (connectedUsers[to]) {
//         io.to(to).emit("message", { ...message, from: socket.id });
//       }
//     } else {
//       // إذا لم يتم تحديد مستقبل، يتم بث الرسالة للجميع باستثناء المرسل
//       socket.broadcast.emit("message", { ...message, from: socket.id });
//     }
//   });

//   // عند قطع الاتصال
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     delete connectedUsers[socket.id];

//     // إبلاغ جميع المستخدمين الآخرين بأن المستخدم غادر
//     socket.broadcast.emit("message", { type: "bye", from: socket.id });
//   });
// });

// // معالج الأخطاء
// function error(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send("Internal Server Error");
// }

// app.use(error);
const connectedUsers = {};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // إضافة المستخدم عند الاتصال
  connectedUsers[socket.id] = { id: socket.id };

  socket.on("message", (message) => {
    const { type, user, to } = message;

    switch (type) {
      case "join":
        // إذا لم يكن الكائن موجودًا، فلا تقم بعمليات التخزين
        if (connectedUsers[socket.id]) {
          connectedUsers[socket.id].user = user; // تخزين اسم المستخدم
          socket.broadcast.emit("message", { type: "join", user });
          socket.emit("message", { type: "ready" }); // إعلام المستخدم بالجاهزية
        }
        break;

      case "leave":
        const leavingUser = connectedUsers[socket.id]?.user || socket.id;
        delete connectedUsers[socket.id];
        socket.broadcast.emit("message", { type: "leave", user: leavingUser });
        break;

      default:
        if (to && connectedUsers[to]) {
          io.to(to).emit("message", { ...message, from: socket.id });
        } else {
          socket.broadcast.emit("message", { ...message, from: socket.id });
        }
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const user = connectedUsers[socket.id]?.user || socket.id;
    delete connectedUsers[socket.id];
    
    socket.broadcast.emit("message", { type: "leave", user });
  });
});

///////////////////////////////////////////////////////

let messages = []; // قائمة الرسائل المخزنة في الذاكرة

// استقبال اتصالات العملاء
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // إرسال الرسائل الحالية عند الاتصال
  socket.emit('chatHistory', messages);

  // استقبال الرسالة الجديدة
  socket.on('sendMessage', (message) => {
    messages.push(message); // تخزين الرسالة في الذاكرة
    io.emit('receiveMessage', message); // إرسال الرسالة للجميع
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/accept-cookies", (req, res) => {
  res.cookie("acceptCookies", "true", { maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Cookies accept" });
});


//////////////////////

// إعداد البريد الإلكتروني باستخدام Nodemailer
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// نقطة نهاية للتسجيل
app.post("/register", async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const sql = `INSERT INTO users (firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, password, verificationCode) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
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

    await sendVerificationEmail(email, verificationCode);
    res
      .status(200)
      .json({ message: "User registered, verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in database operation" });
  }
});

// نقطة نهاية للتحقق
app.post("/verify", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ? AND verificationCode = ?";
    const [rows] = await db.query(sql, [email, verificationCode]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid verification code or email." });
    }

    const updateSql = "UPDATE users SET emailVerified = 1 WHERE email = ?";
    await db.query(updateSql, [email]);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating verification status" });
  }
});

////////////////////////////////////

app.post("/login_user", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];
    const hash = user.password;

    const isMatch = await bcrypt.compare(password, hash);

    if (isMatch) {
      // إضافة role إلى الـ JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role , firstName: user.firstName}, // إضافة role هنا
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        user: { id: user.id, email: user.email, role: user.role , firstName: user.firstName}, // إرسال بيانات المستخدم
      });
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // التأكد من وجود Bearer

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // حفظ بيانات المستخدم في الطلب
    req.user = user; // يحتوي على id و email و role
    next();
  });
};

// نقطة نهاية للحصول على بيانات المستخدم المسجل
app.get("/user", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT firstName, lastName, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//////////////////////////////////////

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});


