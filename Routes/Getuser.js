const express = require("express");
const router = express.Router();
// const User = require("../Models/User")
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const Authuser = require("../Middleware/authuser");
const User = require("../Models/User");
const Posts = require("../Models/Post");

router.post("/deletemyaccount", Authuser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const usfollower = user.follwers;
    const usfollowing = user.following;
    const userid = user._id;
    const posts = user.posts;

    await user.remove();

    for (let i = 0; i < posts.length; i++) {
      const element = await Posts.findById(posts[i]);
      await element.remove();
    }
    for (let i = 0; i < usfollower.length; i++) {
      const element = await User.findById(usfollower[i]);

      const index = element.following.indexOf(userid);
      element.following.splice(index, 1);
      await element.save();
    }
    for (let i = 0; i < usfollowing.length; i++) {
      const element = await User.findById(usfollowing[i]);

      const index = element.follwers.indexOf(userid);
      element.follwers.splice(index, 1);
      await element.save();
    }
    res.json("dlted");
  } catch (error) {
    res.json(error)
  }
});

router.get("/data", Authuser, async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({success:true,user:user});
});

router.get("/allusers/q=:query", Authuser, async(req,res)=>{
  try {
    
    const users = await User.find()
    const filtered = users.filter((e)=>{
      return Object.values(e.name.toLowerCase())
      .join("")
      .toLowerCase()
      .includes(req.params.query.toLowerCase());
  }) 
    res.json({users:filtered})
  } catch (error) {
    res.json("error")
  }

})
router.get("/spacificuser/:userid",  async(req,res)=>{
  try {
    
    const user = await User.findOne({_id:req.params.userid}).populate("followers following posts", "name username _id caption likes comments imageUrl")
    if(!user){
      res.status(404).json("No User Found")
 
    }else{
      res.json({user})
      
    }
 
  } catch (error) {
    res.json("error")
  }

})

router.get("/followers/:userid",  async(req,res)=>{
  try {
    
    const user = await User.findOne({_id:req.params.userid}).select("followers").populate("followers", "name username _id profileUrl")
    if(!user){
      res.status(404).json("No User Found")
 
    }else{
      res.json({followers:user.followers})
      
    }
 
  } catch (error) {
    res.json("error")
  }

})
router.get("/followings/:userid",  async(req,res)=>{
  try {
    
    const user = await User.findOne({_id:req.params.userid}).select("following").populate("following", "name username _id profileUrl")
    if(!user){
      res.status(404).json("No User Found")
 
    }else{
      res.json({followings:user.following})
      
    }
 
  } catch (error) {
    res.json("error")
  }

})




module.exports = router;
