const quizzesRouter = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user.model.js");
const Quiz = require("../models/quiz.model");
const {uploadManager} = require('../constants/middleWares')
const {
  getErrorBody,
  validateProperties,
  getSuccessBody,
  validateQuestion,
  sendGeneralError
} = require("./helper");

quizzesRouter.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      teacherID: req.userID,
    });
    res.status(200).send(quizzes);
  } catch (e) {
    res.status(500).send(getErrorBody(e.message));
  }
});

quizzesRouter.post("/", async (req, res) => {
  const { name, tag, questions } = req.body;
  const teacherID = req.userID;
  const checkMessage = validateProperties(req.body, [
    "name",
    "tag",
    "questions",
  ]);
  if (checkMessage) {
    res.status(400).send(getErrorBody(checkMessage));
    return;
  }

  if (!Array.isArray(questions)) {
    res
      .status(400)
      .send(getErrorBody("'questions' attribute should be an array."));
    return;
  }

  let i = 0;
  try {
    questions.forEach((question) => {
      if (!validateQuestion(question, res, i)) {
        throw Error();
      }
      i++;
    });
  } catch (e) {
    return;
  }

  try {
    const existingQuiz = await Quiz.findOne({ name });
    if (existingQuiz) {
      res
        .status(401)
        .send(
          getErrorBody(
            "There is already a quiz template with the same name. Please change the name"
          )
        );
      return;
    }

    const existingTeacher = await User.findOne({ _id: teacherID });
    if (!existingTeacher) {
      res.status(401).send(getErrorBody("This teacher doesn't exist!"));
      return;
    }

    const savedQuiz = await new Quiz({
      name,
      tag,
      teacherID,
      questions,
    }).save();

    await existingTeacher
      .$set({ ads: [...existingTeacher.quizzes, savedQuiz.id] })
      .save();
    res.status(201).send({
      message: "Quiz Template Added successfully!",
      id: savedQuiz.id,
      questions: savedQuiz.questions.map((question) => question._id),
    });
    return;
  } catch (e) {
    sendGeneralError(e, res);
    return;
  }
});

quizzesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const checkMessage = validateProperties(req.params, ["id"]);
  if (checkMessage) {
    res.status(400).send(getErrorBody(checkMessage));
    return;
  }
  try {
    const existingQuiz = await Quiz.findOne({ _id: id });
    if (!existingQuiz) {
      res.status(401).send(getErrorBody("There is no quiz with this id."));
      return;
    }
    const exisitngTeacher = await User.findOne({ _id: existingQuiz.teacherID });
    await exisitngTeacher
      .$set({
        quizzes: exisitngTeacher.quizzes.filter((quiz) => {
          return quiz.toString() !== existingQuiz.id;
        }),
      })
      .save();
    await Quiz.deleteOne({ _id: existingQuiz._id });
    res.status(200).send(getSuccessBody("The Quiz is deleted successfully!"));
  } catch (e) {
    res
      .status(401)
      .send(getErrorBody("There is no Quiz with this id." + e.message));
    return;
  }
});

// quizzesRouter.post("/edit/:id", async (req, res) => {
//   const { buyerID } = req.body;
//   const { id } = req.params;
//   const checkBody = { ...req.body, ...req.params };
//   const checkMessage = validateProperties(checkBody, ["buyerID", "id"]);
//   if (checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingAd = await Ad.findById(id);
//     if (!existingAd) {
//       res.status(401).send(getErrorBody("There is no ad with this ID."));
//       return;
//     }

//     const existingBuyer = await User.findById(buyerID);
//     if (!existingBuyer) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "This buyer is not registered yet, please signup and then continue!"
//           )
//         );
//       return;
//     }

//     await existingAd
//       .$set({
//         interestedBuyers: [...existingAd.interestedBuyers, existingBuyer.id],
//       })
//       .save();

//     res.status(201).send({ message: "Buyer is intereseted successfully!" });
//     return;
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
// });

quizzesRouter.post('/upload',uploadManager.array('images',50), (req,res)=>{
  console.log(req.files)
  res.status(200).send(getSuccessBody('Files saved sucessfully!'))
} )

module.exports = quizzesRouter;
