//GENERAL ACTIONS
const GENERAL_CONNECTION = "connection";
const TEACHER_ACK = "teacher-ack";
const STUDENT_ACK = "student-ack";
const TEACHER_ERR = 'teacher-err';
const STUDENT_ERR = 'student-err';

const STATUS = {
  WAITING_FOR_PLAYERS: "waiting-players",
  QUESTIONS_CHOICES: "choices",
  WAITING_FOR_OTHERS_JOIN: 'waiting-others-join',
  QUESTIONS_TRUE_FALSE: "true-false",
  SHOW_ANSWERS: "show-ans",
  END_SESSION: "end-session",
  WAITING_ANSWERS: "waiting-answers",
  DELETED_PLAYER: "player-deleted"
};

const SERVER_CMDS = {
  deleteID: 'DELETE_ID'
}


const TEACHER_ACTIONS = {
  REQ_ROOM: "teacher-join",
  REQUEST_UPDATE: "teacher-request-update-state",
  DELETE_PLAYER: 'teacher-delete-player',
};

const STUDENT_ACTIONS = {
  JOIN_ROOM: "student-join",
  REQUEST_UPDATE: "student-request-update-state",
  SUBMIT_ANSWER: "student-submit-ans",
};

module.exports = {
  GENERAL_CONNECTION,
  TEACHER_ACK,
  STUDENT_ACK,
  STUDENT_ERR,
  TEACHER_ERR,
  STATUS,
  TEACHER_ACTIONS,
  STUDENT_ACTIONS,
  SERVER_CMDS
};
