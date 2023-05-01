const mongoose = require("mongoose");

const connectionString =
  process.env.MONGO_URI || "mongodb://localhost:27017/social-network-api";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
