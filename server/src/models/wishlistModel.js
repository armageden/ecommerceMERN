const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

// Ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

const Wishlist = model("Wishlist", wishlistSchema);
module.exports = Wishlist;
