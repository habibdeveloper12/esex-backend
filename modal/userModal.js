const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
  userId: {
    type: Number,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  addressesr: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddressR",
    },
  ],
  defaultAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
});

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ email: this.email }, "DPEEHEOEEPEERUR78USXPEPEEHC", {
    expiresIn: "1h",
  });
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
