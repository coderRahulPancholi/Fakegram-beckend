const express = require("express");
const Authuser = require("../Middleware/authuser");
const User = require("../Models/User");
const singleUpload = require("../Middleware/multer");
const getDataUri = require("../Utilis/Datauri");

const router = express.Router();

const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
   cloud_name: process.env.Cloud_Name,
   api_key: process.env.Api_Key,
   api_secret: process.env.Api_Secret
 });


router.put("/profile/update",Authuser,async(req,res)=>{
    try {

      const user = await User.findById(req.user._id)
 const{bio,city,state,num,dob,name}=req.body

 
 if(bio){
    user.bio = bio
 }
 if(city){
    user.city = city
 }
 if(dob){
    user.dob = dob
 }
 if(state){
    user.state = state
 }
 if(num){
    user.num = num
 }
 if(name){
    user.name = name
 }
 await user.save()
res.json(user)
        
    } catch (error) {
        res.status(500).json({messege:error.messege})
    }
})

router.post("/upload/userprofile",Authuser,singleUpload,async(req,res)=>{
   try {
      const user = await User.findById(req.user._id)
      const file = req.file

if(file){
const fileuri =  getDataUri(file)
// console.log(fileuri)
const cdata = await cloudinary.uploader.upload(fileuri.content,{gravity: "face", width: 300, height: 300, radius: "max", crop: "fill",  
sign_url: true,public_id:file.originalname,folder:"UsersProfiles" ,})

   user.profileUrl= cdata.secure_url


}
await user.save()
res.json({success:true,messege:"Profile Photo Update Successfully"})
 } catch (error) {
   res.status(500).json({messege:error.messege})
   }
})

module.exports = router