const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const itemRoute = require("./routes/itemsRoute");
const billRoute = require("./routes/billRoute");
const dashboardRoute = require("./routes/dashboardRoute");
var cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/item", itemRoute);
app.use("/bill", billRoute);
app.use("/dashboard", dashboardRoute);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
