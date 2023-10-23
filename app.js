const express = require("express");
const app = express();
const connectDB = require("./Configs/database");
const dotEnv = require("dotenv");
const {errorHandler} = require("./middlewares/errors");
app.use(express.json());
//* Load Config
dotEnv.config({path: "./Configs/config.env"});
app.use("/api/v1/products",require("./Routes/Api"));
app.use("/api/v1/users",require("./Routes/Auth"));
connectDB();
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Node Api ap is running on port ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
 