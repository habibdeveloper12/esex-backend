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
  wallet: {
    type: Number,
    default: 0,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ email: this.email }, "DPEEHEOEEPEERUR78USXPEPEEHC", {
    expiresIn: "1h",
  });
};
userSchema.methods.updateWallet = async function (amount) {
  // Update the wallet amount
  this.wallet += amount;

  // Save the updated user document to the database
  await this.save();

  // Return the updated wallet amount
  return this.wallet;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
