const express = require("express");

const {
  login,
  register,
  update,
  getUserById,
  getAllUser,
} = require("../controllers/authController.js");
const { verifyToken } = require("../middleware/authMiddleWare.js");

const router = express.Router();
router.get("/users", verifyToken, getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.put("/update/:id", verifyToken, update);
router.post("/sign-up", register);
router.post("/login", login);

module.exports = router;
