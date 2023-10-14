const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const connectDB = require("./Configs/database");
app.use(express.json());
//* Load Config
dotEnv.config({path: "./Configs/config.env"});
app.use("/api/v1/products",require("./Routes/Api"));
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Node Api ap is running on port ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
 