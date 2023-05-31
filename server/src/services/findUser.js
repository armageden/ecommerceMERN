const User = require("../models/usermodel");
const createError = require("http-errors");
const mongoose=require('mongoose')

const findUserById = async (id) => {
  try {
    const user = await User.findById(id, options);
  const options = { password: 0 };
  if (!user) {
    throw createError(404, "User does not exist with this ID!!");
 
}
return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
        throw createError(400,'Invalid User ID')

  }
  throw error;
}}

module.exports={findUserById}
