import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../middlewares/auth.js";

// Sign up controller
export const signup = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    });
  }
};

// Login Controller
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Incorrect password.",
      });
    }

    // Generate a JWT token
    const token = createAccessToken({
      userId: user._id,
      username: user.username,
    });

    // Respond with the token
    res.json({
      success: true,
      message: "Authentication successful",
      user: { _id: user._id, username: user.username, alerts: user.alerts },
      token,
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
