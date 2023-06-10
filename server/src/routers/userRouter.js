const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,processRegister
} = require("../controllers/userControl");
const userRouter = express.Router();

// /api/users
userRouter.get('/', getUsers);
userRouter.post('/process-register', processRegister);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);

module.exports = userRouter;
