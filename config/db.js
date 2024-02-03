import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbURL = process.env.MONGODB_URL;

const connectDB = () => {
  mongoose.connect(dbURL);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error:"));
  db.once("open", () => {
    console.log("Database connected");
  });
};

export default connectDB;
