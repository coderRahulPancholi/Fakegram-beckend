const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    ownerusername:{
        type: String,
        require:true
    },

    caption:{
        type:String,
        require:true
    },
    postedon:{
        type:Date,
        default:Date.now

    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
             ref:"User"
            
        }
    ],
    comments:[
        {
           user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"

           },
           comment:{
            type:String,
            require:true
           }

            
        }
    ]

});

const Posts = mongoose.model("Posts", PostSchema);

module.exports = Posts;
