const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const connectDB = require("./db");
const Todo = require("./models/todo");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updated = await Todo.findByIdAndUpdate(
    id,
    { title, completed },
    { new: true },
  );
  res.json(updated);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
