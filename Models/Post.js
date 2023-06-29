const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    ownerid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true
    },
    imageUrl:{
        type: String,
    },
    public_id:{
        type: String,
    },
    ownername:{
        type: String,
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
             ref:"Users"
            
        }
    ],
    comments:[
        {
           username:{
            type: String,
            require:true
           },
          
           userid:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Users"

           },
           comment:{
            type:String,
            require:true
           },
           replies:[
            {
                username:{
                    type: String,
                    require:true
                  
                   },
                   userid:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Users"
        
                   },
                   reply:{
                    type:String,
                    require:true
                   },

            }
           ]

            
        }
    ]

});

const Posts = mongoose.model("Posts", PostSchema);

module.exports = Posts;
