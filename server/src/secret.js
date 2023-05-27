require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecomMERNdb';

const defaultImagePath=process.env.DEFAULT_USER_IMAGE_PATH||'public/image/users/Default_img.jpg'


  module.exports = { serverPort, mongodbURL ,defaultImagePath };
