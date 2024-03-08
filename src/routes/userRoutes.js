const express = require("express");

const {
  authUser,
  registerUser,
  logoutUser,
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

module.exports = router;
