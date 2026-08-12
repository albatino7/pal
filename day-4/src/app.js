const express = require("express");

const app = express();

app.use(express.json());

const notes = [];

app.get("/", (req, res) => {
  res.send("This is Home PAGE");
});

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);
  res.send("Notes creates sucessfully");
});

app.patch("/notes/:index", (req, res) => {
  notes[req.params.index].discrption = req.body.descrption;
  notes[req.params.index].title = req.body.title;

  res.send("Note updated Successfully");
});

app.delete("/notes/:index", (req, res) => {
  console.log(req.params.index);
  delete notes[req.params.index];
  res.send("Notes Updated Sucessfully");
});
module.exports = app;
