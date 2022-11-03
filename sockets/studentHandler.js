const {
  STUDENT_ACTIONS,
  STUDENT_ACK,
  STUDENT_ERR,
  STATUS,
  SERVER_CMDS,
} = require("./socket-actions");

const { sendTeacherState } = require("./teacherHandler");
const { extractPin, findPlayer } = require("./helper");

//helper functions

const INIT_STUDENT = {
  name: "",
  socketID: "",
  correctAnswers: [],
  choices: [],
  rank: -1,
};

const sendStudentState = (
  socket,
  runningRooms,
  roomIndex,
  playerIndex,
  sentStatus
) => {
  const room = runningRooms[roomIndex];
  const player = room.players[playerIndex];
  socket.emit(STUDENT_ACK, {
    ...player,
    status: sentStatus
      ? sentStatus
      : room.status === STATUS.WAITING_FOR_PLAYERS
      ? STATUS.WAITING_FOR_OTHERS_JOIN
      : room.status,
    questionNumber: room.questionNumber,
  });
};

const emitError = (socket, message, cmd) => {
  console.log(message);
  socket.emit(STUDENT_ERR, { message, cmd });
};

const addOnStudentJoinHandler = (socket, runningRooms = []) => {
  socket.on(STUDENT_ACTIONS.JOIN_ROOM, async (data) => {
    if (!data) {
      emitError(socket, "Received null value!");
      return;
    }
    const { pin, name } = data;
    console.log("Received join request for room pin:", pin);
    //Checking if the student has requested to join before?
    const [currentRoomIndex, playerIndex] = findPlayer(runningRooms, socket.id);
    if (currentRoomIndex !== -1) {
      sendStudentState(
        socket,
        runningRooms,
        currentRoomIndex,
        playerIndex,
        STATUS.WAITING_FOR_OTHERS_JOIN
      );
      return;
    }
    const roomIndex = runningRooms.findIndex(
      (room) => extractPin(room.roomURL) === pin
    );
    if (roomIndex === -1) {
      emitError(
        socket,
        "There is no running room with this pin. Please check the room pin again"
      );
      return;
    }
    const searchPlayerIndex = runningRooms[roomIndex].players.findIndex(
      (player) => player.name === name
    );
    if (searchPlayerIndex !== -1) {
      emitError(
        socket,
        "There is already a player with this name, please change your chosen nick name."
      );
      return;
    }
    const newPlayer = { ...INIT_STUDENT, name, socketID: socket.id };
    runningRooms[roomIndex] = {
      ...runningRooms[roomIndex],
      players: [...runningRooms[roomIndex].players, newPlayer],
    };
    sendTeacherState(
      runningRooms[roomIndex].teacherSocket,
      runningRooms,
      roomIndex
    );
    sendStudentState(
      socket,
      runningRooms,
      roomIndex,
      runningRooms[roomIndex].players.length - 1
    );
  });
};

const addOnStudentRequestUpdate = (socket, runningRooms = []) => {
  socket.on(STUDENT_ACTIONS.REQUEST_UPDATE, (prevSocketID) => {
    const [currentRoomIndex, playerIndex] = findPlayer(
      runningRooms,
      prevSocketID
    );
    if (currentRoomIndex === -1) {
      emitError(
        socket,
        "Looks like you are back, but we are sorry! The last quiz you have joined has ended!",
        SERVER_CMDS.deleteID
      );
      return;
    }
    runningRooms[currentRoomIndex].players[playerIndex].socketID = socket.id;
    console.log(
      "Updated new socket ID from",
      prevSocketID,
      "to",
      socket.id,
      ". Running Room:",
      runningRooms[currentRoomIndex]
    );
    sendStudentState(socket, runningRooms, currentRoomIndex, playerIndex);
  });
};

const addStudentHandlers = (socket, runningRooms) => {
  addOnStudentJoinHandler(socket, runningRooms);
  addOnStudentRequestUpdate(socket, runningRooms);
};

module.exports = { addStudentHandlers, sendStudentState };
