const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required !"],
      trim: true,
      minlength: [3, "User name can not be less than 3 char"],
      maxlength: [31, "User name can only can be 31 char"],
    },
    email: {
      type: String,
      require: [true, "Email name is required !"],
      trim: true,
      lowercase: true,
      unique: true,
      minlength: [3, "Email name can not be less than 3 char"],
      maxlength: [31, "Email name can only can be upto 31 char"],
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email !!",
      },
    },
    password: {
      type: String,
      require: [true, "User Password is required !"],
      minlength: [6, "Password can not be less than 6 char"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "User image is requied"],
    },
    address: {
      type: String,
      require: [true, "User address is required"],
      minlength: [6, "Address can not be less than 6 char"],
    },
    phone: {
      type: String,
      require: [true, "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const User = model("Users", userSchema);
module.exports = User;
