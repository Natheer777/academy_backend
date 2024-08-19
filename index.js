const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require('mysql2');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://natheer777.github.io', 'http://localhost:5173'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));

    }
  }
}));

app.use(router);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/addComments", (req, res) => {
    res.sendFile(path.join(__dirname , 'public' , 'add_comment.html'))
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
