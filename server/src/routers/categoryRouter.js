const express = require("express");
const categoryRouter = express.Router();
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/uploadFiles");
const { validateCategory } = require("../validators/category");
const { runValidation } = require("../validators");

// Public routes
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

// Admin only routes
categoryRouter.post(
    "/",
    isLoggedIn,
    isAdmin,
    upload.single("image"),
    validateCategory,
    runValidation,
    createCategory
);
categoryRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    upload.single("image"),
    updateCategory
);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = categoryRouter;
