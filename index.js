import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// import routers
import authRouter from "./api/routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

console.log(PORT);

connectDB();

app.use(express.json());

// User Auth Routes
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

export default app;
