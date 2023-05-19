const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  profileUrl:{
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  bio:{
    type:String
  },
  dob:{
    type:String
  },
  city:{
    type:String
  },
  num:{
    type:String
  },
  state:{
    type:String
  },

  password: {
    type: String,
    require: true,
    select:false
  },
  date: {
    type: String,
    default: Date.now,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
