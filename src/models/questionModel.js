const mongoose = require("mongoose");
const Answer = require("./answerModel");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answers: [
    {
      type: Array,
      //   type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
