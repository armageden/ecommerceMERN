const slugify = require("slugify");
const createError = require("http-errors");
const Category = require("../models/categoryModel");
const { successResponse } = require("./responseController");

// Create category
const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const slug = slugify(name, { lower: true, strict: true });

        const categoryExists = await Category.exists({ name: name });
        if (categoryExists) {
            throw createError(409, "Category with this name already exists");
        }

        const categoryData = { name, slug };

        // Handle image upload
        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image file is too large! Max 2MB allowed");
            }
            categoryData.image = image.buffer.toString("base64");
        }

        const category = await Category.create(categoryData);

        return successResponse(res, {
            statusCode: 201,
            message: "Category was created successfully",
            payload: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Get all categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).select("name slug").lean();

        return successResponse(res, {
            statusCode: 200,
            message: "Categories returned successfully",
            payload: { categories },
        });
    } catch (error) {
        next(error);
    }
};

// Get single category by slug
const getCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug }).select("name slug image");

        if (!category) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Category returned successfully",
            payload: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Update category
const updateCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name } = req.body;

        const updateData = {};
        if (name) {
            updateData.name = name;
            updateData.slug = slugify(name, { lower: true, strict: true });
        }

        // Handle image upload
        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image file is too large! Max 2MB allowed");
            }
            updateData.image = image.buffer.toString("base64");
        }

        const category = await Category.findOneAndUpdate({ slug }, updateData, {
            new: true,
        }).select("name slug");

        if (!category) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Category was updated successfully",
            payload: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Delete category
const deleteCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOneAndDelete({ slug });

        if (!category) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Category was deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
