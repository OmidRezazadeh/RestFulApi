const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ toplearn: "Hello World" });
});
app.listen(3000, () => {
  console.log(`Node Api ap is running on port 3000`);
});
