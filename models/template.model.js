const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [
    new mongoose.Schema({
      question: {
        type: String,
      },
      choices: [
        {
          type: String,
          default: '',
        },
      ],
      correctAnswer: {
        type: Number,
        default: 0,
      },
    }),
  ],
  lastEdit: {
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model("Template", templateSchema);
