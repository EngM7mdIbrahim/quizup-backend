const { SEND_PIN, ACK_SEND_PIN } = require("./socket-actions");
const jwt = require("jsonwebtoken");
const { addNewRoom } = require("./helper");

//helper functions

const addOnTeacherJoinHandler = (socket, runningRooms) => {
  socket.on(SEND_PIN, async (data) => {
    if (!data) {
      console.log("Received Null value!");
    }
    const { accessToken, quizID } = data;
    console.log(
      "Received new class room creation request with this following id. ID: ",
      quizID
    );

    const room = await addNewRoom(accessToken, quizID, runningRooms);
    if (!room) {
      return;
    }
    if (!socket.request.headers.origin) {
      console.log(
        "Cannot determine the origin of the client request! Request: ",
        socket.request
      );
      return;
    }
    const roomURL = `${socket.request.header.origin}/student/${room.pin}`;
    runningRooms.push({ teacherSocekt: socket, ...room });
    socket.emit(ACK_SEND_PIN, { roomURL, pin: room.pin });
    console.log("Acknowledge Room Creation sent! PIN:", room.pin);
  });
};

const addTeacherHandlers = (socket, runningRooms) => {
  addOnTeacherJoinHandler(socket, runningRooms);
};

module.exports = { addTeacherHandlers };
