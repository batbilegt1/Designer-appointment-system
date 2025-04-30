const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Нэр оруулах шаардлагатай"],
  },
  email: {
    type: String,
    required: [true, "И-мэйл оруулах шаардлагатай"],
  },
  password: {
    type: String,
    required: [true, "Нууц үг оруулах шаардлагатай"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDesigner: {
    type: Boolean,
    default: false,
  },
  notifcation: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
