const express = require("express");
const Authuser = require("../Middleware/authuser");
const router = express.Router();
const Posts = require("../Models/Post");

const User = require("../Models/User");
const singleUpload = require("../Middleware/multer");
const getDataUri = require("../Utilis/Datauri");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Api_Key,
  api_secret: process.env.Api_Secret,
});

router.post("/createpost", Authuser, singleUpload, async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;

    const fileuri = getDataUri(file);
    // console.log(fileuri)
    const cdata = await cloudinary.uploader.upload(fileuri.content, {
      width: 500,
      height: 500,
      sign_url: true,
      public_id: file.originalname,
    });

    const post = await Posts.create({
      caption,
      ownerid: req.user._id,
      ownerusername: req.user.username,
      ownername: req.user.name,
      imageUrl: cdata.secure_url,
    });

    const user = await User.findById(req.user._id);

    user.posts.push(post._id);

    await user.save();

    res.json({ post });
  } catch {
    res.status(500).json("error");
  }
});

// router.post("/createimgpost", Authuser,singleUpload, async (req, res) => {
//   try {

//     if(file){
//       const fileuri =  getDataUri(file)
//       // console.log(fileuri)
//       const cdata = await cloudinary.uploader.upload(fileuri.content,{  width: 250, height: 250,
//       sign_url: true,public_id:file.originalname, })

//       const post = await Posts.create({imageUrl:cdata.secure_url});

//     const user = await User.findById(req.user._id);

//     user.posts.push(post._id);

//     await user.save();
//         res.json({success:true,messege:"Posted Successfully",post})

//       }

//   } catch {
//     res.json("error");
//   }
// });

router.get("/posts", Authuser, async (req, res) => {
  try {
    const posts = await Posts.find({ ownerid: req.user._id }).populate(
      "likes ownerid",
      "name _id username profileUrl"
    );
    if (!posts) {
      res.status(404).json("no postes added");
    } else {
      res.json({
        posts: posts.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.postedon) - new Date(a.postedon);
        }),
      });
    }
  } catch (error) {
    res.status(504).json(error);
  }
});
router.get("/onepost/:postid", Authuser, async (req, res) => {
  try {
    const post = await Posts.findOne({ _id: req.params.postid }).populate(
      "likes ownerid comments.userid",
      "_id name username profileUrl"
    );
    if (!post) {
      res.status(404).json("no postes added");
    } else {
      res.json({ post });
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
        res.json("Liked");
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
      if (tobedlt.ownerid.toString() === req.user._id.toString()) {
        await tobedlt.remove();

        const user = await User.findById(req.user._id);

        if (user.posts.includes(req.params.id)) {
          const index = user.posts.indexOf(req.params.id);
          user.posts.splice(index, 1);
          await user.save();
        }
        res.json("post dlted");
      } else {
        res.json("not allowed");
      }
    }
  } catch (error) {
    res.json("error");
  }
});

router.get("/following/posts", Authuser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postesoffollowing = await Posts.find({
      ownerid: {
        $in: user.following,
      },
    }).populate("likes ownerid", "name username _id profileUrl ");
    const letestposts = postesoffollowing.reverse()
    // const letestposts = postesoffollowing.sort(function (a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.postedon) - new Date(a.postedon);
    // });
    res.json({ letestposts });
  } catch (error) {
    res.status(504).json(error);
  }
});

router.post("/comment/:postid", Authuser, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.postid);
    const { comment } = req.body;
    if (!post) {
      res.status(404).json({ sucess: false, messege: "No Post Found" });
    }
    if (!comment) {
      res
        .status(400)
        .json({ sucess: false, messege: "Please enter some comment" });
    } else {
      post.comments.push({
        comment: comment,
        userid: req.user._id,
        username: req.user.username,
      });

      await post.save();
      res.json({ sucess: true, messege: "Commented sucessfully" });
    }
  } catch (error) {
    res.status(504).json({ sucess: false, messege: error.messege });
  }
});

router.delete("/deletecomment/:commentid", Authuser, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.postid);

    if (!post) {
      res.status(404).json({ sucess: false, messege: "No Post Found" });
    }

    post.comments.push({
      comment: req.body.comment,
      userid: req.user._id,
      username: req.user.username,
    });

    await post.save();
    res.json({ sucess: true, messege: "Commented sucessfully" });
  } catch (error) {
    res.status(504).json({ sucess: false, messege: error.messege });
  }
});

module.exports = router;
