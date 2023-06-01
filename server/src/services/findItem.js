const User = require("../models/usermodel");
const createError = require("http-errors");
const mongoose=require('mongoose')

const findWithId = async (id,options={}) => {
  try {
    const item = await User.findById(id, options);
  
  if (!item) {
    throw createError(404, "Item with this ID does not exist !!");
 
}
return User;
  } catch (error) {
    if (error instanceof mongoose.Error) {
        throw createError(400,'Invalid Item ID')

  }
  throw error;
}}

module.exports={findWithId}
