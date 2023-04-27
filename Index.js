const express = require('express');



const cors = require("cors")
const app = express();
const port = process.env.PORT || 8000
const Singup = require("./Routes/Singup");
const Authuser = require('./Middleware/authuser');
const cookieParser = require("cookie-parser")


require('dotenv').config({path:'./config.env'})
require("./DB/MongoDb")



app.use(express.json());
app.use(cors({
  credentials:true,

  
}))
app.use(cookieParser())






app.use('/',Singup);
app.use('/user', require("./Routes/Getuser"));
app.use('/user', require("./Routes/Follows"));
app.use('/user', require("./Routes/Postes"));




app.listen(port, function () {
  console.log(`Listening to Port ${port} `);
});
