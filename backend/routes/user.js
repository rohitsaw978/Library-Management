const express = require("express");
const router = express.Router();

const { checkRole } = require("../middlewares/checkRole");
const { userAuth } = require("../middlewares/userAuth");
const { userController } = require("../controller/user");

// Get All Users
router.get("/", userController.getUsers);

// Register
router.post("/register", userController.userRegistration);

// Login
router.post("/login", userController.login);

// User Profile
router.get(
  "/profile",
  userAuth,
  checkRole("user"),
  userController.profile
);

// Contact Form
router.post("/contact", userController.addContact);

// Forgot Password
router.post("/forgot-password", userController.forgotPassword);

// Verify OTP
router.post("/verify-otp", userController.verifyOTP);

// Reset Password
router.post("/reset-password", userController.resetPassword);

// Delete User / Librarian
router.delete("/:id", userController.deleteUser);

module.exports = router;