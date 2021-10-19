require("dotenv").config();
const conn = require("./db");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Welcome to NODE MYSQL AUTH TEST REPO!");
});
conn.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB!");
});

app.listen(8080, () => {
  console.log(`API started at port 8080!`);
});

conn.query("SELECT * FROM users;", (err, res, fields) => {
  if (err) throw err;
  console.log(res);
});
