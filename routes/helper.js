const jwt = require("jsonwebtoken");

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
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME
  });
  return accessToken;
};

const generateRefreshToken = (userID, email = "", name = "") => {
  const payload = generatePayloadForTokens(userID, email, name);
  const accessToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{
    expiresIn: process.env.REFESH_TOKEN_EXPIRATION_TIME,
  });
  return accessToken;
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
};
