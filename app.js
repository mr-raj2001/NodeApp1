const express = require("express");
const mongoose = require("mongoose");
//import mongoose from "mongoose";
const app = express();
const PORT = 5000;
require("./models/users.js") //this is not exportin gimporting this is loading
const authRouter = require("./routes/auth.js")
const cors = require('cors')

//Database Connection
mongoose.connect("mongodb+srv://Raj_2001:Raj2001@cluster0.pxptwj2.mongodb.net/")
 mongoose.connection.on("connected",()=> {console.log("Connected to daatbse")})
 mongoose.connection.on("error",()=> {console.log("Error to daatbse")})


 //Middleware
app.use(cors());
 app.use(express.json())
 app.use(authRouter);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
