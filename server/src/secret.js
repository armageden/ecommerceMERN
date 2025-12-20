require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecomMERNdb";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/image/users/Default_img.jpg";

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "bfgijdi78rthhhiujfskj";
const jwtAccesKey =
  process.env.JWT_ACCESS_KEY || "dbiuebui78y3uhui^$&G";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "resetpasswordkey123";

const smtpUsername = process.env.SMTP_USERNAME || "";

const smptPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "";
const braintreeMerchantId = process.env.BRAINTREE_MERCHANT_ID;
const braintreePublicKey = process.env.BRAINTREE_PUBLIC_KEY;
const braintreePrivateKey = process.env.BRAINTREE_PRIVATE_KEY;

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smptPassword,
  smtpUsername,
  clientURL,
  jwtAccesKey,
  jwtResetPasswordKey,
  braintreeMerchantId,
  braintreePublicKey,
  braintreePrivateKey
};
