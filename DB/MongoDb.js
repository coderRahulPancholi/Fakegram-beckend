const mongoose = require("mongoose");

const db = process.env.MONGO_DATA
mongoose.set('strictQuery', false);

mongoose.connect(db,{
    useNewUrlParser: true,
    
}).then(()=>{ 
    console.log("db sucess")

}).catch((e)=>{
    console.log(e)

})



