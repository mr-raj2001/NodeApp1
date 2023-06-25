//import express from 'express';
//import authRouter from express.Router()



require("dotenv").config()
//console.log(process.env("JSON_SECRET_KEY"));
const {v4:uuid4} = require('uuid');
const express = require("express")
const { default: mongoose } = require("mongoose")
const authRouter = express.Router()

const user = mongoose.model("user");
const bcrypt = require("bcrypt")
const isLoggedIn = require("../middleware/isLoggedin.js")
const jwt = require("jsonwebtoken")
//const dotenv = require("dotenv")

console.log(process.env.JSON_SECRET_KEY)

authRouter.post("/signup",(req,res) => {
    console.log(req.body)

    

  //res.send("Daat connected")

    const {name,email,password} = req.body;

    if(!name || !email || !password){
      return res.send({error: "Please add all the fields"})
  }

  

  //check if email laready exist in database

  user.findOne({email : email})
  .then(
    (savedUser)=> {
      if (savedUser){
        return res.send({error: "User already exists"})
      }

      bcrypt.hash(password, 12)   //12 means it will be encrypted 12 times
    
      .then((hashedPassword) => {
  
        if(!hashedPassword){
          return res.send({error:"Password not hashed"})
        }
        let newUser = new user({
          name: name,
          email: email,
          password : hashedPassword
         })
      
         newUser.save()   //all database operation are by default async in nature
          //it returns promise 
         .then((savedUser) => {
  
         if(!savedUser){
          return res.send({error: "User not saved"})
         }
         res.send({success: true, message: "user saved succesfully", data: savedUser})
        })
         .catch(err => console.log(err))
          
  
      } )
      .catch(err => console.log(err))
    }
  )
  .catch(err=>console.log(err))


   
   //adding things in database

  
})


authRouter.post("/login", (req,res) => {
  const {email,password}= req.body;

  if(!email || !password){
    return res.send({error: "Please add all the fields"})

  }

    //email validation  //regex


    user.findOne({email: email})
      .then((foundUser) => {
        console.log("foundUser", foundUser)
        if(foundUser == null){
          return res.send({error: "User not found"})

        }
        //compare password:
        bcrypt.compare(password, foundUser.password)
        .then((result) => {
          if(result == false){
            return res.send({error: "Invalid Password"})
          }
          //everytime you logina  new passwor will be created and you logout the token will expire
           
           //generate token 
            let token = jwt.sign({_id: foundUser._id,name:foundUser.name}, process.env.JSON_SECRET_KEY, {expiresIn: "1h"})

           //token => jwt.verify(token, "adksagoiuerhgoeruh")



            return res.send({success: true,message: "User logged in successfully", data: foundUser,token:token})

           })

           

         
        })
      

      .catch(err=>console.log("issue while searching email in database",err))
    

    })



authRouter.get("/secret",isLoggedIn, (req,res) => {
  /*  let authorization = req.headers.authorization;
   let token = authorization.split(" ")[1];
   user.findOne({token : token}).then((foundUser) => {
    if(foundUser == null){
      return res.send({error: "User not found"})
    }}); */
    return res.send({success: true, message: "User found",loggedInAgentDetails:req.user});
})


authRouter.delete("/logout", isLoggedIn, async(req, res)=>{
  req.user.token = null;
  try{
     let savedUser = await req.user.save()
     return res.send({success: true, message: "User logged out successfully", data: savedUser})
  }
   catch(err){
     console.log("Logout Failed",err)
   }

})

//export default authRouter;
module.exports = authRouter;