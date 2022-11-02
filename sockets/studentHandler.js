const {
  STUDENT_ACTIONS,
  STUDENT_ACK,
  STUDENT_ERR,
  STATUS,
} = require("./socket-actions");

const { extractPin } = require("./helper");

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
  status
) => {
  const room = runningRooms[roomIndex];
  const player = room.players[playerIndex];
  socket.emit(STUDENT_ACK, {
    ...player,
    status: status ? status : room.status,
    questionNumber: room.questionNumber,
    status: room.status,
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
    const newPlayer = { ...INIT_STUDENT, name, socketID: socket.id };
    runningRooms[roomIndex] = {
      ...runningRooms[roomIndex],
      players: [...runningRooms[roomIndex].players, newPlayer],
    };
    sendStudentState(
      socket,
      runningRooms,
      roomIndex,
      runningRooms[roomIndex].players - 1,
      STATUS.WAITING_FOR_OTHERS_JOIN
    );
  });
};

const addOnStudentRequestUpdate = (socket, runningRooms = []) =>{
  socket.on(STUDENT_ACTIONS.REQUEST_UPDATE, (prevSocketID)=>{
    let playerIndex = -1;
    const currentRoomIndex = runningRooms.findIndex(room =>{
      playerIndex = room.players.findIndex(player =>{
        player.socketID = prevSocketID;
      });
      return playerIndex !== -1;
    });
    if(currentRoomIndex === -1){
      emitError(socket, 'Looks like you are back, but we are sorry! The last quiz you have joined has ended!');
      return;
    }
    runningRooms[currentRoomIndex].players[playerIndex].socketID = socket.id;
    console.log('Updated new socket ID from', prevSocketID, 'to', socket.id,'. Running Room:',runningRooms[currentRoomIndex]);
    sendStudentState(socket, runningRooms, currentRoomIndex, playerIndex);
  })
}

const addStudentHandlers = (socket, runningRooms) => {
  addOnStudentJoinHandler(socket, runningRooms);
  addOnStudentRequestUpdate(socket, runningRooms);
};

module.exports = { addStudentHandlers };
