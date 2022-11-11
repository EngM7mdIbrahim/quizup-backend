const {
  TEACHER_ACTIONS,
  TEACHER_ACK,
  TEACHER_ERR,
  STATUS,
} = require("./socket-actions");

const { createNewRoom, authorizeTeacher, ROOM } = require("./helper");

//helper functions
const sendTeacherState = (socket, runningRooms, roomIndex, status) => {
  const room = runningRooms[roomIndex];
  socket.emit(TEACHER_ACK, {
    ...room,
    status: status ? status : room.status,
    teacherSocket: null,
  });
};

const addOnTeacherJoinHandler = (socket, runningRooms) => {
  socket.on(TEACHER_ACTIONS.REQ_ROOM, async (data) => {
    if (!data) {
      socket.emit(
        TEACHER_ERR,
        "No quiz data was sent with the request! Please contact your administrator!"
      );
      console.log("Received Null value!");
      return;
    }
    const teacherID = authorizeTeacher(data);
    if (!teacherID) {
      console.log("Received unauthorized Action! ", data);
      socket.emit(
        TEACHER_ERR,
        "You are unauthorized! Please sign-out and in again!"
      );
      return;
    }
    const { quizID } = data;
    console.log(
      "Received new class room creation request with this following id. ID: ",
      quizID
    );

    const [room, roomIndex] = await createNewRoom(
      teacherID,
      socket,
      quizID,
      runningRooms
    );
    if (!room) {
      return;
    }
    if (!socket.request.headers.origin) {
      console.log(
        "Cannot determine the origin of the client request! Request: ",
        socket.request
      );
      socket.emit(
        TEACHER_ERR,
        "Cannot determine the origin of the request! Please contact your administrator!"
      );
      return;
    }

    if (roomIndex === -1) {
      runningRooms.push({ teacherSocket: socket, ...room });
    }
    console.log("Here is the room!", room);
    sendTeacherState(socket, runningRooms, runningRooms.length - 1);
    console.log("Acknowledge Room Creation sent! PIN:", room.roomURL);
    console.log("Here are the running rooms: ", runningRooms);
  });
};

const addOnTeacherDeletePlayerHandler = (socket, runningRooms = [ROOM]) => {
  socket.on(TEACHER_ACTIONS.DELETE_PLAYER, (data) => {
    if (!data) {
      socket.emit(
        TEACHER_ERR,
        "No player with this data was sent with the request! Please contact your administrator!"
      );
      console.log("Received Null value!");
      return;
    }
    const teacherID = authorizeTeacher(data);
    if (!teacherID) {
      console.log("Received unauthorized Action! ", data);
      socket.emit(
        TEACHER_ERR,
        "You are unauthorized! Please sign-out and in again!"
      );
      return;
    }

    const { index } = data;
    console.log(
      "Received new a player deletion request with teacherID:",
      teacherID,
      " and the player index is:",
      index
    );

    const runningRoomIndex = runningRooms.findIndex(
      (room) => room.teacherID === teacherID
    );
    if (runningRoomIndex === -1) {
      console.log(
        "Requested to delete a player and the teacher has already closed the room."
      );
      socket.emit(
        TEACHER_ERR,
        "Looks like you have no running quizzes at the moment! Please start a new one!"
      );
      return;
    }
    const runningRoom = runningRooms[runningRoomIndex];

    const player = runningRoom.players[index];
    if (!player) {
      console.log("Requested to delete a player that doesn't exist anymore!");
      socket.emit(TEACHER_ERR, "The player doesn't exist anymore!");
      return;
    }

    const studentSocket = io.of("/").sockets.get(player.socketID);
    studentSocket.emit(STUDENT_ACK, {
      status: STATUS.DELETED_PLAYER,
      name: player.name,
      roomURL: runningRoom.roomURL,
    });

    sendTeacherState(socket, runningRooms, runningRoomIndex);
  });
};

const addTeacherHandlers = (socket, runningRooms, io) => {
  addOnTeacherJoinHandler(socket, runningRooms);
  addOnTeacherDeletePlayerHandler(socket, runningRooms, io);
};

module.exports = { addTeacherHandlers, sendTeacherState };
