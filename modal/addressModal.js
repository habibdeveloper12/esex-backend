const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  sender: {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    street1: {
      type: String,
      required: true,
    },
    street2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    tax: {
      type: String,
      required: true,
    },
  },
  userEmail: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
