const express = require("express");
const router = express.Router();

const { userController } = require("../controller/user");

// Save Feedback
router.post("/", userController.addFeedback);

// Get All Feedback
router.get("/", userController.getFeedback);

// Delete Feedback
router.delete("/:id", userController.deleteFeedback);

module.exports = router;