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
const socketIo = require("socket.io");

// const { Server } = require("socket.io");
// const { Server } = require('socket.io');
// const server = require('http').createServer();
// const { createServer } =require('http');
// const { Server } = require('socket.io');
require("dotenv").config();

const app = express();
const server = http.createServer(app);
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
        "https://164b-95-159-63-120.ngrok-free.app ",
        "https://192.168.1.107:5173",
        "https://192.168.137.1:5173",
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

// const server = createServer(app);
// const io = socketIo(server);

const io = socketIo(server, {
  cors: {
    origin: [
      "https://japaneseacademy.online",
      "http://localhost:5173",
      "https://164b-95-159-63-120.ngrok-free.app",
      "https://192.168.1.107:5173",
      "https://192.168.137.1:5173",
    ],
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket"],
});

//////////////////////////////////

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create-room", (teacherId) => {
    // تحقق إذا كانت الغرفة موجودة بالفعل
    const existingRoom = [...rooms.values()].find(
      (room) => room.teacherId === teacherId
    );

    if (existingRoom) {
      socket.emit("room-already-exists", existingRoom.roomId);
    } else {
      const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
      rooms.set(roomId, {
        teacherId,
        students: new Set(),
        connections: new Set([socket.id]),
      });
      socket.join(roomId);
      socket.roomId = roomId;
      io.emit("room-opened", { roomId, teacherId });
    }
  });

  socket.on("join-room", ({ roomId, studentId }) => {
    const room = rooms.get(roomId);
    if (room && !room.students.has(studentId)) {
      room.students.add(studentId);
      room.connections.add(socket.id);
      socket.join(roomId);
      io.to(roomId).emit("student-joined", { studentId });
    }
  });

  socket.on("end-room", (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      io.to(roomId).emit("room-closed");
      room.connections.forEach((id) =>
        io.sockets.sockets.get(id)?.leave(roomId)
      );
      rooms.delete(roomId);
    }
  });
});

///////////////

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("create-room", (teacherId) => {
//     const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
//     rooms.set(roomId, {
//       teacherId,
//       students: new Set(),
//       connections: new Set([socket.id]),
//     });

//     socket.join(roomId);
//     socket.roomId = roomId;
//     console.log(`Room created by teacher ${teacherId} with ID: ${roomId}`);
//     io.emit("room-opened", { roomId, teacherId });
//   });

//   socket.on("join-room", ({ roomId, studentId }) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       room.students.add(studentId);
//       room.connections.add(socket.id);
//       socket.join(roomId);
//       socket.roomId = roomId;
//       io.to(roomId).emit("student-joined", { studentId: socket.id });
//       console.log(`Student ${studentId} joined room ${roomId}`);
//     } else {
//       socket.emit("error", { message: "Room not found" });
//     }
//   });

//   socket.on("signal", ({ roomId, signalData }) => {
//     console.log(`Signal from ${socket.id} in room ${roomId}`);
//     socket.to(roomId).emit("signal", { from: socket.id, signalData });
//   });

//   socket.on("end-room", (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       io.to(roomId).emit("room-closed");
//       rooms.delete(roomId);
//       console.log(`Room ${roomId} closed by teacher`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User ${socket.id} disconnected`);
//     if (socket.roomId) {
//       const room = rooms.get(socket.roomId);
//       if (room) {
//         room.connections.delete(socket.id);
//         io.to(socket.roomId).emit("peer-disconnected", { peerId: socket.id });

//         if (room.connections.size === 0) {
//           rooms.delete(socket.roomId);
//           console.log(`Room ${socket.roomId} removed due to no participants`);
//         }
//       }
//     }
//   });
// });

////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/accept-cookies", (req, res) => {
  res.cookie("acceptCookies", "true", { maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Cookies accept" });
});

//////////////////////////
// app.put('/api/update-level', (req, res) => {
//   const { studentId, levelName } = req.body;

//   console.log('المعطيات المستلمة:', { studentId, levelName });

//   if (!studentId || !levelName) {
//     console.log('المعطيات مفقودة');
//     return res.status(400).json({ message: 'الرجاء إرسال كل المعطيات المطلوبة' });
//   }

//   // تحديث مستوى الطالب في قاعدة البيانات
//   const query = 'UPDATE users SET Level = ? WHERE id = ?';
//   db.query(query, [levelName, studentId], (err, result) => {
//     if (err) {
//       console.error('خطأ في التحديث:', err);
//       return res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
//     }
//     console.log('نتيجة التحديث:', result);

//     if (result.affectedRows === 0) {
//       console.log('الطالب غير موجود');
//       return res.status(404).json({ message: 'الطالب غير موجود' });
//     }

//     console.log('تم التحديث بنجاح');
//     res.status(200).json({ message: 'تم التحديث بنجاح' });
//   });
// });

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
        { id: user.id, email: user.email, role: user.role }, // إضافة role هنا
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        user: { id: user.id, email: user.email, role: user.role }, // إرسال بيانات المستخدم
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
