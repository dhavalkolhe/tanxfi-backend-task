import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import authRouter from "./api/routes/authRoutes.js";
import alertRouter from "./api/routes/alertRoutes.js";
import startWebSocket from "./api/utils/binanceWebSocket.js";
import { verifyToken } from "./api/middlewares/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

const io = new Server(server);
app.set("io", io);

connectDB();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/alerts", alertRouter);
app.use(
  "/activateAlerts",
  verifyToken,
  (req, res, next) => {
    // Attach user information to the socket
    io.use((socket, next) => {
      const user = req.user;
      if (user) {
        socket.request.user = user;

        next();
      } else {
        next(new Error("Authentication failed"));
      }
    });
    startWebSocket(io);
    next();
  },
  (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "All registered alerts for the user has been activated",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Alerts activation failed",
      });
    }
  }
);

export default app;
