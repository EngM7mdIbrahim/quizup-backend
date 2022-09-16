const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require('path')
const { UPLOAD_FILES_DIR } = require("../constants/cosntants");

const getErrorBody = (message) => {
  return {
    error: "An error occurred!",
    message,
  };
};

const getSuccessBody = (message, id) => {
  return {
    message,
    id,
  };
};

const validateProperties = (body, properties) => {
  const keys = Object.keys(body);
  for (const key of properties) {
    if (!keys.includes(key)) {
      return "Missing field " + key;
    }
  }
  return undefined;
};

const sendGeneralError = (err, res) => {
  console.error("Error occurred!", err);
  res.status(400).send(getErrorBody(err.message));
  return;
};

const generatePayloadForTokens = (userID, email = "", name = "") => {
  return {
    id: userID,
    email,
    name,
  };
};

const generateAccessToken = (userID, name = "") => {
  const payload = generatePayloadForTokens(userID, name);
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  });
  return accessToken;
};

const generateRefreshToken = (userID, email = "", name = "") => {
  const payload = generatePayloadForTokens(userID, email, name);
  const accessToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFESH_TOKEN_EXPIRATION_TIME,
  });
  return accessToken;
};

const validateQuestion = (question, res, i) => {
  const checkMessage = validateProperties(question, [
    "question",
    "choices",
    "correctAnswer",
  ]);
  if (checkMessage) {
    res
      .status(400)
      .send(getErrorBody(`${checkMessage} at question number ${i + 1}`));
    return false;
  }
  const { choices } = question;
  if (!Array.isArray(choices)) {
    res
      .status(400)
      .send(
        getErrorBody(
          `'choices' attribute should in question number ${i + 1} be an array.`
        )
      );
    return false;
  }
  if (choices.length !== 4 && choices.length !== 2) {
    res
      .status(400)
      .send(
        getErrorBody(
          `Invalid qustion type at question number ${
            i + 1
          }, either send a true / false question or a choices question. Check the choices array.`
        )
      );
    return false;
  }
  return true;
};

const deleteImages = (questionIDs) => {
  const files = fs.readdirSync(UPLOAD_FILES_DIR);
  files.forEach((file) => {
    for (let i = 0; i < questionIDs.length; i++) {
      if (file.toString().includes(questionIDs[i])) {
        console.log("Deleteing file:", file);
        fs.unlink(path.join(UPLOAD_FILES_DIR, file.toString()), err =>{
          if(err) throw err;
          console.log('File deleted successfully!');
        });
      }
    }
  });
};

//Snippets

// catch(e){
//     sendGeneralError(e,res);
//     return;
// }

module.exports = {
  getErrorBody,
  validateProperties,
  sendGeneralError,
  getSuccessBody,
  generateAccessToken,
  generateRefreshToken,
  validateQuestion,
  deleteImages,
};
