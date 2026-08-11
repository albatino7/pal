const express = require("express");

const app = express();

const notes = [];
app.use(express.json());

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);

  res.send("notes is Created");
});

app.get("/all-notes", (req, res) => {
  res.send(notes);
});

app.listen(300, () => {
  console.log("Your Sever is Runing on Port 3000");
});
