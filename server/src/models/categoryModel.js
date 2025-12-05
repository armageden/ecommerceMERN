const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
            minlength: [3, "Category name must be at least 3 characters"],
            maxlength: [31, "Category name cannot exceed 31 characters"],
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            lowercase: true,
            unique: true,
        },
        image: {
            type: Buffer,
            contentType: String,
        },
    },
    { timestamps: true }
);

const Category = model("Category", categorySchema);
module.exports = Category;
