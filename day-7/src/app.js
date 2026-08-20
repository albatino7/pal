const express = require("express");
const noteModel = require("./model/notes.model");
const app = express();
app.use(express.json());

app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Server is Running Good",
  });
});

app.post("/notes", async (req, res) => {
  const { title, discrption } = req.body;
  const note = await noteModel.create({
    title: title,
    discrption: discrption,
  });

  res.status(200).json({
    message: "note created Sucessfully",
    note,
  });
});

module.exports = app;
