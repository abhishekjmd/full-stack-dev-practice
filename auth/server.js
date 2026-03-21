const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const connectDB = require("./db");
const User = require("./models/userModel");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.json({ error: "pls enter the email and password" });
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ error: "email already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email: email,
      password: hashedPassword,
    };
    await User.create(userData);
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Pls enter Email and Password" });
    }
    const data = await User.findOne({ email });
    if (!data) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, data.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid password pls enter correct password" });
    }
    const token = jwt.sign({ userId: data._id }, "secret", { expiresIn: "1h" });
    res.status(200).json({
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server Error" });
  }
});

app.get("/users", authMiddleware , async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`);
});
