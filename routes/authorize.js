const authenticateToken = require('../config/authenticateToken');
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const secretKey = require("../config/secretKey");

function getSecretKey() {
  return secretKey;
}

const db = require('../config/database');

const router = express.Router();


router.use(bodyParser.json());


//Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const getUserQuery = "SELECT * FROM users WHERE username = ?";
    const [rows] = await db.promise().execute(getUserQuery, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username" });
    }

    const user = rows[0];
    let passwordMatch = false;

    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordMatch = (password === user.password);
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      getSecretKey(),
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Register User
router.post('/register', authenticateToken, async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)';

    await db.promise().execute(insertUserQuery, [name, username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;