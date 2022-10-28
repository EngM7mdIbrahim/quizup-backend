const { TEACHER_ACTIONS, TEACHER_ACK } = require("./socket-actions");

const { createNewRoom, authorizeTeacher } = require("./helper");

//helper functions

const addOnTeacherJoinHandler = (socket, runningRooms) => {
  socket.on(TEACHER_ACTIONS.REQ_ROOM, async (data) => {
    if (!data) {
      console.log("Received Null value!");
    }
    const teacherID = authorizeTeacher(data);
    if(!teacherID){
      console.log('Received unauthorized Action! ', data);
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
      return;
    }
    
    if (roomIndex === -1) {
      runningRooms.push({ teacherSocekt: socket, ...room });
    }
    socket.emit(TEACHER_ACK, room);
    console.log("Acknowledge Room Creation sent! PIN:", room.roomURL);
  });
};

const addTeacherHandlers = (socket, runningRooms) => {
  addOnTeacherJoinHandler(socket, runningRooms);
};

module.exports = { addTeacherHandlers };
