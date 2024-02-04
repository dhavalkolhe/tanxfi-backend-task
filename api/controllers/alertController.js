import Alert from "../models/alertModel.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const getAllAlerts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;

    const query = { created_by: req.user.userId };

    if (status) {
      query.status = status;
    }

    const alerts = await Alert.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ created_at: -1 });

    const totalAlerts = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Alerts fetched successfully",
      alerts,
      totalAlerts,
      page: Number(page),
      totalPages: Math.ceil(totalAlerts / limit),
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const { price, currency } = req.body;

    // Create a new alert
    const newAlert = new Alert({
      price,
      currency,
      created_by: req.user.userId,
    });

    // Save the alert to the database
    const savedAlert = await newAlert.save();
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { alerts: savedAlert._id },
    });

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      alert: savedAlert,
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const { alertId } = req.body;

    await Alert.findByIdAndDelete(alertId);

    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { alerts: alertId },
    });

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alert:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
