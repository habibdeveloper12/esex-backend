const mongoose = require("mongoose");
require('dotenv').config();

mongoose.set('strictQuery', false);
const database = () => {
  const uri = process.env.database_uri;

  console.log("Database URI:", uri); // Add this line for debugging

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
      console.log("mongoose connected");
    })
    .catch((error) => {
      console.log("this is error", error);
    });
};

module.exports = database;
