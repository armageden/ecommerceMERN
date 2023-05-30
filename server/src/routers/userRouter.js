const express =require('express');
const {getUsers } = require('../controllers/userControl');
const userRouter=express.Router();


// /api/users
userRouter.get('/',getUsers);
  
  module.exports= userRouter;