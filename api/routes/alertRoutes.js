import express from "express";
import { verifyToken } from "../middlewares/auth.js";

import {
  getAllAlerts,
  createAlert,
  deleteAlert,
} from "../controllers/alertController.js";

const alertRouter = express.Router();

alertRouter
  .get(":status?/:page?/:limit?", verifyToken, getAllAlerts)
  .post("/create", verifyToken, createAlert)
  .delete("/delete", verifyToken, deleteAlert);

export default alertRouter;
