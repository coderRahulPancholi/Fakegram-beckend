const express = require("express");
const Authuser = require("../Middleware/authuser");
const User = require("../Models/User");
const router = express.Router();

router.post("/follow/:userid", Authuser, async (req, res) => {
  try {
    const tofollow = await User.findById(req.params.userid).select("-password");
    const user = await User.findById(req.user._id);

    if (tofollow) {
      if (tofollow.follwers.includes(req.user._id)) {
        const index = tofollow.follwers.indexOf(req.user._id);
        tofollow.follwers.splice(index, 1);
        await tofollow.save();

        if (user.following.includes(req.params.userid)) {
          const index2 = user.following.indexOf(req.params.userid);
          user.following.splice(index2, 1);

          await user.save();
        }

        res.json("unfollowed");
      } else {
        tofollow.follwers.push(req.user._id);

        if (!user.following.includes(req.params.userid)) {
          user.following.push(req.params.userid);
          await user.save();
        }

        await tofollow.save();

        res.json("followed");
      }
    }
  } catch {
    res.json("error");
  }
});

router.get("/followers", Authuser, async (req, res) => {
  try {
    const user = req.user;

    const follwers = await User.find({ _id: { $in: user.follwers } }).select(
      "name"
    );
    res.json(follwers);
  } catch (error) {
    res.json(error);
  }
});
router.get("/following", Authuser, async (req, res) => {
  try {
    const user = req.user;

    const following = await User.find({ _id: { $in: user.following } }).select(
      "name"
    );
    res.json(following);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
