const { SEND_PIN } = require("./socket-actions")

const addOnTeacherJoinHandler = (socket, runningRooms)=>{
    socket.on(SEND_PIN, (data)=>{
        if(!data){
            console.log('Received Null value!')
        }
    })
}
const addTeacherHandlers = (socket, runningRooms)=>{
    addOnTeacherJoinHandler(socket, runningRooms)
}






module.exports = {addTeacherHandlers}

