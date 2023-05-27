const express = require("express");
const morgan = require("morgan");
const bodyparser=require('body-parser');
const createError =require('http-errors');
const rateLimit=require('express-rate-limit');
const xss=require('xss-clean');
const userRouter = require("./routers/userRouter");

const app = express();

const rateLimiter=rateLimit({
  windowMs:1*60*1000,
  max:5,
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
app.use(bodyparser.urlencoded({extended:true}));
app.use("/api/users",userRouter);


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
app.use((err,req,res,next) => {
  return res.status(err.status||500).send("Something's wrong I can feel it") ;
});
module.exports={toLogin};
module.exports=app;