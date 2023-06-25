const express = require('express');
const mongoose = require('mongoose')
const user = mongoose.model("user");
const jwt = require("jsonwebtoken");
require("dotenv").config()


const isLoggedIn = async (req, res, next) => {
     
    let token = req.headers.authorization
    // console.log("token", token) // "Bearer 6d1a2939-b078-4888-be36-12febfe21404"

    token = token.split(" ")[1]  
    //   token = token.replace("Bearer ", "")
    try{ 
         
      let _id
      jwt.verify(token, process.env.JSON_SECRET_KEY, (err,payload)=>{
          
            if (err){
                  console.log("Token is invalid",err.message)
                  return res.send({error: "Token is invalid or expired"});
            }

            _id = payload._id

     
      })
         
        let foundUser = await user.findOne({_id: payload._id})
          
         // req.user = foundUser
          next()
      

    }
    catch(err){
          console.log("Token is invalid",err)
          return res.send({error: "Token is invalid"})
    }






}

module.exports = isLoggedIn;