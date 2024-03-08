const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_1280.jpg",
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
