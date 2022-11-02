const { TEACHER_ACTIONS, TEACHER_ACK, TEACHER_ERR } = require("./socket-actions");

const { createNewRoom, authorizeTeacher } = require("./helper");

//helper functions
const sendTeacherState = (
  socket,
  runningRooms,
  roomIndex,
  status
) => {
  const room = runningRooms[roomIndex];
  socket.emit(TEACHER_ACK, {
    ...room,
    status: status ? status : room.status,
    teacherSocket: null
  });
};

const addOnTeacherJoinHandler = (socket, runningRooms) => {
  socket.on(TEACHER_ACTIONS.REQ_ROOM, async (data) => {
    if (!data) {
      socket.emit(TEACHER_ERR, 'No quiz data was sent with the request! Please contact your administrator!')
      console.log("Received Null value!");
      return;
    }
    const teacherID = authorizeTeacher(data);
    if(!teacherID){
      console.log('Received unauthorized Action! ', data);
      socket.emit(TEACHER_ERR, 'You are unauthorized! Please sign-out and in again!')
      return;
    }
    const { quizID } = data;
    console.log(
      "Received new class room creation request with this following id. ID: ",
      quizID
    );

    const [room, roomIndex] = await createNewRoom(teacherID, socket, quizID, runningRooms);
    if (!room) {
      return;
    }
    if (!socket.request.headers.origin) {
      console.log(
        "Cannot determine the origin of the client request! Request: ",
        socket.request
      );
      socket.emit(TEACHER_ERR, 'Cannot determine the origin of the request! Please contact your administrator!')
      return;
    }
    
    if (roomIndex === -1) {
      runningRooms.push({ teacherSocket: socket, ...room });
    }
    console.log('Here is the room!', room)
    sendTeacherState(socket, runningRooms, runningRooms.length - 1)
    console.log("Acknowledge Room Creation sent! PIN:", room.roomURL);
  });
};

const addTeacherHandlers = (socket, runningRooms) => {
  addOnTeacherJoinHandler(socket, runningRooms);
};

module.exports = { addTeacherHandlers, sendTeacherState };
