const express = require("express");
const conn = require("../util/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET USERS
router.get("/", (req, res, next) => {
  conn.query("SELECT * FROM users;", (err, results, fields) => {
    if (err) throw err;
    res.json({ message: "Sent!", data: results });
  });
});

// REGISTER USER
router.post("/register", async (req, res, next) => {
  let { email, password, about } = req.body;
  let created_at = new Date(Date.now());

  password = await bcrypt.hash(password, 12);

  try {
    conn.query(
      "INSERT INTO users (email, password, about, created_at) VALUES (?,?,?,?)",
      [email, password, about, created_at],
      (err, rows, fields) => {
        if (err) next(err);
        if (rows) {
          conn.query(
            "SELECT * FROM users WHERE id = ?",
            [rows.insertId],
            (err, results, fields) => {
              if (err) next(err);
              res.send(results);
            }
          );
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

// LOGIN USER
router.post("/login", (req, res, next) => {
  let { email, password, about } = req.body;

  try {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results, fields) => {
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch)
          return res.status(403).json({ message: "PASSWORDS DO NOT MATCH" });

        let token;
        try {
          token = jwt.sign(
            { email: results[0].email, id: results[0].id },
            process.env.SECRET,
            { expiresIn: "2h" }
          );
        } catch (err) {
          next(err);
        }

        res.json({ user: results[0], token });
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
