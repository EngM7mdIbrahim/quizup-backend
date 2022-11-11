const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const {
  DB_CONN_STRING,
  DB_LOCAL_CONN_STRING,
  UPLOAD_FILES_DIR,
  PORT,
  ALLOWED_DOMAINS,
} = require("./constants/cosntants");
var cors = require("cors");
const { Server } = require("socket.io");

// All router imports
const authRouter = require("./routes/auth.route.js");
const quizzesRouter = require("./routes/quizzes.route");
const classesRouter = require("./routes/classes.route.js");
const { authAccessToken } = require("./constants/middleWares");
const { GENERAL_CONNECTION } = require("./sockets/socket-actions");
const { addTeacherHandlers } = require("./sockets/teacherHandler");
const { addStudentHandlers } = require("./sockets/studentHandler");

//setup
mongoose
  .connect(DB_LOCAL_CONN_STRING)
  .then(() => console.log("Connected to DB!"))
  .catch((err) =>
    console.error("Cannot connect to the DB with the following error: ", err)
  );

//Middle ware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

//Use all routes
app.use("/auth", authRouter);
app.use(authAccessToken);
app.use("/quizzes", quizzesRouter);
app.use("/classes", classesRouter);

const runningRooms = [];
const httpServer = app.listen(PORT);

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_DOMAINS
  }
});

io.on(GENERAL_CONNECTION, (socket) => {
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} is disconnected!`);
  });
  // console.log('///////////START///////////////')
  // console.log('New Socket: ',socket.id);
  // console.log('Previous Sockets: ',Object.keys(io.of('/').sockets))
  // console.log('///////////END///////////////')
  addTeacherHandlers(socket, runningRooms, io);
  addStudentHandlers(socket, runningRooms);
});
