const express = require("express");
const bodyParser = require("body-parser");
const models = require("./models");
const mustacheExpress = require("mustache-express");
const app = express();
const port = process.env.PORT || 8080;
const morgan = require("morgan");

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

// MIDDLEWARE

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// ROUTES

app.use("/", express.static("./public"));

var todos = [];
// var itemID = 0;
// app.get("/", function(req, res) {
//   res.render("index", { todos: todos });
// });

app.get("/", function(req, res) {
  console.log("getting");
  models.tasklist.findAll().then(function(undoneTasks) {
    res.render("index", { todos: undoneTasks });
  });
});

app.post("/addtask", function(req, res) {
  var userToDo = req.body;
  if (userToDo.length == 0) {
    res.redirect("/");
  }

  var newItem = models.tasklist.build(userToDo);
  newItem
    .save()
    .then(function(savedItem) {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/complete", function(req, res) {
  var completeItem = req.body.params;
  res.send(completeItem);
  console.log("Button ID: ", completeItem);
});

// LISTENER

app.listen(port, function(req, res) {
  console.log("Server running on port " + port);
});
