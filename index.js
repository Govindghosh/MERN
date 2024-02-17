require("dotenv").config();
const express = require("express");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/govind", (req, res) => {
  res.send("hey GOVIND GHOSH");
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
