import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["created", "deleted", "triggered", "failed"],
    default: "created",
    required: true,
  },
  triggered_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;