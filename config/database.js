const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://raghuveerchauhan7787:q5DRcxyO954WNNqb@cluster0.kmiue.mongodb.net/code-editor?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("database successfully connected to atlas");
  } catch (error) {
    console.log("Error in database connection :", error);
  }
};

module.exports = connectDB;

// "mongodb+srv://raghuveerchauhan7787:q5DRcxyO954WNNqb@cluster0.kmiue.mongodb.net/code-editor?retryWrites=true&w=majority&appName=Cluster0"

// "mongodb://127.0.0.1:27017/Live-Editor"
