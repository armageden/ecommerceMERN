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

// Public routes
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

// Admin only routes
categoryRouter.post("/", isLoggedIn, isAdmin, createCategory);
categoryRouter.put("/:slug", isLoggedIn, isAdmin, updateCategory);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = categoryRouter;
