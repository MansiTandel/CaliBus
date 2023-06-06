const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url) //mongodb connection url

const db = mongoose.connection;
//check 2 parameters: 1) connection scenario

db.on("connected",()=>{
    console.log('Mongo DB connection is successful!');

});
db.on("error",()=>{
    console.log("Mongo DB connection failed!");
});
