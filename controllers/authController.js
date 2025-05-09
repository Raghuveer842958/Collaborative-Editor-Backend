const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation");
const { main } = require("../utils/nodemailer");
const JWT_SECRET = "your_secret_key";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.signup = async (req, res) => {
  console.log("signup api hit..............");
  try {
    // Validation of data
    validateSignUpData(req);

    const { userName, emailId, password } = req.body;
    console.log("userName emailId password is :", userName, emailId, password);

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    //   Creating a new instance of the User model
    const user = new User({
      userName,
      emailId,
      password: passwordHash,
      otp,
      otpExpires,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    main(emailId, otp);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // Set expiration time
      httpOnly: true, // Make the cookie inaccessible to JavaScript
      secure: true, // Send cookie over HTTPS only
      sameSite: "None", // Allow cross-site requests
    });

    res.json({
      message: `${userName} Registered Successfully!!`,
      data: savedUser,
    });
  } catch (err) {
    console.log("Error is :",err.message);
    res.status(400).send({
      message: "Error in User Registration",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  console.log("Login api hit..............");
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // Set expiration time
        httpOnly: true, // Make the cookie inaccessible to JavaScript
        secure: true, // Send cookie over HTTPS only
        sameSite: "None", // Allow cross-site requests
      });

      const updatedUser = await user.save();

      res.send({
        message: "Email has been send on you email",
        user: updatedUser,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Check if OTP is valid
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "None", // Allow cross-site usage
  });
  res.status(200).send("Logged out successfully");
};
