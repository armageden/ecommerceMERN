const express =require('express');
const { getprofile } = require('../controllers/userControl');
const userRouter=express.Router();
// /api/users

userRouter.get('/',getprofile);
  
  module.exports= userRouter;