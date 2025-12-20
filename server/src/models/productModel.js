const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [3, "Product name must be at least 3 characters"],
            maxlength: [150, "Product name cannot exceed 150 characters"],
        },
        slug: {
            type: String,
            required: [true, "Product slug is required"],
            lowercase: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            min: [0, "Quantity cannot be negative"],
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        image: {
            type: Buffer,
            contentType: String,
            required: [true, "Product image is required"],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },
        shipping: {
            type: Boolean,
            default: false,
        },
        reviews: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        numReviews: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Generate slug before saving
productSchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Product = model("Product", productSchema);
module.exports = Product;
