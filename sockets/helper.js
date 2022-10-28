const Class = require("../models/class.model");
const Quiz = require("../models/quiz.model");
const jwt = require("jsonwebtoken");
const { STATUS, TEACHER_ERR } = require("./socket-actions");

const ROOM = {
  teacherID: undefined,
  status: STATUS.WAITING_FOR_PLAYERS,
  players: [],
  questionNumber: 0,
  roomURL: "",
};

const generateRandomPin = (runningRooms) => {
  const pin = Math.floor(100000 + Math.random() * 900000);
  if (
    runningRooms.findIndex((room) => {
      const roomTokens = room.roomURL.split("/");
      const roomPin = roomTokens[roomTokens.length - 1];
      return roomPin === pin;
    }) === -1
  )
    return pin;

};

const createNewRoom = async (teacherID, socket, quizID, runningRooms) => {
  const roomIndex = runningRooms.findIndex(
    (room) => room.teacherID === teacherID
  );
  if (roomIndex !== -1) {
    console.log(
      "There is already a running room for this teacher",
      runningRooms
    );
    return [{...runningRooms[roomIndex], teacherSocket: null}, roomIndex];
  }
  const existingQuiz = await Quiz.findById(quizID);
  if (!existingQuiz) {
    console.log("There is no quiz with this specified id. ID: ", quizID);
    socket.emit(TEACHER_ERR, 'Cannot find the requested Quiz.')
    return null;
  }
//   await Class({
//     name: existingQuiz.name,
//     quizID,
//     teacherID,
//   }).save();

  const pin = generateRandomPin(runningRooms);
  const roomURL = `${socket.request.headers.origin}/student/${pin}`;
  return [
    {
      ...ROOM,
      teacherID,
      roomURL
    },
    roomIndex,
  ];
};

const authorizeTeacher = (data)=>{
  const { accessToken} = data;
  let payload = {};
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return payload.id
  } catch (e) {
    console.log("Unauthorized User tried to create a room!", e);
    return null;
  }
}

module.exports = { generateRandomPin, createNewRoom, authorizeTeacher};
