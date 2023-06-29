const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authuser = require("../Middleware/authuser");
const sendMail = require("../Utilis/Sendmail");

router.post("/sendotp", async (req, res) => {
  try {
    const { email, username, name, password } = req.body;

    const isexist = await User.findOne({ email });
    const isusername = await User.findOne({ username });
    if (isexist && isexist.verified && isusername) {
      return res
        .status(207)
        .json({ sucess: false, messeage: "Email And Username Already Taken " });
    }

    if (isusername) {
      return res
        .status(207)
        .json({ sucess: false, messeage: "Username Already Taken " });
    }

    if (isexist && isexist.verified) {
      return res
        .status(207)
        .json({ sucess: false, messeage: "Email Already Registered " });
    }
    if (isexist && !isexist.verified) {
      return res
        .status(200)
        .json({ sucess: true, messeage: "Verify Account " });
    }

    if (!isexist) {

      const otp = Math.floor(Math.random() * 1000000);
      const salt = await bcrypt.genSalt(10);
      const securepass = await bcrypt.hash(password, salt);
      await sendMail(
        email,
        `Email Verification Code: ${otp}`,
        `${otp} `
      );
      const user = await User.create({
        email,
        username,
        name,
        password:securepass,
        otp,
        otp_expiry: new Date (Date.now() + 10 * 60 * 1000),
      });

      res.json({ sucess: true, messeage: `Otp Sent To ${email}` });
    }
  } catch (error) {}
});




router.post("/verifymail", async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email });

    if (user.verified) {
      return res.json({ sucess: false, messeage: "Account Already Verified" });
    }
    if (otp !== user.otp.toString() && user.otp_expiry > new Date(Date.now())) {
      return res.json({
        sucess: false,
        messeage: "Invaild Otp Or Has Expried",
      });
    }

    user.otp = null;
    user.otp_expiry = null;
    user.verified = true;
    await user.save();


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24657987654687),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }).json({ sucess: true, messeage: "Account verified" });

  } catch (error) {
    res.status(401).json({ sucess: false, messeage: "Internal Server Error" });
  }
});


router.post("/resendotp",async(req,res)=>{
  try {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
      res.status(500).json({messeage:"Register Again"})
    }
    if(user && !user.verified){
      const otp = Math.floor(Math.random() * 1000000);

      user.otp=otp
      user.otp_expiry =new Date (Date.now() + 10 * 60 * 1000)
      await user.save()
      await sendMail(
        email,
        `Email Verification Code: ${otp}`,
        `${otp} `
      );
res.json({messeage:"Otp Resend Successfully"})
    }
    
  } catch (error) {
    res.status(500).json({messeage:"Internal Error"})
  }
})

router.post("/checkusername",async(req,res)=>{
  try {
    const {username}= req.body
    const isexist = await User.findOne({username})
    if(isexist){
      return res.json({sucess:false,messeage: "Username Already Taken "})
    }
   return res.json({sucess:true})
  } catch (error) {
    
  }
})
router.post("/checkemail",async(req,res)=>{
  try {
    const {email}= req.body
    const isexist = await User.findOne({email})
    if(isexist && isexist.verified){
      return res.json({sucess:false,messeage: "Email Already Registred "})
    }
   return res.json({sucess:true})
  } catch (error) {
    
  }
})

// router.post("/register", async (req, res) => {
//   try {
//     const { name, username, email, password } = req.body;
//     if (!name || !username || !email || !password) {
//       res.status(401).json("Please enter data");
//     } else {
//       const isexist =
//         (await User.findOne({ email: email }).select("+password")) ||
//         (await User.findOne({ username: username }).select("+password"));
//       if (isexist) {
//         res.status(404).send("User Already Regiterd");
//       } else {
//         const salt = await bcrypt.genSalt(10);
//         const securepass = await bcrypt.hash(password, salt);
//         const newuser = new User({
//           name,
//           username,
//           email,
//           password: securepass,
//         });
//         await newuser.save();

//         const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECREAT);
//         res
//           .cookie("token", token, {
//             expires: new Date(Date.now() + 24657987654687),
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           })
//           .json({ sucess: true, user: newuser });
//       }
//     }
//   } catch (e) {
//     res.status(401).send(e);
//   }
// });

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isexist = await User.findOne({ email: email }).select("+password");
    if (!isexist) {
      return res
        .status(404)
        .json({ sucess: false, messeage: "Invaild Credentials " });
    }

    const passcheck = await bcrypt.compare(password, isexist.password);

    if (!passcheck) {
      return res
        .status(401)
        .json({ sucess: false, messeage: "Invaild Credentials " });
    }

    const token = jwt.sign({ id: isexist._id }, process.env.JWT_SECREAT);

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 24657987654687),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ sucess: true, user: isexist });
  } catch (e) {
    res.status(500).json("some error");
  }
});

router.get("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "none",
      })
      .json("logged out");
  } catch {
    res.json("some error");
  }
});

module.exports = router;
