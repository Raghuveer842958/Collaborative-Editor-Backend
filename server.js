const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/database");

// Database connection
connectDB();

// Middleware
app.use(
  cors({
    origin: "https://collaborative-editor-web.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const profileRouter = require("./routes/profileRoutes");
const executeCodeRouter = require("./routes/executeCodeRoutes");

app.use("/api/auth", authRoutes);
app.use("/", profileRouter);
app.use("/api/executeCode", executeCodeRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socketHandler = require("./utils/socketHandler1");
socketHandler(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
