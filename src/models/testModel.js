const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  questions: {
    type: Array,
    //   type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
