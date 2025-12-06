const { body } = require("express-validator");

// Product validation
const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 3, max: 150 })
        .withMessage("Product name must be between 3-150 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters"),

    body("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),

    body("category")
        .notEmpty()
        .withMessage("Product category is required")
        .isMongoId()
        .withMessage("Invalid category ID"),

    body("shipping")
        .optional()
        .isBoolean()
        .withMessage("Shipping must be a boolean"),
];

module.exports = { validateProduct };
