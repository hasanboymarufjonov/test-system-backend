const express = require("express");
const router = express.Router();
const {
  createTest,
  createSubject,
  getAllSubjects,
  getTestsBySubjectId,
  solveTest,
} = require("../controllers/testController");

const protect = require("../middlewares/authMiddleware");
const {
  checkUserRole,
  checkAdminRole,
} = require("../middlewares/checkUserRoleMiddleware");

router.route("/").post(checkAdminRole, createTest);
router.route("/subjects").post(checkAdminRole, createSubject);
router.route("/subjects").get(protect, getAllSubjects);
router.route("/:subjectId").get(protect, getTestsBySubjectId);
router.route("/:subjectId").post(protect, solveTest);

// router.route("/").post(createTest);
// router.route("/subjects").post(createSubject);
// router.route("/subjects").get(getAllSubjects);
// router.route("/:subjectId").get(getTestsBySubjectId);
// router.route("/:subjectId").post(solveTest);

module.exports = router;
