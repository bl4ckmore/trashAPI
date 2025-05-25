// 📁 controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

// ✅ Register Controller
const register = async (req, res) => {
  const { name, email, password, role = "normal" } = req.body; // 👈 Accept role (optional, default: 'normal')

  try {
    // 🔍 Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📝 Insert user into DB (now includes role)
    await pool.query(
      "INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role]
    );

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Login Controller (updated with loginTime)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Find user by email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔑 Generate JWT (optional, still in use)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Return user data including login time
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loginTime: Date.now(), // 🕒 Add login time here
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  register,
  login,
};
