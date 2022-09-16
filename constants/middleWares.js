const jwt = require("jsonwebtoken");
const multer = require('multer')
const {UPLOAD_FILES_DIR} = require('./cosntants')
const path = require('path')
const { getErrorBody } = require("../routes/helper");


const authAccessToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(403).send(getErrorBody("No access token was provided!"));
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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

//Multer setup
const storage = multer.diskStorage({
  destination(__, _, cb) {
    cb(null, UPLOAD_FILES_DIR);
  },
  // filename(req, file = {}, cb) {
  //   console.log('Request: ', req)
  //   console.log('Images Meta: ',req.body.imagesMeta);
  //   console.log('Images: ', req.files);
  //   const imageMeta = JSON.parse(req.body.imagesMeta).find(imageMeta =>imageMeta.name===file.originalname)
  //   // // const imageMeta = req.body.imagesMeta.find(imageMeta =>imageMeta.name===file.originalname)
  //   console.log('Image: ',file.originalname)
  //   cb(null, imageMeta.questionID  
  //            + path.extname(file.originalname))
  // },
  filename(req, file = {}, cb) {
    console.log('Request: ', req)
    console.log('Images Meta: ',req.body.imagesMeta);
    console.log('Images: ', req.files);
    console.log('Image: ',file.originalname)
    file.originalname.includes
    cb(null, file.originalname)
  }
});
const uploadManager = multer({storage});


module.exports = { authAccessToken, uploadManager };
