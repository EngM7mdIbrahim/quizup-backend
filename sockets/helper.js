const Class = require("../models/class.model");
const Quiz = require("../models/quiz.model");

const generateRandomPin = (runningRooms) => {
  const pin = Math.floor(100000 + Math.random() * 900000);
  if (runningRooms.findIndex((room) => room.pin === pin) === -1) return pin;
  return generateRandomPin(runningRooms);
};

const addNewRoom = async (quizID, accessToken, runningRooms) =>{
    let payload={};
    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    }catch (e){
        console.log('Unauthorized User tried to create a room!')
        return null;
    }
    const teacherID = payload.id;
    const roomIndex = runningRooms.findIndex(room=>room.teacherID === teacherID);
    if(roomIndex===-1){
        console.log('There is already a running room for this teacher');
        return null;
    }
    const existingQuiz = await Quiz.findById(quizID);
    if(!existingQuiz){
        console.log('There is no quiz with this specified id. ID: ', quizID);
        return null;
    }
    await Class ({
        name: existingQuiz.name,
        quizID,
        teacherID,
    }).save();

    const pin = generateRandomPin(runningRooms);

    return {
        socket,
        pin,
        teacherID,
        players: []
    };
    
}

module.exports = {generateRandomPin, addNewRoom};
