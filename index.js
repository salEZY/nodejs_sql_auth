require("dotenv").config();
const conn = require("./util/db");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Welcome to NODE MYSQL AUTH TEST REPO!");
});

app.use("/api/users", require("./users/index"));

conn.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB!");

  app.listen(8080, () => {
    console.log(`API started at port 8080!`);
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong",
  });
});
