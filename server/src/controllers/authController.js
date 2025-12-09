const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtAccesKey, jwtResetPasswordKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");
const handelLogin = async (req, res, next) => {
  try {
    // email,password req.body
    const { email, password } = req.body;
    // check the user existance
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User doesn't exit with this email. Please register an account"
      );
    }
    // compare password for auth
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "The password is incorrect!!");
    }
    // check if banned
    if (user.isBanned) {
      throw createError(
        403,
        "This account is banned!! If you have questions then, please contact admin"
      );
    }
    // token,cookie

    //create jwt
    const accessToken = createJsonWebToken(
      { user },
      jwtAccesKey,
      "15m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, //15 min
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    });
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users loggedin",
      payload: {
        User,
      },
    });
  } catch (error) {
    next(error);
  }
};
const handelLogout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "User loggedout",
      payload: {
        User,
      },
    });
  } catch (error) {
    next(error);
  }
};
const { jwtAccesKey, jwtResetPasswordKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User doesn't exist with this email. Please register an account"
      );
    }

    const token = createJsonWebToken(
      { email },
      jwtResetPasswordKey,
      "10m"
    );

    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
            <h2> Hello ${user.name} ! </h2> 
            <p> Please click here to <a href="${clientURL}/api/auth/reset-password/${token}" target="_blank">reset your password</a></p>       
            `,
    };

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send reset password email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Check your email to reset your password!",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password reset failed");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // Assuming user is attached to req by isLoggedIn middleware

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Old password is incorrect");
    }

    // Mongoose pre-save hook will hash the password if it's modified
    // But here we are using findOneAndUpdate usually, or we can set it manually
    // Wait, the user model has a setter for password hashing?
    // Let's check the user model again.
    // Yes: set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),

    // So if we update directly via findOneAndUpdate, the setter might not run unless runValidators is true?
    // Actually setters run on update if runSettersOnQuery is true? Or we can just save the document.
    // Saving the document is safer for hooks.

    user.password = newPassword;
    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Password updated successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelLogin,
  handelLogout,
  handleForgetPassword,
  handleResetPassword,
  handleUpdatePassword,
};
