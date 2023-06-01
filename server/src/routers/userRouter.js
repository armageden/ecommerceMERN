const express =require('express');
const {getUsers,getUser } = require('../controllers/userControl');
const userRouter=express.Router();


// /api/users
userRouter.get('/',getUsers);
userRouter.get('/:id',getUser)
  
  module.exports= userRouter;