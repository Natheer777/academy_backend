const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const db = require("./config/config");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Express settings
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
        "https://japaneseacademy.online",
        "https://192.168.137.1:5173",
        "https://192.168.1.112:5173"
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(router);
/////////////////////////////////////////////////////////////////////////

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    // Notify others in room about new peer
    socket.to(roomId).emit("user-connected", socket.id);
    
    // Send existing peers to new user
    const peersInRoom = Array.from(rooms.get(roomId)).filter(id => id !== socket.id);
    socket.emit("existing-peers", peersInRoom);
  });

  socket.on("message", (data) => {
    const { roomId, message, to } = data;
    if (to) {
      socket.to(to).emit("message", {
        ...message,
        from: socket.id
      });
    } else {
      socket.to(roomId).emit("message", {
        ...message,
        from: socket.id
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    rooms.forEach((peers, roomId) => {
      if (peers.has(socket.id)) {
        peers.delete(socket.id);
        socket.to(roomId).emit("user-disconnected", socket.id);
        if (peers.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

//////////////////////////////////////////////////////




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


