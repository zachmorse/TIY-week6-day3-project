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

app.get("/", function(req, res) {
  models.tasklist.findAll().then(function(tasklist) {
    res.render("index", { todos: tasklist });
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
  var tableID = req.body.capture;
  console.log("Button ID:", tableID);
  models.tasklist
    .update({ completed: true }, { where: { id: tableID } })
    .then(function(doneItem) {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/delete", function(req, res) {
  var deleteID = req.body.deletethis;
  models.tasklist
    .destroy({ where: { id: deleteID } })
    .then(function() {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/deleteall", function(req, res) {
  models.tasklist
    .destroy({ where: { completed: true } })
    .then(function() {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

// app.delete("/users/:id", function(req, res) {
//   models.users
//     .destroy({ where: { id: req.params.id } })
//     .then(function() {
//       res.send("User deleted");
//     })
//     .catch(function(err) {
//       res.status(500).send(err);
//     });
// });

// LISTENER

app.listen(port, function(req, res) {
  console.log("Server running on port " + port);
});
