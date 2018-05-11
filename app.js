var express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require("morgan");
var path = require("path");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

//Define port
var port = process.env.PORT || 3000

var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));




app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

//Defining MongoDB connection
mongoose.connect('mongodb://localhost/my_database');

// A GET request to scrape the echojs website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    request("https://www.nytimes.com/", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function (i, element) {

            // Save an empty result object
            var result = {};

            // Add the title and summary of every link, and save them as properties of the result object
            result.title = $(this).children("h2").text();
            result.summary = $(this).children(".summary").text();
            result.link = $(this).children("h2").children("a").attr("href");

            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            //var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });

        });
    });
});


    app.listen(port, function () {
        console.log("App running on port " + port);
    });
