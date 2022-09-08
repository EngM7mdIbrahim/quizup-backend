const jwt = require("jsonwebtoken");
const { getErrorBody } = require("../routes/helper");

const authAccessToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(403).send(getErrorBody("No access token was provided!"));
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Payload: ',payload)
    req.userID = payload.id;
  } catch (e) {
    return res
      .status(403)
      .send(
        getErrorBody(
          "Cannot verify the user with this access token! Error:" + e.message
        )
      );
  }
  next();
};

module.exports = { authAccessToken };
