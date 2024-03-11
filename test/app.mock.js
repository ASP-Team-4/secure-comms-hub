const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public")); //static files
app.use(cors()); //GLOBALLY TO BE AMENDED TO JUST SPECIFIC ROUTE

app.set("view engine", "ejs"); //template engine
app.engine("html", require("ejs").renderFile);

//routes
const agentRoutes = require("../routes/agent.routes");
const customerRoutes = require("../routes/customer.routes");

app.get("/", (req, res, next) => {
  return res.status(500).render("index.html");
});

app.use("/agent", agentRoutes);
app.use("/customer", customerRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  return res.status(404).send("URL not found");
});

module.exports = app;
