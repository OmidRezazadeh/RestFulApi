const express = require("express");
const path = require("path");
const connectDB = require("./Configs/database");
const app = express();
app.use(express.json());
const dotEnv = require("dotenv");

//* Load Config
dotEnv.config({path: "./configs/config.env"});
connectDB();


app.use(require("./Routes/Api"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Node Api ap is running on port ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
 