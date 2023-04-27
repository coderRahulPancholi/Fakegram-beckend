const express = require("express");
const Authuser = require("../Middleware/authuser");
const router = express.Router();
const Posts = require("../Models/Post");

const User = require("../Models/User");

router.post("/createpost", Authuser, async (req, res) => {
  try {
    const { caption } = req.body;

    const post = await Posts.create({ caption, owner: req.user._id,ownerusername:req.user.name });

    const user = await User.findById(req.user._id);

    user.posts.push(post._id);

    await user.save();

    res.json(post).setHeader("Access-Control-Allow-Origin","*");
  } catch {
    res.json("error");
  }
});

router.get("/posts", Authuser, async (req, res) => {
  try {
    const posts = await Posts.find({ owner: req.user._id });
    if (!posts) {
      res.status(404).json("no postes added");
    } else {
      res.json({posts}).setHeader("Access-Control-Allow-Origin","*");
    }
  } catch (error) {
    res.status(504).json(error);
  }
});

router.post("/like/:postid", Authuser, async (req, res) => {
  try {
    const tobelike = await Posts.findById(req.params.postid);
    if (!tobelike) {
      res.json("no post found");
    } else {
      if (tobelike.likes.includes(req.user._id)) {
        const index = tobelike.likes.indexOf(req.user._id);
        tobelike.likes.splice(index, 1);
        await tobelike.save();

        res.json("Unliked");
      } else {
        tobelike.likes.push(req.user._id);
        await tobelike.save();
        res.json("Liked").setHeader("Access-Control-Allow-Origin","*");
      }
    }
  } catch (error) {
    res.json("error");
  }
});

router.delete("/delete/post/:id", Authuser, async (req, res) => {
  try {
    const tobedlt = await Posts.findById(req.params.id);

    if (!tobedlt) {
      res.json("post not found");
    } else {
      if (tobedlt.owner.toString() === req.user._id.toString()) {
        await tobedlt.remove();

        const user = await User.findById(req.user._id);

        if (user.posts.includes(req.params.id)) {
          const index = user.posts.indexOf(req.params.id);
          user.posts.splice(index, 1);
          await user.save();
        }
        res.json("post dlted").setHeader("Access-Control-Allow-Origin","*");
      } else {
        res.json("not allowed");
      }
    }
  } catch (error) {
    res.json("error");
  }
});

router.get("/following/posts", Authuser, async(req,res)=>{
  try {
  const user = await User.findById(req.user._id);
  const postesoffollowing = await Posts.find({
    owner:{
      $in:user.following
    }
  })
  const letestposts = postesoffollowing.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.postedon) - new Date(a.postedon);
  })
   
res.json({letestposts}).setHeader("Access-Control-Allow-Origin","*")
    

  } catch (error) {
    res.status(504).json(error);
    
  }



})

module.exports = router;
