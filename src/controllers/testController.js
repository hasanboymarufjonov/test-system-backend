const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Test = require("../models/testModel");
const Subject = require("../models/subjectModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createTest = asyncHandler(async (req, res) => {
  const { subject, questions } = req.body;

  let test = await Test.findOne({ subject: subject });

  if (test) {
    test.questions.push(...questions);
    await test.save();
  } else {
    test = await Test.create({
      subject: subject,
      questions: questions,
    });
  }

  res.status(201).json(test);
});

const createSubject = asyncHandler(async (req, res) => {
  const { name, imageURL } = req.body;

  try {
    // Create the subject document
    const subject = await Subject.create({ name, imageURL });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// const getAllSubjects = asyncHandler(async (req, res) => {
//   try {
//     // Retrieve all subjects from the database
//     const subjects = await Subject.find();

//     res.status(200).json(subjects);
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

const getAllSubjects = asyncHandler(async (req, res) => {
  let token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  try {
    let userScores = {};

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userScores = user.scores.reduce((acc, score) => {
          acc[score.subjectId.toString()] = score.score;
          return acc;
        }, {});
      }
    }

    const subjects = await Subject.find();

    const subjectsWithScores = subjects.map((subject) => ({
      _id: subject._id,
      name: subject.name,
      imageURL: subject.imageURL,
      userScore: userScores[subject._id.toString()] || 0,
    }));

    res.status(200).json(subjectsWithScores);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const getTestsBySubjectId = asyncHandler(async (req, res) => {
//   const subjectId = req.params.subjectId;

//   const tests = await Test.find({ subject: subjectId }).populate("subject");

//   res.json(tests);
// });

const getTestsBySubjectId = asyncHandler(async (req, res) => {
  let token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const subjectId = req.params.subjectId;
  //   const userId = req.body.user;
  const user = await User.findById(userId);
  console.log(user);
  const tests = await Test.find({ subject: subjectId }).populate("subject");

  const testsWithExtraInfo = tests.map((test) => {
    const testId = `${userId}-${test._id.toString()}`;
    const time = new Date();

    return {
      ...test.toObject(),
      testId,
      time,
      userName: `${user.firstName} ${user.lastName}`,
    };
  });

  res.json(testsWithExtraInfo);
});

const solveTest = asyncHandler(async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const [userId, actualTestId] = testId.split("-");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const test = await Test.findById(actualTestId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let score = 0;
    for (let i = 0; i < test.questions.length; i++) {
      const question = test.questions[i];
      const userAnswer = answers[i];

      if (userAnswer !== "") {
        if (question.answers[userAnswer].isCorrect) {
          score++;
        }
      }
    }

    const subjectIndex = user.scores.findIndex(
      (score) => score.subjectId.toString() === test.subject.toString()
    );
    if (subjectIndex !== -1) {
      user.scores[subjectIndex].score += score;
    } else {
      user.scores.push({
        subjectId: test.subject,
        score: score,
      });
    }

    await user.save();

    res.json({ userId, testId, score });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createTest,
  createSubject,
  getAllSubjects,
  getTestsBySubjectId,
  solveTest,
};
