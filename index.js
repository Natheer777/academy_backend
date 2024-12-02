// const express = require("express");
// const router = require("./router/route");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const db = require("./config/config");
// const cookieParser = require("cookie-parser");

// const http = require("http");

// // const { createServer } =require ('http');
// const { Server } = require("socket.io");

// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;

// // إعدادات Express
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         "https://natheer777.github.io",
//         "http://localhost:5173",
//         "https://academy-backend-pq91.onrender.com",
//         "https://japaneseacademy.online",
//         "https://192.168.1.107:5173",
//         "http://127.0.0.1:4040"
//       ];
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "DELETE", "PUT"], // إضافة الطرق المسموحة
//   })
// );
// app.use(cors());
// app.use(router);
// app.use(express.static(path.join(__dirname, "public")));

// ////////////////////////////////////////////////////////////////////////////////////////////////

// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: [
// //       "https://japaneseacademy.online",
// //       "https://academy-backend-pq91.onrender.com",
// //       "http://localhost:5173",
// //       "https://192.168.1.107:5173",
// //       "http://127.0.0.1:4040"
// //     ],
// //     methods: ["GET", "POST"],
// //   },
  
// // });


// // app.use(express.static("public"));
// // const activeRooms = {}; // تخزين الغرف


// // app.post("/create-room", (req, res) => {
// //   const roomId = `room-${crypto.randomUUID()}`;
// //   activeRooms[roomId] = { participants: [] }; // إضافة غرفة جديدة
// //   console.log("Room created:", roomId);
// //   console.log("Active Rooms after creation:", activeRooms);

// //   // إرسال إشعار لكل الطلاب
// //   io.emit("room-created", { roomId });

// //   res.status(201).json({ roomId });
// // });

// // app.get("/check-room/:roomId", (req, res) => {
// //   const { roomId } = req.params;
// //   console.log("Checking room:", roomId);
// //   console.log("Active Rooms:", activeRooms);
// //   if (activeRooms[roomId]) {
// //     res.status(200).json({ exists: true, message: "Room found" });
// //   } else {
// //     res.status(404).json({ exists: false, message: "Room not found" });
// //   }
// // });
// // io.on("connection", (socket) => {
// //   console.log("User connected: " + socket.id);

// //   // عندما ينضم المستخدم إلى الغرفة
// //   socket.on("join-room", (data) => {
// //     const { roomId, userType } = data;

// //     // تحقق من أن الغرفة موجودة
// //     if (activeRooms[roomId]) {
// //       // إضافة المستخدم إلى المشاركين في الغرفة
// //       activeRooms[roomId].participants.push({ id: socket.id, type: userType });
// //       console.log(`User ${socket.id} (${userType}) joined room: ${roomId}`);

// //       // إرسال تحديث للمشاركين في الغرفة
// //       io.to(roomId).emit("update-users", activeRooms[roomId].participants);

// //       // الانضمام إلى الغرفة باستخدام Socket.IO
// //       socket.join(roomId);

// //       // عرض المشاركين الحاليين في الغرفة
// //       console.log(`Participants in room ${roomId}:`, activeRooms[roomId].participants);
// //     } else {
// //       console.log("Room not found!");
// //     }
// //   });

// //   // عندما يترك المستخدم الغرفة
// //   socket.on("leave-room", (roomId) => {
// //     if (activeRooms[roomId]) {
// //       // إزالة المستخدم من المشاركين
// //       activeRooms[roomId].participants = activeRooms[roomId].participants.filter(
// //         (participant) => participant.id !== socket.id
// //       );
// //       console.log(`User ${socket.id} left room: ${roomId}`);

// //       // إرسال تحديث للمشاركين في الغرفة
// //       io.to(roomId).emit("update-users", activeRooms[roomId].participants);

// //       // عرض المشاركين الحاليين في الغرفة بعد المغادرة
// //       console.log(`Participants in room ${roomId}:`, activeRooms[roomId].participants);
// //     }
// //   });
// //   });





// // const server = http.createServer(app);

// // const io = new Server(server, {
// //   cors: {
// //     origin: [
// //       "https://japaneseacademy.online",
// //       "https://academy-backend-pq91.onrender.com",
// //       "http://localhost:5173",
// //       "https://192.168.1.107:5173",
// //       "http://127.0.0.1:4040",
// //     ],
// //     methods: ["GET", "POST"],
// //   },
// // });

// // app.use(cors());
// // app.use(express.json());

// // const activeRooms = {};

// // // إنشاء غرفة
// // app.post("/create-room", (req, res) => {
// //   const roomId = `room-${crypto.randomUUID()}`;
// //   activeRooms[roomId] = { participants: [] };
// //   console.log("Room created:", roomId);
// //   io.emit("room-created", { roomId });
// //   res.status(201).json({ roomId });
// // });

// // // التحقق من الغرفة
// // app.get("/check-room/:roomId", (req, res) => {
// //   const { roomId } = req.params;
// //   if (activeRooms[roomId]) {
// //     res.status(200).json({ exists: true, message: "Room found" });
// //   } else {
// //     res.status(404).json({ exists: false, message: "Room not found" });
// //   }
// // });

// // // إدارة الاتصالات
// // io.on("connection", (socket) => {
// //   console.log("User connected:", socket.id);

// //   socket.on("join-room", (data) => {
// //     const { roomId, userType } = data;

// //     if (activeRooms[roomId]) {
// //       activeRooms[roomId].participants.push({ id: socket.id, type: userType });
// //       socket.join(roomId);
// //       io.to(roomId).emit("update-users", activeRooms[roomId].participants);
// //       console.log(`User ${socket.id} joined room: ${roomId}`);
// //     } else {
// //       console.log("Room not found:", roomId);
// //     }
// //   });

// //   socket.on("leave-room", (roomId) => {
// //     if (activeRooms[roomId]) {
// //       activeRooms[roomId].participants = activeRooms[roomId].participants.filter(
// //         (participant) => participant.id !== socket.id
// //       );
// //       socket.leave(roomId);
// //       io.to(roomId).emit("update-users", activeRooms[roomId].participants);
// //       console.log(`User ${socket.id} left room: ${roomId}`);
// //     }
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("User disconnected:", socket.id);
// //   });
// // });


// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://japaneseacademy.online",
//       "https://academy-backend-pq91.onrender.com",
//       "http://localhost:5173",
//       "https://192.168.1.107:5173",
//       "http://127.0.0.1:4040",
//     ],
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log("Connected");

//   socket.on("message", (message) => {
//     socket.broadcast.emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// });

// function error(err, req, res, next) {
//   // log it
//   if (!test) console.error(err.stack);

//   // respond with 500 "Internal Server Error".
//   res.status(500);
//   res.send("Internal Server Error");
// }
// ///////////////////////////////////////////////////////

// let messages = []; // قائمة الرسائل المخزنة في الذاكرة

// // استقبال اتصالات العملاء
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // إرسال الرسائل الحالية عند الاتصال
//   socket.emit('chatHistory', messages);

//   // استقبال الرسالة الجديدة
//   socket.on('sendMessage', (message) => {
//     messages.push(message); // تخزين الرسالة في الذاكرة
//     io.emit('receiveMessage', message); // إرسال الرسالة للجميع
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

// ////////////////////////////////////////////////////////////////////////////////////////////////

// app.get("/accept-cookies", (req, res) => {
//   res.cookie("acceptCookies", "true", { maxAge: 30 * 24 * 60 * 60 * 1000 });
//   res.json({ message: "Cookies accept" });
// });

// //////////////////////////
// // app.put('/api/update-level', (req, res) => {
// //   const { studentId, levelName } = req.body;

// //   console.log('المعطيات المستلمة:', { studentId, levelName });

// //   if (!studentId || !levelName) {
// //     console.log('المعطيات مفقودة');
// //     return res.status(400).json({ message: 'الرجاء إرسال كل المعطيات المطلوبة' });
// //   }

// //   // تحديث مستوى الطالب في قاعدة البيانات
// //   const query = 'UPDATE users SET Level = ? WHERE id = ?';
// //   db.query(query, [levelName, studentId], (err, result) => {
// //     if (err) {
// //       console.error('خطأ في التحديث:', err);
// //       return res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
// //     }
// //     console.log('نتيجة التحديث:', result);

// //     if (result.affectedRows === 0) {
// //       console.log('الطالب غير موجود');
// //       return res.status(404).json({ message: 'الطالب غير موجود' });
// //     }

// //     console.log('تم التحديث بنجاح');
// //     res.status(200).json({ message: 'تم التحديث بنجاح' });
// //   });
// // });

// //////////////////////

// // إعداد البريد الإلكتروني باستخدام Nodemailer
// const sendVerificationEmail = async (email, verificationCode) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Verification Code",
//     text: `Your verification code is: ${verificationCode}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// // نقطة نهاية للتسجيل
// app.post("/register", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     country,
//     age,
//     gender,
//     educationLevel,
//     japaneseLevel,
//     phone,
//     email,
//     password,
//   } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationCode = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     const sql = `INSERT INTO users (firstName, lastName, country, age, gender, educationLevel, japaneseLevel, phone, email, password, verificationCode) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     await db.query(sql, [
//       firstName,
//       lastName,
//       country,
//       age,
//       gender,
//       educationLevel,
//       japaneseLevel,
//       phone,
//       email,
//       hashedPassword,
//       verificationCode,
//     ]);

//     await sendVerificationEmail(email, verificationCode);
//     res
//       .status(200)
//       .json({ message: "User registered, verification email sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error in database operation" });
//   }
// });

// // نقطة نهاية للتحقق
// app.post("/verify", async (req, res) => {
//   const { email, verificationCode } = req.body;

//   try {
//     const sql = "SELECT * FROM users WHERE email = ? AND verificationCode = ?";
//     const [rows] = await db.query(sql, [email, verificationCode]);

//     if (rows.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Invalid verification code or email." });
//     }

//     const updateSql = "UPDATE users SET emailVerified = 1 WHERE email = ?";
//     await db.query(updateSql, [email]);

//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error updating verification status" });
//   }
// });

// ////////////////////////////////////

// app.post("/login_user", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Email and password are required." });
//   }

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const user = rows[0];
//     const hash = user.password;

//     const isMatch = await bcrypt.compare(password, hash);

//     if (isMatch) {
//       // إضافة role إلى الـ JWT
//       const token = jwt.sign(
//         { id: user.id, email: user.email, role: user.role , firstName: user.firstName}, // إضافة role هنا
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({
//         message: "Login successful!",
//         token,
//         user: { id: user.id, email: user.email, role: user.role , firstName: user.firstName}, // إرسال بيانات المستخدم
//       });
//     } else {
//       res.status(401).json({ message: "Invalid password." });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // التأكد من وجود Bearer

//   if (!token) {
//     return res.status(401).json({ message: "Missing token" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token" });
//     }

//     // حفظ بيانات المستخدم في الطلب
//     req.user = user; // يحتوي على id و email و role
//     next();
//   });
// };

// // نقطة نهاية للحصول على بيانات المستخدم المسجل
// app.get("/user", authenticateToken, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT firstName, lastName, email FROM users WHERE id = ?",
//       [req.user.id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({ user: rows[0] });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

// //////////////////////////////////////

// server.listen(port, () => {
//   console.log(`Server is running on port http://localhost:${port}`);
// });



const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;
const path = require('path');

let socketList = {};

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Route
app.get('/ping', (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

// Socket
io.on('connection', (socket) => {
  // console.log(`New User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    socket.disconnect();
    // console.log('User disconnected!');
  });

  socket.on('BE-check-user', ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  });

  /**
   * Join Room
   */
  socket.on('BE-join-room', ({ roomId, userName }) => {
    // Socket Join RoomName
    socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true};

    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: socketList[client] });
        });
        socket.broadcast.to(roomId).emit('FE-user-join', users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
      }
    });
  });

  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  socket.on('BE-send-message', ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  });

  socket.on('BE-leave-room', ({ roomId, leaver }) => {
    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(roomId);
  });

  socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
    if (switchTarget === 'video') {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
  });
});

http.listen(PORT, () => {
  console.log('Connected : 3001');
});
