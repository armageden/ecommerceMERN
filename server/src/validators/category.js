const { body } = require("express-validator");

// Category validation
const validateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 31 })
        .withMessage("Category name must be between 3-31 characters"),
];

module.exports = { validateCategory };
