const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path')
const {DB_CONN_STRING, DB_LOCAL_CONN_STRING, UPLOAD_FILES_DIR} = require("./constants/cosntants");
var cors = require('cors');

// All router imports
const authRouter = require("./routes/auth.route.js");
const quizzesRouter = require('./routes/quizzes.route');
const classesRouter = require('./routes/classes.route.js');
const { authAccessToken } = require("./constants/middleWares");

//setup
mongoose
  .connect(DB_LOCAL_CONN_STRING)
  .then(() => console.log("Connected to DB!"))
  .catch((err) =>
    console.error("Cannot connect to the DB with the following error: ", err)
  );
 




//Middle ware
app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use(cors())

//Use all routes
app.use("/auth", authRouter);
app.use(authAccessToken);
app.use('/quizzes', quizzesRouter);
app.use('/classes', classesRouter);


app.listen(8000);
