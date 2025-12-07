const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { successResponse } = require("./responseController");
const { deleteImage } = require("../helper/deleteImage");

// Create product
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category } = req.body;

        const image = req.file;
        if (!image) {
            throw createError(400, "Product image is required");
        }
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Image file is too large! Max 2MB allowed");
        }

        const imageBufferString = image.buffer.toString("base64");

        const productData = {
            name,
            slug: slugify(name, { lower: true, strict: true }),
            description,
            price,
            quantity,
            shipping,
            category,
            image: imageBufferString,
        };

        const product = await Product.create(productData);

        return successResponse(res, {
            statusCode: 201,
            message: "Product was created successfully",
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Get all products with filtering and pagination
const getProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const category = req.query.category || "";
        const sort = req.query.sort || "-createdAt"; // Default sort by newest

        const searchRegExp = new RegExp(".*" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ".*", "i");

        const filter = {
            $or: [
                { name: { $regex: searchRegExp } },
                { description: { $regex: searchRegExp } },
            ],
        };

        if (category) {
            // Find category id by slug or name if needed, assuming category query is slug
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }

        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const shipping = req.query.shipping;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (shipping) {
            filter.shipping = shipping === "true";
        }

        // Dynamic sorting logic
        let sortCriteria = {};
        if (sort) {
            const sortFields = sort.split(",").join(" ");
            sortCriteria = sortFields;
        }

        const products = await Product.find(filter)
            .populate("category")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortCriteria);

        const count = await Product.find(filter).countDocuments();

        return successResponse(res, {
            statusCode: 200,
            message: "Products returned successfully",
            payload: {
                products,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                    totalProducts: count,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get single product by slug
const getProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug }).populate("category");

        if (!product) {
            throw createError(404, "Product not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Product returned successfully",
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Update product
const updateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const updateData = req.body;

        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true });
        }

        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image file is too large! Max 2MB allowed");
            }
            updateData.image = image.buffer.toString("base64");
        }

        const product = await Product.findOneAndUpdate({ slug }, updateData, {
            new: true,
        }).populate("category");

        if (!product) {
            throw createError(404, "Product not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Product was updated successfully",
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOneAndDelete({ slug });

        if (!product) {
            throw createError(404, "Product not found");
        }

        // Since we store image as buffer, we don't need to delete file from fs
        // But if we were storing paths, we would use deleteImage helper here

        return successResponse(res, {
            statusCode: 200,
            message: "Product was deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
