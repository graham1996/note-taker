const fs = require('fs');
const path = require('path');
const db = './db/db.json';
const { v4: uuidv4 } = require('uuid');
const noteRoute = require('express').Router();

noteRoute.get('/notes', (req, res) => {
  fs.readFile(db, 'utf8', (err, data) => {
    if (err) throw err;
    return res.json(JSON.parse(data))
  })
});

noteRoute.post('/notes', (req, res) => {
  const {title, text} = req.body;

  if (!title || !text) {
    throw new Error("Note title and text must be filled in!");
  } 
  const newNote = {title, text, id: uuidv4()};

  fs.readFile(db, 'utf8', (err, data) => {
    if (err) throw err;
    let parsedNotes = [].concat(JSON.parse(data));
    return parsedNotes
  })
  .then((parsedNotes) => {
    [...parsedNotes, newNote]
  })
  .then((updatedNotes) => {
    fs.writeFile(db, JSON.stringify(updatedNotes))
  })

});

noteRoute.delete('/notes/:id', (req, res) => {

});

module.exports = noteRoute;