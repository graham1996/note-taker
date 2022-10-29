const fs = require('fs');
const path = require('path');
const db = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');
const noteRoute = require('express').Router();
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
function read() {
  return readFileAsync('db/db.json', 'utf8');
};

const writeFileAsync = util.promisify(fs.writeFile);
function write(note) {
  return writeFileAsync('db/db.json', JSON.stringify(note));
}

function getNotes() {
  return read().then((notes) => {
    let parsedNotes;

    try {
      parsedNotes = [].concat(JSON.parse(notes));
    } catch (err) {
      parsedNotes = [];
    }

    return parsedNotes;
  });
}

function saveNote(note) {
  const { title, text } = note;

  if (!title || !text) {
    throw new Error("Note must have title and text");
  }

  const newNote = { title, text, id: uuidv4() };

  return getNotes()
    .then((notes) => [...notes, newNote])
    .then((updatedNotes) => write(updatedNotes))
    .then(() => newNote);
}

function deleteNote(id) {
  return getNotes()
  .then((notes) => notes.filter((note) => note.id !== id))
  .then((removedNotes) => write(removedNotes));
}

noteRoute.get('/notes', (req, res) => {
  fs.readFile("db/db.json", 'utf8', (err, data) => {
    if (err) throw err;
    return res.json(JSON.parse(data))
  })
});

noteRoute.post('/notes', (req, res) => {
  saveNote(req.body)
    .then((note) => res.json(note))
    .catch((err) => res.status(500).json(err));
});

noteRoute.delete('/notes/:id', (req, res) => {
  deleteNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch(err => res.status(500).json(err));
});

module.exports = noteRoute;
