const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name,username, email, password } = req.body;
    if(!name || !username || !email || !password){
      res.status(401).json("Please enter data")

    }else{

    
    const isexist = await User.findOne({ email: email }).select("+password") || await User.findOne({ username: username }).select("+password") 
    if (isexist) {
      res.status(404).send("User Already Regiterd");
    } else {
      const salt = await bcrypt.genSalt(10);
      const securepass = await bcrypt.hash(password, salt);
      const newuser = new User({ name,username, email ,password: securepass });
      await newuser.save();

      const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECREAT);
      res
      .cookie("token", token, {
        expires: new Date(Date.now() + 24657987654687),
        httpOnly: true,
        secure:true,
        sameSite:"none"
      })
      .json({ sucess: true,user:newuser });
    }
  
  }
  } catch (e) {
    res.status(401).send(e);
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isexist = await User.findOne({ email: email }).select("+password");
    if (!isexist) {
      res.status(404).send("no user");
    } else {
      const passcheck = bcrypt.compare(password, isexist.password);

      if (!passcheck) {
        res.send("pass wrong");
      } else {
        const token = jwt.sign({ id: isexist._id }, process.env.JWT_SECREAT);

        res
          .cookie("token", token, {
            expires: new Date(Date.now() + 24657987654687),
            httpOnly: true,
            // secure:true,
            // sameSite:"none"
          })
          .json({ sucess: true,user:isexist });
      }
    }
  } catch (e) {
    res.status(500).json("some error")
  }
});


router.post("/logout", async(req,res)=>{
    try{
        res.cookie("token",null,{
          expires:new Date(Date.now() ),
          // secure:true,
          // sameSite:"none"
        }).json("logged out")

    }catch{

        res.json("some error")
    }

})

module.exports = router;
