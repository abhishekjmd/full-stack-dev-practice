const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://abhishek:abhishekcancode@cluster0.vwvymuc.mongodb.net/?appName=Cluster0",
    );
    console.log("mongodb connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
