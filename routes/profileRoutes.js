const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { profile } = require("../controllers/profileController");

profileRouter.get("/profile/view", userAuth, profile);

module.exports = profileRouter;
