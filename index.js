const mongoose = require("mongoose");
const app = require("./server");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
});
