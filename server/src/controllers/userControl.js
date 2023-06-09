const createError = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/usermodel");
const { successResponse } = require("./responseController");

const { findWithId } = require("../services/findItem");
const { error } = require("console");

const getUsers = async (req, res, next) => {
  try {
    const search=req.query.search||''
    const page=Number(req.query.page)||1
    const limit= Number(req.query.limit)||5
    const searchRegExp=new RegExp('*'+search+'.*','i')
    const filter={
      isAdmin:{$ne:true},
      $or:[
        {name:{regex:searchRegExp}},
        {email:{regex:searchRegExp}},
        {phone:{regex:searchRegExp}},
      ]
    }

    const options={password:0}
    const users =await User.find(filter,options)
      .limit(limit)
      .skip((page-1)*limit)

    const count=await User.find(filter).countDocuments();
    if(!users)throw createError(404,'no users found')

    return successResponse(res, {
      statusCode: 200,
      message: "Users are returned",
      payload: {
        User,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findWithId(User,id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User is returned",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User,id, options);
    
    const userImagePath = user.image;
    fs.access(userImagePath, (err) => {
      if (err) {
        console.error("user image not exist!");f
      } else {
        fs.unlink(userImagePath, (err) => {
          if (error) {
            throw err;
          }
          console.log("user image was deleted");
        });
      }
    });

await User.findByIdAndDelete({_id:id,isAdmin:false})
    
  
    return successResponse(res, {
      statusCode: 200,
      message: "User was Deleted",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getUsers, getUserById, deleteUserById, };
