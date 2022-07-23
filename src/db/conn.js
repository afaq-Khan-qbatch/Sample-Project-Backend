const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ProductStore" , {
    useNewUrlParser:true , 
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(()=>console.log("connected successfully.."))
.catch((err)=> console.log("No Connection"));

