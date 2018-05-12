var express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require("morgan");
var path = require("path");


// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var db = require('./models');

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

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


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

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Using our Article model, create a new entry
// This effectively passes the result object to the entry (and the title and link)
//var entry = new Article(result);

// Now, save that entry to the db
//             entry.save(function (err, doc) {
//                 // Log any errors
//                 if (err) {
//                     console.log(err);
//                 }
//                 // Or log the doc
//                 else {
//                     console.log(doc);
//                 }
//             });

//         });
//     });
// });

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            // If all Users are successfully found, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    db.Article.findOne(
        {
            // Using the id in the url
            _id: mongojs.ObjectId(req.params.id)
        },
        function (error, found) {
            // log any errors
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the note to the browser
                // This will fire off the success function of the ajax request
                console.log(found);
                res.send(found);
            }
        }
    );
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {

    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))

    // Update the note that matches the object id
    db.Article.update(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            // Set the title, note and modified parameters
            // sent in the req body.
            $set: {
                title: req.body.title,
                summary: req.body.summary,
                link: req.body.link,
                //saved: 
                note: req.body.note
            }
        },
        function (error, edited) {
            // Log any errors from mongojs
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
                console.log(edited);
                res.send(edited);
            }
        }
    );
});

// Delete One from the DB
app.get("/delete/:id", function (req, res) {
    // Remove a note using the objectID
    db.notes.remove(
        {
            _id: mongojs.ObjectID(req.params.id)
        },
        function (error, removed) {
            // Log any errors from mongojs
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
                console.log(removed);
                res.send(removed);
            }
        })
});

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});

