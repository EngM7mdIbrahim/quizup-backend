const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  teacherID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [
    new mongoose.Schema({
      question: {
        type: String,
      },
      choices: [
        {
          type: String,
          default: "",
        },
      ],
      image: {
        type: String,
        default: null
      },
      correctAnswer: {
        type: Number,
        default: 0,
      },
    }),
  ],
  lastEdit: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
