// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Define port
const port = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/routes")(app);

// Make public a static dir
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

// Handlebars
app.engine("handlebars", exphbs({ 
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Database configuration with mongoose
mongoose.connect(MONGODB_URI);
//mongoose.connect("mongodb://localhost/mongoscraper");
var db = mongoose.connection;

//Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port
app.listen(port, function() {
  console.log("App running on port " + port);
});
