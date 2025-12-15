const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

// Protected Routes token base
const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin access
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
// User access
const isUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role === 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in user middleware",
    });
  }
};

module.exports = { requireSignIn, isAdmin,isUser };
