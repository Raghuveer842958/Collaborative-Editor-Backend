const mongoose=require("mongoose");

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Live-Editor");
        console.log("database successfully connected");
    } catch (error) {
        console.log("Error in database connection :",error);
    }
}

module.exports= connectDB;