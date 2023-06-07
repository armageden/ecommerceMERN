const express = require("express");
const morgan = require("morgan");
const bodyparser=require('body-parser');
const createError =require('http-errors');
const rateLimit=require('express-rate-limit');
const xss=require('xss-clean');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const app = express();

const rateLimiter=rateLimit({
  windowMs:1*60*1000,
  max:500,// after this i have make it 5
  message:'Too many request from this ip!!'
})
//middleware function
const toLogin=(req,res,next)=>{
  const login =true;
  if (login) {
    req.body.id=101;
    next()
  }
  else{
    return res.status(401).send("Please login first")};
  }
  
app.use(xss());
app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(rateLimiter);
app.use(bodyparser.urlencoded({extended:true}));
app.use("/api/users",userRouter);
app.use("/api/seed",seedRouter);


app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.get("/products", (req, res) => {
  res.send("products are returned");
});
app.get("/test", (req, res) => {
  res.status(200).send("GET:The api testing is working...");
});


//client error handeling
app.use((req,res,next) => {
  next(createError(404,'What you are looking for, is not here!!'));
});

//server error handeling --> all the errors will come here..
/*app.use((err,res,req,next)=>{
return errorResponse(res,{
  statusCode:err.status,
  message:err.message,
})  
})*/
app.use((err,req,res,next)=>{
  return res.status(err.status||500).json({
    success:false,
    message:err.message,
  })
})


//exported modules...
module.exports=app;