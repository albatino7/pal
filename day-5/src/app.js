const express = require("express");
const app = express();

app.use(express.json());

const note = [];

app.get("/notes", (req, res) => {
  res.status(200).json({
    notes: note,
  });
});

app.post("/notes", (req, res) => {
  note.push(req.body);
  res.status(200).json({
    notes: note,
  });
});

app.patch("/notes/:index", (req, res) => {
  note[req.params.index].title = req.body.title;
  note[req.params.index].discrption = req.body.discrption;

  res.status(200).json({
    message: "Data updated ",
    note,
  });
});

app.delete("/notes/:index", (req, res) => {
  delete note[req.params.index];

  res.status(200).json({
    message: note,
  });
});

module.exports = app;
