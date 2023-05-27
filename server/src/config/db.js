const mongoose=require("mongoose");
const { mongodbURL } = require("../secret");
const connectDB=async(options={})=>{
    try{
        await mongoose.connect(mongodbURL,options);
        console.log('mongodb connected!!')
        mongoose.connection.on('error',(error)=>{
            console.error('database connection error:',error);
        })
    }
    catch(error){
    console.error('Could not connect to DB !!',error.toString());
    }
   
}
module.exports = connectDB;