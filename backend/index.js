require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyJWT = require("./utils");
const User = require("./models/user.js");
const Note = require("./models/note.js");
const connectDB = require("./db");

//mongodb connection
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send({ data: "hello" });
});

//! register new user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });

  // already existed user
  const existedUser = await User.findOne({ email });

  if (existedUser)
    return res
      .status(400)
      .json({ error: true, message: "user with this email already exists" });

  const user = new User({
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    error: false,
    user,
    accessToken,
    message: "User created successfully",
  });
});

//! login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });

  const userData = await User.findOne({ email: email });

  if (!userData) return res.status(400).json({ message: "User not found" });

  if (userData.email == email && userData.password == password) {
    // validate email & password
    const user = { user : userData };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      email,
      accessToken,
      message: "Login Successfully",
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid email or password",
    });
  }
});

//! Get user
app.get("/get-user", verifyJWT, async (req, res) => {
  const user = req.user?.user._id;

  const existedUser = await User.findOne({ _id: user });

  if (!existedUser) return res.status(401).json({ message: "User not found" });

  return res.json({
    user: { email: existedUser.email, _id: existedUser._id },
    message: "",
  });
});

//! Add note
app.post("/add-note", verifyJWT, async (req, res) => {
  const { title, content } = req.body;
  const user = req.user?.user._id; //? "user" itself is an object containing the user property.

  if (!title)
    return res.status(400).json({ error: true, message: "Title is required" });
  if (!content)
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });

  try {
    const note = new Note({
      title,
      content,
      userId: user,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//! Edit note
app.patch("/edit-note/:noteId", verifyJWT, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content } = req.body;
  const user = req.user?.user._id;

  if (!title && !content) {
    return res
      .status(400)
      .json({ error: true, message: "No changes Provided" });
  }

  // console.log("user: ",user,"noteId :",noteId);

  try {
    const note = await Note.findOne({ _id: noteId, userId: user });

    if (!note)
      return res.status(400).json({ error: true, message: "Note not found" });

    // update title and content
    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//! Get all notes
app.get("/get-all-notes/", verifyJWT, async (req, res) => {
  const user = req.user?.user._id;

  try {
    const notes = await Note.find({ userId: user });

    return res.json({
      error: false,
      notes,
      message: "All notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//! Delete note
app.delete("/delete-note/:noteId", verifyJWT, async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user?.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user });

    if (!note)
      return res.status(400).json({ error: true, message: "Note not found" });

    await Note.deleteOne({ _id: noteId, userId: user });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});

module.exports = app;
