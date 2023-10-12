const express = require("express");
const connectDB = require("./configs/database");
const app = express();
const dotEnv = require("dotenv");

//* Load Config
dotEnv.config({path: "./configs/config.env"});
connectDB();

app.get("/", (req, res) => {
  res.status(200).json({ toplearn: "Hello World" });
});

app.get("/blog", (req, res) => {
  res.status(200).json({ toplearn: "Hello blog m" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Node Api ap is running on port ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
