const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const {
  getErrorBody,
  validateProperties,
  generateAccessToken,
  // generateRefreshToken,
  getSuccessBody,
  sendGeneralError
} = require("./helper");

authRouter.post("/signup", async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;
  const checkMessage = validateProperties(req.body, [
    "email",
    "name",
    "password",
    "confirmPassword",
  ]);
  if (checkMessage) {
    res.status(401).send(getErrorBody(checkMessage));
    return;
  }

  if (password !== confirmPassword) {
    res
      .status(401)
      .send(getErrorBody("Password and Confirm Password doesn't match!"));
    return;
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(401).send(getErrorBody("A user already exists with this email"));
    return;
  }

  //Password Generation
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //Save User
  try {
    const savedUser = await new User({ name, email, password: hash }).save();
    const accessToken = generateAccessToken(
      savedUser.id,
      savedUser.email,
      savedUser.name
    );
    // const refreshToken = generateRefreshToken(
    //   savedUser.id,
    //   savedUser.email,
    //   savedUser.name
    // );
    // await savedUser.$set({ refreshToken }).save();
    res
      .status(201)
      .send({ message: "User created!", accessToken });
      // .send({ message: "User created!", accessToken, refreshToken });
    return;
  } catch (e) {
    res.status(501).send(getErrorBody(e.message));
    return;
  }
});

authRouter.post("/signin", async (req, res) => {
  console.log('Received!')
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).send(getErrorBody("All fields are required!"));
    return;
  }

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res
      .status(401)
      .send(
        getErrorBody(
          "There is no user with this email, may be you can sign up!"
        )
      );
    return;
  }

  const hashedPassword = existingUser.password;
  const match = await bcrypt.compare(password, hashedPassword);

  if (match) {
    const accessToken = generateAccessToken(
      existingUser.id,
      existingUser.email,
      existingUser.name
    );
    // const refreshToken = generateRefreshToken(
    //   existingUser.id,
    //   existingUser.email,
    //   existingUser.name
    // );
    res
      .status(200)
      // .send({ message: "User is signed in!", accessToken, refreshToken });
      .send({ message: "User is signed in!", accessToken, name: existingUser.name });
    return;
  } else {
    res.status(401).send(getErrorBody("Invalid password !"));
    return;
  }
});

// authRouter.post("/signout", async (req, res) => {
//   const checkMessage = validateProperties(req.body, ["refreshToken"]);
//   if (checkMessage) {
//     res.status(401).send(getErrorBody(checkMessage));
//     return;
//   }
//   const { refreshToken } = req.body;
//   const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//   try {
//     console.log(payload.id);
//     const existingUser =  await User.findById(payload.id);
//     if(!existingUser){
//       res.status(401).send(getErrorBody('No user exists with this refreshToken.'));
//       return;
//     }
//     if(!existingUser.refreshToken){
//       res.status(402).send(getErrorBody("You are already signed out!"));
//     }
//     await existingUser.$set({refreshToken: null}).save();
//     res.status(200).send(getSuccessBody('User signed out successfully!'))
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
 

// });

// authRouter.post('/token',(req,res)=>{
//   const checkMessage = validateProperties(req.body, ["refreshToken"]);
//   if (checkMessage) {
//     res.status(401).send(getErrorBody(checkMessage));
//     return;
//   }

// })

module.exports = authRouter;
