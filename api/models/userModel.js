import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
  sockets: {
    // The keys will be currency names, and values will be the associated socket instances
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
