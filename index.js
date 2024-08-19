const express = require("express");
const router = require("./router/route");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/addComments", (req, res) => {
    res.sendFile(path.join(__dirname , 'public' , 'add_comment.html'))
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
