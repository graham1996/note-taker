const express = require('express');

const notesRoute = require('./notes');
const app = express();

app.use(notesRoute);
module.exports = app;