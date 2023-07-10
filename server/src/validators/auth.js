const { body } = require("express-validator");

// registration validation
const validatUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address!"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 character long")
    .matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/)
    .withMessage(
      "Password should contain at least one uppercase letter,one lowercase letter,one number and one special character"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 6 })
    .withMessage("Invalid Email address!"),

  body("phone").trim().notEmpty().withMessage("Phone is required"),

  body("image").optional().isString().withMessage("image should be a string"),

  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),
];
// sign in validation

module.exports = { validatUserRegistration };
