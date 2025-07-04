const mongoose = require("mongoose");

const makeConnection = () => {
  mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
      console.log("MongoDB connected!!");
    })
    .catch((error) => {
      console.log("Failed to connect MongoDB: ", error);
    });
};

module.exports = makeConnection;