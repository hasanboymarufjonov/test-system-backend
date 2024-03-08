const express = require("express");
const router = express.Router();
const {
  createTest,
  createSubject,
  getAllSubjects,
  getTestsBySubjectId,
  solveTest,
} = require("../controllers/testController");

router.route("/").post(createTest);
router.route("/subjects").post(createSubject);
router.route("/subjects").get(getAllSubjects);
router.route("/:subjectId").get(getTestsBySubjectId);
router.route("/:subjectId").post(solveTest);

module.exports = router;
