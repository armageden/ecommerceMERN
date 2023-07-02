require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecomMERNdb";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/image/users/Default_img.jpg";

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "bfgijdi78rthhhiujfskj";

const smtpUsername = process.env.SMTP_USERNAME || "";

const smptPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "";

const uploadDir = process.env.UPLOAD_FILE || "public/images/users";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smptPassword,
  smtpUsername,
  clientURL,
  uploadDir,
};
