const express = require("express");
const productRouter = express.Router();
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/uploadFiles");
const { validateProduct } = require("../validators/product");
const { runValidation } = require("../validators");

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/:slug", getProduct);

// Admin only routes
productRouter.post(
    "/",
    isLoggedIn,
    isAdmin,
    upload.single("image"),
    validateProduct,
    runValidation,
    createProduct
);

productRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    upload.single("image"),
    updateProduct
);

productRouter.delete("/:slug", isLoggedIn, isAdmin, deleteProduct);

module.exports = productRouter;
